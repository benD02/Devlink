import React, { useState } from "react";
import firebase from "../../firebaseConfig";
import "firebase/auth"; // For authentication
import "./account.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleAuthentication = async (e) => {
    e.preventDefault();
    try {
      // Handle login
      await firebase.auth().signInWithEmailAndPassword(email, password);

      // Fetch additional user information from Firestore
      const userRef = firebase.firestore().collection("users").doc(email);
      const userDoc = await userRef.get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        console.log("User Data:", userData);
      }
      console.log("successful login");
      // Redirect the user to the home page or any other route after successful login
    } catch (error) {
      console.log(error);
      setError("Authentication failed. Please try again.");
    }
  };

  return (
    <div>
      <br />
      <div className="login-container">
        <div className="form-container">
          <h2>Login</h2>
          <div class="line-divider"></div>
          <br />
          {error && <p>{error}</p>}
          <form onSubmit={handleAuthentication}>
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
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
