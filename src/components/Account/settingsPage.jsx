import React, { useState } from "react";
import firebase from "../../firebaseConfig";
import "./settings.css";

const SettingsPage = ({ user }) => {
  // State variables for new first name, new last name, and message
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [message, setMessage] = useState("");

  // Function to handle changing the user's password
  const handleChangePassword = () => {
    // Send a password reset email to the user
    firebase
      .auth()
      .sendPasswordResetEmail(user.email)
      .then(() => {
        // Set a success message
        setMessage(
          "Check your inbox for steps on how to change your password."
        );
      })
      .catch((error) => {
        // Handle and display error message if there's an issue with sending the email
        setMessage(`Error sending password reset email: ${error.message}`);
      });
  };

  // Function to handle updating the user's first and last name
  const handleUpdateName = () => {
    // Update the user's first name and last name in Firestore
    firebase
      .firestore()
      .collection("users")
      .doc(user.email)
      .update({
        firstName: newFirstName,
        lastName: newLastName
      })
      .then(() => {
        // Set a success message
        setMessage("Name updated successfully.");
      })
      .catch((error) => {
        // Handle and display error message if there's an issue with updating the name
        setMessage(`Error updating name: ${error.message}`);
      });
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <div className="change-password">
        <h3>Change Password</h3>
        <button onClick={handleChangePassword}>Change Password</button>
      </div>
      <div className="update-name">
        <h3>Update Name</h3>
        <input
          type="text"
          placeholder="New First Name"
          value={newFirstName}
          onChange={(e) => setNewFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="New Last Name"
          value={newLastName}
          onChange={(e) => setNewLastName(e.target.value)}
        />
        <button onClick={handleUpdateName}>Update Name</button>
      </div>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default SettingsPage;
