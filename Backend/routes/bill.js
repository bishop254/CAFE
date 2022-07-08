const express = require("express");
const connection = require("../connection");
const auth = require("../services/auth");
const ejs = require("ejs");
const pdf = require("html-pdf");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");

const router = express.Router();

router.post("/generateReport", auth.authenticate, (req, res) => {
  const orderDetails = req.body;
  const generatedUUID = uuid.v1();
  let productDetailsReport = JSON.parse(orderDetails.productDetails);

  let query =
    "insert into bill (name, uuid, email, contactNumber, paymentMethod, total, productDetails, createdBy) values(?,?,?,?,?,?,?,?)";

  connection.query(
    query,
    [
      orderDetails.name,
      generatedUUID,
      orderDetails.email,
      orderDetails.contactNumber,
      orderDetails.paymentMethod,
      orderDetails.totalAmount,
      orderDetails.productDetails,
      res.locals.email,
    ],
    (err, results) => {
      if (!err) {
        ejs.renderFile(
          path.join(__dirname, "", "report.ejs"),
          {
            productDetails: productDetailsReport,
            name: orderDetails.name,
            email: orderDetails.email,
            contactNumber: orderDetails.contactNumber,
            paymentMethod: orderDetails.paymentMethod,
            totalAmount: orderDetails.totalAmount,
          },
          (err, results) => {
            if (err) {
              return res.status(500).json({ err });
            } else {
              pdf
                .create(results)
                .toFile(
                  "../generated_PDF/" + generatedUUID + ".pdf",
                  (err, data) => {
                    if (err) {
                      console.log(err);
                      return res.status(500).json({ err });
                    } else {
                      return res.status(200).json({ uuid: generatedUUID });
                    }
                  }
                );
            }
          }
        );
      } else {
        return res.status(500).json({ err });
      }
    }
  );
});

router.post("/getPDF", auth.authenticate, (req, res) => {
  const orderDetails = req.body;
  const pdfPath = "../generated_PDF/" + orderDetails.uuid + ".pdf";
  if (fs.existsSync(pdfPath)) {
    res.contentType("application/pdf");
    fs.createReadStream(pdfPath).pipe(res);
  } else {
    let productDetailsReport = JSON.parse(orderDetails.productDetails);
    ejs.renderFile(
      path.join(__dirname, "", "report.ejs"),
      {
        productDetails: productDetailsReport,
        name: orderDetails.name,
        email: orderDetails.email,
        contactNumber: orderDetails.contactNumber,
        paymentMethod: orderDetails.paymentMethod,
        totalAmount: orderDetails.totalAmount,
      },
      (err, results) => {
        if (err) {
          return res.status(200).json({ err });
        } else {
          pdf
            .create(results)
            .toFile(
              "./generated_PDF/" + orderDetails.uuid + ".pdf",
              (err, data) => {
                if (err) {
                  console.log(err);
                  return res.status(500).json({ err });
                } else {
                  res.contentType("application/pdf");
                  fs.createReadStream(pdfPath).pipe(res);
                }
              }
            );
        }
      }
    );
  }
});

router.get("/getBIlls", auth.authenticate, (req, res, next) => {
  let query = "select * from bill order by id DESC";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json({ data: results });
    } else {
      return res.status(500).json({ err });
    }
  });
});

router.delete("/delete/:id", auth.authenticate, (req, res, next) => {
  const id = req.params.id;
  let query = "delete from bill where id=?";
  connection.query(query, [id], (err, results) => {
    if (!err) {
      if (results.affectedRows == 0) {
        return res.status(404).json({ message: "Bill ID not found" });
      }
      return res.status(200).json({ message: "Bill deleted successfully" });
    } else {
      return res.status(500).json({ err });
    }
  });
});

module.exports = router;
