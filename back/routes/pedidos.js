const express = require("express");
const router = express.Router();
const Pedido = require("../models/Pedido");
const Cart = require("../models/Cart");
const OrderItem = require("../models/OrderItem");
const nodemailer = require('nodemailer');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;



router.post("/", function(req, res) { 

  var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
      user: 'chequalaizt@gmail.com',
      pass: 'zapallo.1'
   } })
    
   transporter.verify((error, success) => {
    if (error) {
      console.log(error);
    } else {
      console.log('All works fine, congratz!');
    }
  });

   let mailOptions = {
    from: 'Equipo de Chequalaizt',
    name: req.body.name,
    to: req.body.to, 
    subject: 'GRACIAS POR TU COMPRA', 
    html: req.body.messageHtml 
  };

  //[Op.or]: [{userId: req.user.id}, {userId: req.user[0].id}]
  console.log(req.user + 'soy el user debajo de req.user')
  
  let userId = req.user.length ? req.user[0].id : req.user.id
 
  console.log(userId)


  Pedido.create({ userId: userId })
    .then(pedido => {
      console.log('pedido')
      Cart.findAll({ where: { userId: userId} })
        .then(cartArray => {
          return Promise.all(
            cartArray.map(CartItem => {
              return OrderItem.create({
                prodId: CartItem.prodId,
                userId: CartItem.userId,
                pedidoId: pedido.id,
                cantidad: CartItem.cantidad
              });
            })
          );
        })
        .then(rest => transporter.sendMail(mailOptions, (err, data) => {
          if (err) {
            res.json({
              msg: 'fail'
            })
          } else {
            res.json({
              msg: 'success'
            })
          }
        }))
    })
    .catch(err => {
      console.log(err);
      return res.sendStatus(500);
    });
});



router.get("/historial", function(req, res) {
  let userId = req.user.length ? req.user[0].id : req.user.id
  Pedido.findAll({
    where: { userId: userId }
  }).then(arr => {
    let historial = arr.map(async pedido => {
      let items = await OrderItem.findAll({
        where: { pedidoId: pedido.id }
      });
      return { pedido: pedido.id, items: items };
    });
    Promise.all(historial).then(realHistorial =>
      res.status(200).send(realHistorial)
    );
  });
});

module.exports = router;
