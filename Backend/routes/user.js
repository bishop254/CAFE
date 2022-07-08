const connection = require("../connection");
const express = require("express");
const { query } = require("../connection");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

router.post("/signup", (req, res) => {
  let user = req.body;

  let query = "select email, password, role, status from user where email=?";
  connection.query(query, [user.email], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        let query =
          "insert into user(name, phone, email, password, status, role) values(?, ?, ?, ?, 'false', 'user')";

        connection.query(
          query,
          [user.name, user.phone, user.email, user.password],
          (err, results) => {
            if (!err) {
              return res.status(200).json({
                message: "Successfully registered",
              });
            } else {
              return res.status(500).json({ err });
            }
          }
        );
      } else {
        return res.status(400).json({ message: "Email already exists" });
      }
    } else {
      return res.status(500).json({ err });
    }
  });
});

router.post("/login", (req, res) => {
  const user = req.body;

  let query = "select email, password, role, status from user where email=?";
  connection.query(query, [user.email], (err, results) => {
    if (!err) {
      if (results.length <= 0 || results[0].password !== user.password) {
        return res.status(401).json({ message: "Incorrect username/password" });
      } else if (results[0].status === 'false') {
        return res.status(401).json({ message: "Await admin approval" });
      } else if (results[0].password === user.password) {
        const response = {
          email: results[0].email,
          role: results[0].role,
        };

        const accessToken = jwt.sign(response, process.env.SECRET, {
          expiresIn: "1h",
        });

        res.status(200).json({
          token: accessToken,
          message: "User logged in",
        });
      } else {
        return res
          .status(400)
          .json({ message: "Something went wrong. Please try again!" });
      }
    } else {
      return res.status(500).json({ err });
    }
  });
});

module.exports = router;
