const express=require('express');
const bodyParser=require('body-parser');
const Razorpay=require('razorpay');
const path=require('path')
const app=express();

app.use(bodyParser.json());

// Create a new instance of the Razorpay client with your API keys(Instantiate the Razorpay Instance)
var instance = new Razorpay({
    key_id: 'rzp_test_idNIYZeNs4uhA5',
    key_secret: 'm8h6rjX0bS5pPoV1IYcc254I',
  });
  app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'))
  })

  app.post('/create/orderId',(req,res)=>{
    // Define options for creating a new order
var options = {
    amount: req.body.amount,
    currency: "INR",
    receipt: "order_rcptid_11"
  };
  
  // Use the instance to create a new order with the specified options
  instance.orders.create(options, function(err, order) {
    if (err) {
      console.error(err);
    } else {
      console.log(order);
      res.send({orderId:order.id})
    }
  });
  });

  let razorpayOrderId;
  let razorpayPaymentId;
  let signature;
  
  app.post('/payment/verify',(req,res)=>{
    razorpayPaymentId=req.body.response.razorpay_payment_id;
    razorpayOrderId=req.body.response.razorpay_order_id;
    signature=req.body.response.razorpay_signature;   
//Verify Payment Signature
let body=razorpayOrderId + "|" + razorpayPaymentId;
const crypto=require('crypto');
let expectedSignature=crypto.createHmac('sha256','m8h6rjX0bS5pPoV1IYcc254I' )
                            .update(body.toString())
                            .digest('hex');
      let response={signatureIsValid:"false"};
      if(expectedSignature===signature){
        response={signatureIsValid:'true'};
        res.send(response);
      }
      
  })


app.listen(3000,()=>console.log('sever started'))