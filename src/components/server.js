const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Define a route for handling subscriptions
app.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;
    // Make the Mailchimp API request here
    // Use your Mailchimp API key and list ID
    const apiKey = "9442ea7ce7b14a388f15287cb433845f-us10";
    const listId = "82eb72c68a";
    const response = await axios.post(
      `https://us10.api.mailchimp.com/3.0/lists/82eb72c68a/members`,
      {
        email_address: email,
        status: "subscribed"
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      }
    );

    // Handle the response from Mailchimp here
    res.json({ message: "Subscription successful" });
  } catch (error) {
    console.error("Subscription failed", error);
    res
      .status(500)
      .json({ error: "Subscription failed. Please try again later." });
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
