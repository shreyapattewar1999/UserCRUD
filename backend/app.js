import express from "express";
import cors from "cors";
import { connectToDB, createTable } from "./controller.js";
import {
  insertData,
  insertUser,
  deleteUser,
  updateUser,
  fetchUsers,
} from "./controller.js";

const app = express();
app.use(cors());
app.use(express.json());

const pool = connectToDB();
createTable(pool);
insertData(pool);

app.post("/api/", insertUser);

app.get("/api/", fetchUsers);

app.delete("/api/:id/", deleteUser, fetchUsers);

app.put("/api/:id/", updateUser, fetchUsers);

app.listen(5000, () => {
  console.log("Server listenening on port 5000");
});
