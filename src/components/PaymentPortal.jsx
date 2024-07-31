import React, { useEffect, useState } from "react";
import {
  CardElement,
  useStripe,
  useElements,
  Elements
} from "@stripe/react-stripe-js";
import { useLocation } from "react-router-dom";
import "./PaymentPortal.css";

function PaymentPortal() {
  // Initialize Stripe and Elements for card processing
  const stripe = useStripe();
  const elements = useElements();

  // React Router hook to get the current location
  const location = useLocation();

  // State variables to store user information
  const [name, setName] = useState(""); // Billing name
  const [addressLine1, setAddressLine1] = useState(""); // Address Line 1
  const [addressLine2, setAddressLine2] = useState(""); // Address Line 2
  const [city, setCity] = useState(""); // City
  const [country, setCountry] = useState(""); // Country
  const [phoneNumber, setPhoneNumber] = useState(""); // Phone Number
  const [email, setEmail] = useState(""); // Email

  // useEffect to log the current URL when the location changes
  useEffect(() => {
    console.log("Current URL:", location.pathname);
  }, [location]);

  // Function to handle the form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // Create a PaymentMethod with the card element and billing details
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
      billing_details: {
        name: name,
        address: {
          line1: addressLine1,
          line2: addressLine2,
          city: city,
          country: country
        },
        phone: phoneNumber,
        email: email
      }
    });

    if (error) {
      console.error(error);
    } else {
      // Handle the successful payment, e.g., send payment details to your server
      console.log("PaymentMethod:", paymentMethod);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h3>Devlink Premium Pay </h3>

        <p1 className="sub-head">
          Devlink payment is a subscription based fee of 15 AUD Per month
        </p1>
        <br></br>
        <br></br>
        <p1 className="sub-head">Personal Details </p1>
        <label>
          Phone Number:
          <input
            type="tel"
            className="input"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br></br>

        <p1>Card Information</p1>
        <label>
          Card details:
          <CardElement className="StripeElement" />
        </label>
        <label>
          Name on card:
          <input
            type="text"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br></br>
        <p1>Shipping Information</p1>
        <label>
          Billing address Line 1:
          <input
            type="text"
            className="input"
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            required
          />
        </label>
        <label>
          Billing address Line 2:
          <input
            type="text"
            className="input"
            value={addressLine2}
            onChange={(e) => setAddressLine2(e.target.value)}
          />
        </label>
        <label>
          City:
          <input
            type="text"
            className="input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </label>
        <label>
          Country:
          <select
            className="select-input"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          >
            <option value="">Select Country</option>
            <option value="AU">Australia</option>
            <option value="NZ">New Zealand</option>
            <option value="SP">Singapore</option>
            <option value="ID">Indonesia</option>
            <option value="CH">China</option>
            <option value="JP">Japan</option>
            <option value="KR">Korea</option>
            <option value="TW">Taiwan</option>
          </select>
        </label>

        <button type="submit" className="submitButton">
          Pay
        </button>
      </form>
    </div>
  );
}

export default PaymentPortal;
