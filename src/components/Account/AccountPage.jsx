import React, { useEffect, useState } from "react";
import firebase from "../../firebaseConfig";
import "./account.css";
import "./acPage.css";
import { Link } from "react-router-dom";
import MessagingPage from "./messagingPage";
import SettingsPage from "./settingsPage";

const AccountPage = ({ user, handleSignOut }) => {
  console.log("User prop:", user);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [activeSection, setActiveSection] = useState("account"); // Initially show Account Info

  useEffect(() => {
    // Fetch the user's document from Firestore based on their email
    const fetchUserData = async () => {
      try {
        const userRef = firebase
          .firestore()
          .collection("users")
          .doc(user.email);
        const userData = await userRef.get();
        if (userData.exists) {
          // If the user document exists, set the first and last names
          const { firstName, lastName } = userData.data();
          setFirstName(firstName);
          setLastName(lastName);
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user.email]);

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="account-info">
      <div>
        <div className="acnavbar">
          <ul>
            <li
              className={activeSection === "account" ? "active" : ""}
              onClick={() => handleSectionChange("account")}
            >
              Account Info
            </li>
            <li
              className={activeSection === "messages" ? "active" : ""}
              onClick={() => handleSectionChange("messages")}
            >
              Messages
            </li>
            <li
              className={activeSection === "settings" ? "active" : ""}
              onClick={() => handleSectionChange("settings")}
            >
              Settings
            </li>
          </ul>
        </div>

        {activeSection === "account" && (
          <>
            <h2 className="welcome-text">Welcome, {user.email}</h2>
            <br />
            <p className="name">
              <span
                style={{ marginRight: "10px", fontFamily: "Arial, sans-serif" }}
              >
                Name: {firstName} {lastName}
              </span>
              <br />{" "}
              <span
                style={{ marginRight: "10px", fontFamily: "Arial, sans-serif" }}
              >
                {" "}
                Email: {user.email}{" "}
              </span>
            </p>
            <br />
            <button className="logout-button" onClick={handleSignOut}>
              Log out
            </button>
          </>
        )}

        {activeSection === "messages" && <MessagingPage user={user} />}
        {activeSection === "settings" && <SettingsPage user={user} />}
      </div>
    </div>
  );
};

export default AccountPage;
