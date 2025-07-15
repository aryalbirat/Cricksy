// import React, { useEffect, useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import axios from "axios";

// const PaymentSuccess = () => {
//   const location = useLocation();
//   const [paymentStatus, setPaymentStatus] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Extract query parameters from the URL
//   const params = new URLSearchParams(location.search);
//   const pidx = params.get("pidx");
//   const transactionId = params.get("transaction_id");
//   const amount = params.get("amount");
//   const purchaseOrderId = params.get("purchase_order_id");

//   useEffect(() => {
//     const verifyPayment = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(
//           "http://localhost:8000/api/payment/callback",
//           {
//             params: {
//               pidx,
//               transaction_id: transactionId,
//               amount,
//               purchase_order_id: purchaseOrderId,
//             },
//           }
//         );

//             // Log the response to see what you are getting
//             console.log(response);

//         if (response.status === 200) {
//           setPaymentStatus("success");
//         } else {
//           setPaymentStatus("failure");
//         }
//       } catch (err) {
//         setPaymentStatus("failure"); 
//         setError("Payment verification failed. Please try again.");
        
//       } finally {
//         setLoading(false);
//       }
//     };

//     verifyPayment();
//   }, [pidx, transactionId, amount, purchaseOrderId]);

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen">
//         <h1 className="text-3xl font-bold mb-4">Verifying Payment...</h1>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       <h1 className="text-3xl font-bold mb-4">
//         {paymentStatus === "success"
//           ? "Payment Successful!"
//           : "Payment Failed!"}
//       </h1>
//       {paymentStatus === "success" && (
//         <p className="text-lg mb-8">Your booking is confirmed. Thank you!</p>
//       )}
//       {paymentStatus === "failure" && (
//         <p className="text-lg mb-8">
//           There was an issue with your payment. Please try again.
//         </p>
//       )}
//       {error && <p className="text-red-500 mb-8">{error}</p>}
//       <Link
//         to="/"
//         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//       >
//         Go to Home
//       </Link>
//     </div>
//   );
// };

// export default PaymentSuccess;

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";

const PaymentSuccess = () => {
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract query parameters from the URL
  const params = new URLSearchParams(location.search);
  const pidx = params.get("pidx");
  const transactionId = params.get("transaction_id");
  const amount = params.get("amount");
  const purchaseOrderId = params.get("purchase_order_id");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        setLoading(true);

        // Send GET request to verify the payment status
        const response = await axios.get("http://localhost:8000/api/payment/callback", {
          params: {
            pidx,
            transaction_id: transactionId,
            amount,
            purchase_order_id: purchaseOrderId,
          },
        });

        console.log("Full response:", response);
        console.log("Response data:", response.data);

        // Check if payment is successful
        if (response.status === 200 && response.data.status === "success") {
          setPaymentStatus("success");
          
        } else {
          setPaymentStatus("failure");
          setError(response.data.message || "Payment failed.");
        }
      } catch (err) {
        console.error("Payment verification error:", err.response?.data || err.message);
        setPaymentStatus("failure");
        setError("");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [pidx, transactionId, amount, purchaseOrderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-blue to-accent-blue flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <FaSpinner className="text-6xl text-primary animate-spin mb-4" />
          <h1 className="text-3xl font-bold text-white mb-4">Verifying Payment...</h1>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-blue to-accent-blue flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 max-w-md w-full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          {paymentStatus === "success" ? (
            <FaCheckCircle className="text-6xl text-green-400 mx-auto" />
          ) : (
            <FaTimesCircle className="text-6xl text-red-400 mx-auto" />
          )}
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-3xl font-bold mb-4 text-white"
        >
          {paymentStatus === "success" ? "Payment Successful!" : "Payment Cancelled!"}
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {paymentStatus === "success" && (
            <p className="text-lg mb-8 text-white/90">Your booking is confirmed. Thank you!</p>
          )}
          {paymentStatus === "failure" && (
            <p className="text-lg mb-8 text-white/90">
              Your payment has been cancelled.
            </p>
          )}
          {error && <p className="text-red-400 mb-8">{error}</p>}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Link
            to="/"
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Go to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
