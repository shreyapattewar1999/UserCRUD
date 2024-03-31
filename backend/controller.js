import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

var pool;
export async function connectToDB() {
  pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
  });
  return pool;
}

export const createTable = async () => {
  try {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    dob DATE NOT NULL
    );`);

    return pool;
  } catch (error) {
    console.log(error);
  }
};

const insertData = async () => {
  await pool.query("TRUNCATE TABLE user");
  await pool.query(`INSERT INTO user (name, email, password, dob) VALUES
('John Doe', 'john@example.com', 'password123', '1990-05-15'),
('Jane Smith', 'jane@example.com', 'securepass456', '1985-08-20'),
('Alice Johnson', 'alice@example.com', 'strongpassword789', '1995-03-10');`);
};

const insertUser = async (req, res) => {
  try {
    const { name, email, password, dob } = req.body;
    // const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      `INSERT INTO user (name, email, password, dob) VALUES (?,?,?,?)`,
      [name, email, password, dob]
    );
    // console.log(result);
    return res.status(201).json({ data: result?.insertId });
  } catch (error) {
    // console.log(error);
    res.status(400).json({ message: "Server error" });
  }
};

const fetchUsers = async (req, res) => {
  try {
    let [result] = await pool.query("SELECT * FROM USER");
    result = result.map((res) => {
      const { password, ...userData } = res;
      return userData;
    });
    return res.status(200).json({ data: result });
  } catch (error) {
    res.status(400).json({ message: "Server error" });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;

    await pool.query("DELETE FROM USER WHERE id = ?", [parseInt(id, 10)]);
    // console.log(result);
    next();
    // return res.status(200).json({ data: "User deleted" });
  } catch (error) {
    // console.log(error);
    res.status(400).json({ message: "Server error" });
  }
};

const updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { dob, email, name } = req.body;

    await pool.query(
      "UPDATE USER SET name = ?, email = ?, dob = ? WHERE id = ?",
      [name, email, dob, id]
    );
    next();
  } catch (error) {
    // console.log(error);
    res.status(400).json({ message: "Server error" });
  }
};

export { insertData, insertUser, deleteUser, updateUser, fetchUsers };
