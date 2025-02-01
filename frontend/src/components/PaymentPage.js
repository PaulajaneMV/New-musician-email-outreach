import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import { Form, Input, Button, message } from "antd";
import "./styles/paymentPage.css";
import { useSearchParams, useNavigate } from "react-router-dom";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({ campaignId, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (!stripe || !elements) {
        throw new Error("Stripe is not properly loaded. Please try again.");
      }

      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Please log in to make a payment');
        navigate('/login');
        return;
      }

      const { data } = await axios.post(
        "https://musician-email-backend-08dfa4e34da5.herokuapp.com/api/endpoint",
        {
          name: values.name,
          email: values.email,
          amount,
          campaignId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const { clientSecret } = data;
      if (!clientSecret) {
        throw new Error("Failed to create payment intent. Please try again.");
      }

      const cardElement = elements.getElement(CardElement);
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: values.name,
            email: values.email,
          },
        },
      });

      if (error) throw new Error(error.message);

      if (paymentIntent?.status === "succeeded") {
        await axios.post(
          `https://musician-email-backend-08dfa4e34da5.herokuapp.com/api/payment/confirm/${campaignId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        message.success("Payment successful!");
        navigate('/email-campaigns');
      }
    } catch (error) {
      console.error('Payment error:', error);
      message.error(error.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-form">
      <h2>Make a Payment</h2>
      <Form onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input placeholder="Enter your name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item label="Amount">
          <Input value={`$${amount}`} disabled />
        </Form.Item>

        <Form.Item label="Card Details">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={!stripe}
          block
        >
          Pay Now
        </Button>
      </Form>
    </div>
  );
};

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const campaignId = searchParams.get("campaignId");
  const amount = searchParams.get("amount");

  if (!campaignId || !amount) {
    return <div className="payment-error">Error: Missing required payment information</div>;
  }

  return (
    <Elements stripe={stripePromise}>
      <div className="payment-page-container">
        <h1>Make a Payment</h1>
        <PaymentForm campaignId={campaignId} amount={amount} />
      </div>
    </Elements>
  );
};

export default PaymentPage;
