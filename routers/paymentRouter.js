var express = require('express');
var router = express.Router();
var moment = require('moment');
var eventModel = require('../models/promotionModel');
var helperFunc = require('../lib/helperFunc');
var gcm = require('node-gcm');

var braintree = require("braintree");

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "wvykywnjh65c7sm2",
  publicKey: "8m3jj7bwfkb6kfrf",
  privateKey: "750ae11c3d42264d9016c5e4af0ad3b1"
});

router.get('/client_token', function (request, response){
  gateway.clientToken.generate({}, function (err, res) {
    return response.send(res.clientToken);
  });
});


router.post("/checkout", function (req, res) {
  var nonce = req.body.nonce; //'fake-valid-nonce';//''
      // Use payment method nonce here
      	gateway.transaction.sale({
    	  amount: req.body.price,
    	  paymentMethodNonce: nonce,
    	  options: {
    	    submitForSettlement: true
    	  }
    	}, function (err, result) {
        if(err){
          res.json(err);
        }
        eventModel.findOne({ _id : req.body.event_id},function (err, ticket){
          if(err){
            return res.status(500).send({"message" : "Internal Server Error", "err" : err}).end();
          }
          if(ticket == null){
            return res.status(400).send({"message" : "Invalid Event"}).end();
          }
          var total_tickets = ticket.remaining_tickets;
          var order = 1;
          var remaining_ticket = total_tickets - order;
          ticket.remaining_tickets = remaining_ticket;
          ticket.save(function (error,result){
            if(error){
              return res.status(500).send({"message" : "Internal Server Error", "err" : error}).end();
            }
            var subject = "Order Updated";
            delete result.__v;
            res.status(200).send(result).end();
          })
      })
    	});
});

module.exports = router;