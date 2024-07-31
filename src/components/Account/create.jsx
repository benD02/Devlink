import React, { useState, useEffect } from "react";
import firebase from "../../firebaseConfig";
import bcrypt from "bcryptjs";
import "firebase/auth"; // For authentication
import "./account.css";
import AccountPage from "./AccountPage"; // Import the AccountPage component

const Create = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [accountCreated, setAccountCreated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [user, setUser] = useState(null); // Store user information when logged in
  const [resetEmail, setResetEmail] = useState("");
  const [forgotPassword, setForgotPassword] = useState("");

  const handleSignOut = async () => {
    try {
      await firebase.auth().signOut();
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setError(null);
      setAccountCreated(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    try {
      await firebase.auth().sendPasswordResetEmail(resetEmail);
      setSuccessMessage("Password reset email sent. Please check your inbox.");
    } catch (error) {
      console.error("Password reset failed", error);
      setError("Password reset failed. Please try again.");
    }
  };

  useEffect(() => {
    // Check if the user is logged in on component mount
    checkLoggedInUser();
  }, []);

  const toggleMode = () => {
    setIsLoginMode((prevMode) => !prevMode);
  };

  const refreshPageAfterDelay = (delay) => {
    setTimeout(() => {
      window.location.reload();
    }, delay);
  };

  const handleAuthentication = async (e) => {
    e.preventDefault();
    try {
      if (isLoginMode) {
        // Handle login
        console.log("Check 1");
        await firebase.auth().signInWithEmailAndPassword(email, password);
        setSuccessMessage("Account login successfully");
        checkLoggedInUser(); // Update user info after login

        // Redirect the user to the home page or any other route after successful login
      } else {
        // Check if password and confirmPassword match
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          return;
        }

        if (password.length < 6) {
          setError("Password must be at least 6 characters long.");
          return;
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user account in Firebase Authentication with the hashed password
        await firebase
          .auth()
          .createUserWithEmailAndPassword(email, hashedPassword);

        // Save additional user information to Firestore database
        const userRef = firebase.firestore().collection("users").doc(email); // Use the email as the document ID
        userRef.set({
          firstName,
          lastName,
          email,
          password
        });

        // Set the accountCreated state to true after successful registration
        setAccountCreated(true);
        setIsModalOpen(true); // Open the modal on successful registration
        console.log("Account created");
        checkLoggedInUser(); // Update user info after registration
        refreshPageAfterDelay(2000);
      }
    } catch (error) {
      console.log(error);
      setError("Authentication failed. Please try again.");
    }
  };

  const checkLoggedInUser = () => {
    // Check if a user is logged in
    const authListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is logged in
        setUser(user); // Store user information
      } else {
        // User is not logged in
        setUser(null);
      }
    });
    return () => authListener(); // Clean up the listener when component unmounts
  };

  return (
    <div>
      {/* Check if the user is logged in, and render the AccountPage component */}
      {user ? (
        <AccountPage
          user={user}
          firstName={firstName}
          lastName={lastName}
          handleSignOut={handleSignOut}
        />
      ) : (
        // Otherwise, render the login/registration form
        <div className="overlay-container">
          <div
            className={`login-container ${
              forgotPassword ? "right-panel-active" : ""
            }`}
          >
            <div className="form-container">
              <h2>{isLoginMode ? "Login" : "Registration "}</h2>
              {successMessage && <p>{successMessage}</p>}
              {error && <p>{error}</p>}
              {!accountCreated && (
                <form onSubmit={handleAuthentication}>
                  {!isLoginMode && (
                    <>
                      <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </>
                  )}
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {!isLoginMode && (
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  )}
                  <button type="submit">
                    {isLoginMode ? "Login" : "Register"}
                  </button>
                  <button onClick={toggleMode}>
                    {isLoginMode ? "Register here" : "Back to Login"}
                  </button>
                  <button
                    onClick={() => setForgotPassword(true)}
                    className="forgot-password-button"
                  >
                    Forgot Password ?
                  </button>
                </form>
              )}
              {accountCreated && (
                <p>Successful account creation. Please login. </p>
              )}
            </div>
            {forgotPassword && (
              <div className="modal">
                <form onSubmit={handlePasswordReset}>
                  <input
                    type="email"
                    placeholder="Email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                  />
                  <button type="submit" className="reset-password-button">
                    Reset Password
                  </button>
                  <button
                    onClick={() => setForgotPassword(false)}
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Create;
