import Instamojo from '../config/instamojo.js';
import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';

const frontend_url = "http://localhost:5173"; 

const placeOrder = async (req, res) => {
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();
    console.log("Order saved:", savedOrder); 
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    const paymentData = {
      purpose: "Order Payment",
      amount: req.body.amount,
      buyer_name: req.body.userName,
      email: req.body.userEmail,
      phone: req.body.userPhone,
      redirect_url: `${frontend_url}/payment-success?order_id=${newOrder._id}`,
    };

    Instamojo.createPayment(paymentData, (error, response) => {
      if (error) {
        console.error("Error creating payment request:", error);
        res.status(500).send("Internal Server Error");
      } else {
        const paymentUrl = JSON.parse(response).payment_request.longurl;
        res.json({ paymentUrl });
      }
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).send("Internal Server Error");
  }
};

const handlePaymentSuccess = async (req, res) => {
  try {
    const { payment_id, payment_request_id } = req.query;

    
    await orderModel.findByIdAndUpdate(req.query.order_id, { payment: true });

    res.redirect(`${frontend_url}/order-success`);
  } catch (error) {
    console.error("Payment verification failed:", error);
    res.redirect(`${frontend_url}/order-failed`);
  }
};

//user orders for frontend
const userOrders=async(req,res)=>{
  try {
    const orders=await orderModel.find({userId:req.body.userId});
    res.json({success:true,data:orders});
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
  }
}

export { placeOrder, handlePaymentSuccess,userOrders};
