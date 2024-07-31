import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  Navigation,
  Footer,
  Home,
  FindJob,
  Create,
  Login,
  BrowseJob,
  MessagingPage,
  SettingsPage,
  PaymentPortal,
  Customers,
  Freelancers
} from "./components";

// Load Stripe with the provided API key
const stripePromise = loadStripe(
  "pk_test_51Nnay7AAAIjoNPpH9ncozIFvCjxJIJJ1HAfNjuttD090iWyQbKIXkXnnlHQqaiVSIPsPnUXZ06mEAveWyCWoUTOu00Wwix7hgs"
);

// Render the React application
ReactDOM.render(
  <Elements stripe={stripePromise}>
    <Router>
      {/* Render the Navigation component */}
      <Navigation />
      {/* Define routing for different pages using React Router */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/findJob" element={<FindJob />} />
        <Route path="/browseJob" element={<BrowseJob />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/freelancers" element={<Freelancers />} />
        {/* Define routes related to the Account section */}
        <Route path="/Account/login" element={<Create />} />
        <Route path="/Account/settingsPage" element={<SettingsPage />} />
        <Route path="/Account/messagingPage" element={<MessagingPage />}>
          <Route path="login" element={<Login />} />
        </Route>
        {/* Route for the PaymentPortal */}
        <Route path="/PaymentPortal" element={<PaymentPortal />} />
      </Routes>
      {/* Render the Footer component */}
      <Footer />
    </Router>
  </Elements>,
  document.getElementById("root") // Mount the React app in the HTML element with the id "root"
);
