const express = require("express");
const connection = require("../connection");
const auth = require("../services/auth");
const role = require("../services/checkRole");

const router = express.Router();

router.post("/add", auth.authenticate, role.checkRole, (req, res) => {
  let product = req.body;
  let query =
    'insert into product (name, categoryID, description, price, status) values(?,?,?,?,"true")';

  connection.query(
    query,
    [product.name, product.categoryID, product.description, product.price],
    (err, results) => {
      if (!err) {
        return res.status(200).json({ message: "Product added successfully" });
      } else {
        return res.status(500).json({ err });
      }
    }
  );
});

router.get("/get", auth.authenticate, (req, res, next) => {
  let query =
    "select p.id, p.name, p.description, p.price, p.status, c.id as categoryID, c.name as categoryName from product as p INNER JOIN category as c where p.categoryID=c.id ";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json({ data: results });
    } else {
      return res.status(500).json({ err });
    }
  });
});

router.get("/getByCategoryID/:id", auth.authenticate, (req, res, next) => {
  const id = req.params.id;
  let query =
    'select id, name from product where categoryID=? and status="true"';
  connection.query(query, [id], (err, results) => {
    if (!err) {
      return res.status(200).json({ data: results });
    } else {
      return res.status(500).json({ err });
    }
  });
});

router.get("/getByID/:id", (req, res, next) => {
  const id = req.params.id;
  let query = "select id,name,description,price from product where id=?";
  connection.query(query, [id], (err, results) => {
    if (!err) {
      return res.status(200).json({ data: results[0] });
    } else {
      return res.status(500).json({ err });
    }
  });
});

router.patch("/update", auth.authenticate, role.checkRole, (req, res, next) => {
  let product = req.body;
  let query =
    "update product set name=?, categoryID=?, description=?, price=?, where id=?";
  connection.query(
    query,
    [
      product.name,
      product.categoryID,
      product.description,
      product.price,
      product.id,
    ],
    (err, results) => {
      if (!err) {
        if (results.affectedRows == 0) {
          return res.status(404).json({ message: "Product ID not found" });
        }
        return res
          .status(200)
          .json({ message: "product updated successfully" });
      } else {
        return res.status(500).json({ err });
      }
    }
  );
});

router.delete(
  "/delete/:id",
  auth.authenticate,
  role.checkRole,
  (req, res, next) => {
    const id = req.params.id;
    let query = "delete from product where id=?";
    connection.query(query, [id], (err, results) => {
      if (!err) {
        if (results.affectedRows == 0) {
          return res.status(404).json({ message: "Product ID not found" });
        }
        return res
          .status(200)
          .json({ message: "Product deleted successfully" });
      } else {
        return res.status(500).json({ err });
      }
    });
  }
);

router.patch(
  "/updateStatus",
  auth.authenticate,
  role.checkRole,
  (req, res, next) => {
    const product = req.body;
    let query = "update product set status=? where id=?";
    connection.query(query, [product.status, product.id], (err, results) => {
      if (!err) {
        if (results.affectedRows == 0) {
          return res.status(404).json({ message: "Product ID not found" });
        }
        return res
          .status(200)
          .json({ message: "Product status has been updated successfully" });
      } else {
        return res.status(500).json({ err });
      }
    });
  }
);

module.exports = router;
