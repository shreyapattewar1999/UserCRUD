import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import UserUpdate from "./UserUpdate";

const API = process.env.REACT_APP_API_URL;
const Dashboard = () => {
  const [users, setUsers] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [actionType, setActionType] = useState("");
  const handleCloseModal = () => {
    getUsers();
    setShowModal(false);
  };
  const handleShowModal = () => setShowModal(true);
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    getUsers();
  }, []);

  function formatDate(incomingDate) {
    // Get day, month, and year from the date object
    const date = new Date(incomingDate);
    let day = date.getDate();
    let month = date.getMonth() + 1; // Month starts from 0
    let year = date.getFullYear();

    // Pad day and month with leading zeros if they are single digits
    if (day < 10) {
      day = "0" + day;
    }
    if (month < 10) {
      month = "0" + month;
    }

    // Format the date as dd-mm-yyyy
    return year + "-" + month + "-" + day;
  }

  const getUsers = async () => {
    const response = await fetch(API);
    const { data } = await response.json();
    // console.log(data);
    setUsers(data);
  };

  const deleteUser = async (user) => {
    const options = { method: "DELETE" };
    const response = await fetch(API + user.id, options);
    const { data } = await response.json();
    setUsers(data);
  };

  if (!users) {
    return;
  }

  return (
    <div style={{ paddingTop: "2%" }}>
      <Button
        variant="info"
        onClick={(e) => {
          e.preventDefault();
          setActionType("Add");
          handleShowModal();
        }}
      >
        Add New User
      </Button>
      <Table striped bordered hover style={{ margin: "2%", width: "90%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Date of Birth</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => {
            return (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{formatDate(user.dob)}</td>
                <td>
                  <Button
                    variant="warning"
                    onClick={(e) => {
                      e.preventDefault();
                      setActionType("Update");
                      setUserDetails(user);
                      handleShowModal();
                    }}
                  >
                    Edit
                  </Button>
                </td>
                <td>
                  <Button
                    variant="dark"
                    onClick={(e) => {
                      e.preventDefault();
                      deleteUser(user);
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      {showModal && (
        <UserUpdate
          showModal={showModal}
          setShowModal={setShowModal}
          handleCloseModal={handleCloseModal}
          handleShowModal={handleShowModal}
          actionType={actionType}
          userDetails={userDetails}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};

export default Dashboard;
