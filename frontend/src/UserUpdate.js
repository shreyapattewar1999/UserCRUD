import React, { useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import bcrypt from "bcryptjs";

const API = process.env.REACT_APP_API_URL;

const UserUpdate = ({
  showModal,
  setShowModal,
  handleCloseModal,
  handleShowModal,
  actionType,
  userDetails,
  formatDate,
}) => {
  const nameRef = useRef();
  const emailRef = useRef();
  const dobRef = useRef();
  const passwordRef = useRef();
  const [errorMsgs, setErrorMsgs] = useState({
    nameError: "",
    dobError: "",
    passwordError: "",
    emailError: "",
  });

  const validatePasword = (password) => {
    // Check if password length is at least 8 characters
    if (password.length < 8) {
      return [false, "Password must be at least 8 characters long."];
    }

    // Check if password contains at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return [false, "Password must contain at least one uppercase letter."];
    }

    // Check if password contains at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      return [false, "Password must contain at least one lowercase letter."];
    }

    // Check if password contains at least one number
    if (!/\d/.test(password)) {
      return [false, "Password must contain at least one number."];
    }

    // Check if password contains at least one special character
    if (!/[!@#$%^&*()-=_+[\]{};':"\\|,.<>/?]/.test(password)) {
      return [false, "Password must contain at least one special character."];
    }

    // If all criteria pass, return true
    return [true];
  };

  function validateName(name) {
    // Check if the name is empty
    if (name.trim() === "") {
      setErrorMsgs({ ...errorMsgs, nameError: "Name cannot be empty." });
      return false;
    }

    // Check if the name contains only letters and spaces
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      setErrorMsgs({
        ...errorMsgs,
        nameError: "Name can only contain letters and spaces.",
      });
      return false;
    }

    // Check if the name is too short
    if (name.length < 2) {
      setErrorMsgs({
        ...errorMsgs,
        nameError: "Name should be at least 2 characters long.",
      });
      return false;
    }

    // Check if the name is too long
    if (name.length > 50) {
      setErrorMsgs({
        ...errorMsgs,
        nameError: "Name should not exceed 50 characters.",
      });
      return false;
    }

    // If all criteria pass, return true
    return true;
  }

  function validateEmail(email) {
    // Regular expression for validating an email address
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if the email matches the regular expression
    if (!emailRegex.test(email)) {
      setErrorMsgs({ ...errorMsgs, emailError: "Invalid email address." });
      return false;
    }

    // If the email is valid, return true
    return true;
  }

  function validateDate(dateString) {
    // Create a Date object from the input string
    var date = new Date(dateString);

    // Check if the input string is a valid date and it's not NaN
    if (
      Object.prototype.toString.call(date) !== "[object Date]" ||
      isNaN(date.getTime())
    ) {
      setErrorMsgs({ ...errorMsgs, dobError: "Invalid date." });
      return false;
    }

    // If the date is valid, return true
    return true;
  }

  const updateUser = async () => {
    let apiUrl = API + (actionType === "Update" ? +userDetails.id : "");
    let userData = {
      name: nameRef.current?.value,
      email: emailRef.current?.value,
      dob: dobRef.current?.value,
    };

    const isNameValid = validateName(nameRef.current.value);
    if (!isNameValid) {
      nameRef.current.focus();
      return;
    }

    const isEmailValid = validateEmail(emailRef.current.value);
    if (!isEmailValid) {
      emailRef.current.focus();
      return;
    }

    const isDateValid = validateDate(dobRef.current.value);
    if (!isDateValid) {
      dobRef.current.focus();
      return;
    }
    if (actionType === "Add") {
      const [isPasswordValid, errorMsg] = validatePasword(
        passwordRef.current.value
      );
      if (!isPasswordValid) {
        passwordRef.current.focus();
        setErrorMsgs({ passwordError: errorMsg });

        return;
      }

      setErrorMsgs({ passwordError: "" });
      const hashedPassword = await bcrypt.hash(passwordRef.current.value, 10);
      userData = { ...userData, password: hashedPassword };
    }

    setErrorMsgs({
      nameError: "",
      dobError: "",
      passwordError: "",
      emailError: "",
    });

    const options = {
      method: actionType === "Update" ? "PUT" : "POST",
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(apiUrl, options);
    const data = await response.json();
    handleCloseModal();
  };

  return (
    <div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{actionType}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                ref={nameRef}
                style={{
                  border: errorMsgs?.nameError?.length > 0 && "1px solid red",
                }}
                defaultValue={actionType === "Update" ? userDetails?.name : ""}
              />
              <Form.Text id="nameHelpBlock" muted>
                {errorMsgs?.nameError}
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                ref={emailRef}
                style={{
                  border: errorMsgs?.emailError?.length > 0 && "1px solid red",
                }}
                defaultValue={actionType === "Update" ? userDetails?.email : ""}
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
              <Form.Text id="emailHelpBlock" muted>
                {errorMsgs?.emailError}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicdob">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                placeholder="Enter Date of Birth"
                ref={dobRef}
                style={{
                  border: errorMsgs?.dobError?.length > 0 && "1px solid red",
                }}
                defaultValue={
                  actionType === "Update" ? formatDate(userDetails?.dob) : ""
                }
              />
              <Form.Text id="dobHelpBlock" muted>
                {errorMsgs?.dobError}
              </Form.Text>
            </Form.Group>

            {actionType === "Add" && (
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  ref={passwordRef}
                  style={{
                    border:
                      errorMsgs?.passwordError?.length > 0 && "1px solid red",
                  }}
                  defaultValue={
                    actionType === "Update" ? userDetails?.password : ""
                  }
                />
                <Form.Text id="passwordHelpBlock" muted>
                  {errorMsgs?.passwordError}
                </Form.Text>
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={updateUser}>
            {actionType === "Update" ? "Update user details" : "Add new user"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserUpdate;
