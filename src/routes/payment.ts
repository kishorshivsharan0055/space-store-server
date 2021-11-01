import crypto from "crypto";
import dotenv from "dotenv";
import express from "express";
import Razorpay from "razorpay";
import shortid from "shortid";

dotenv.config();

const router = express.Router();

router.post("/orders", async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET_KEY,
    });

    const options = {
      amount: req.body.params.amount * 100,
      currency: "INR",
      receipt: shortid.generate(),
    };

    const order = await instance.orders.create(options);
    console.log(order);

    if (!order) return res.status(500).send("some error occured");

    return res.json(order);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.post("/verification", (req, res) => {
  const SECRET = "SPACESTORE1234567";
  console.log(req.body);
  const shasum = crypto.createHmac("sha256", SECRET);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");
  console.log(digest, req.headers["x-razorpay-signature"]);

  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("request is legit");
  } else {
    //invalid request
  }
  res.json({ status: "ok" });
});

module.exports = router;
