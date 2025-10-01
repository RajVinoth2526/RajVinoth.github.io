/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const functions = require("firebase-functions");
const axios = require("axios");

exports.processPayment = functions.https.onRequest(async (req: any, res: any) => {
  try {
    const { token, total } = req.body;

    // Replace with your 2Checkout API credentials
    const username = "vinothraj2526@gmail.com";
    const password = "VRoshani2526";

    const paymentData = {
      merchantOrderId: Date.now().toString(), // Unique order ID
      token: token,
      currency: "LKR",
      total: total,
    };

    // Send payment request to 2Checkout API
    const response = await axios.post(
      "https://sandbox.2checkout.com/rest/v1.0/payments/",
      paymentData,
      {
        auth: {
          username,
          password,
        },
      }
    );

    res.status(200).send({ success: true, data: response.data });
  } catch (error: any) {
    console.error("Payment Error:", error.message);
    res.status(500).send({ success: false, error: error.message });
  }
});
