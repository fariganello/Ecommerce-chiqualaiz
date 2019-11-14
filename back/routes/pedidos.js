const express = require("express");
const router = express.Router();
const Pedido = require("../models/Pedido");
const Cart = require("../models/Cart");
const Book = require("../models/Book");
const OrderItem = require("../models/OrderItem");
const nodemailer = require("nodemailer");

router.post("/", function(req, res) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
      user: "chequalaizt@gmail.com",
      pass: "zapallo.1"
    }
  });

  transporter.verify((error, success) => {
    if (error) {
      console.log(error);
    } else {
      console.log("All works fine, congratz!");
    }
  });

  let mailOptions = {
    from: "Equipo de Chequalaizt",
    name: req.body.name,
    to: req.body.to,
    subject: "GRACIAS POR TU COMPRA",
    html: req.body.messageHtml
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log(err);
      return res.sendStatus(404);
    } else {
      console.log("success");
      return res.sendStatus(200);
    }
  });
});

router.get("/historial", function(req, res) {
  Pedido.findAll({
    where: { userId: req.user.id }
  })
    .then(arr => {
      return Promise.all(
        arr.map(async pedido => {
          let items = await OrderItem.findAll({
            where: { pedidoId: pedido.id }
          });
          return { pedido: pedido.id, items };
        })
      );
    })
    .then(realHistorial => {
      return res.status(200).send(realHistorial);
    })
    .catch(err => res.status(404).send(err));
});

module.exports = router;
