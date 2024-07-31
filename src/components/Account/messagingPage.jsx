import React, { useEffect, useState } from "react";
import firebase from "../../firebaseConfig";
import { Link } from "react-router-dom";
import { Search } from "semantic-ui-react";
import "./acPage.css";
import "./msPage.css";

const MessagingPage = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [contactSuggestions, setContactSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [showChatDialog, setShowChatDialog] = useState(false);
  const [selectedChatContact, setSelectedChatContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showChatOverlay, setShowChatOverlay] = useState(false);

  // Function to toggle the chat overlay
  const toggleChatOverlay = () => {
    setShowChatOverlay(!showChatOverlay);
  };
  useEffect(() => {
    // Fetch all other users
    const fetchUsers = async () => {
      try {
        if (user && user.email) {
          const usersSnapshot = await firebase
            .firestore()
            .collection("users")
            .where("email", "!=", user.email)
            .get();

          const usersData = usersSnapshot.docs.map((doc) => ({
            id: doc.id,
            email: doc.data().email
          }));
          setUsers(usersData);

          // Fetch user's saved contacts
          const userRef = firebase
            .firestore()
            .collection("users")
            .doc(user.email);
          const userData = await userRef.get();
          if (userData.exists) {
            const userContacts = userData.data().contacts || [];
            setSelectedContacts(userContacts);
          }
        }
      } catch (error) {
        console.log("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [user]);

  const handleSearchTermChange = (e, { value }) => {
    setSearchTerm(value);
    setShowSuggestions(true);
    fetchContactSuggestions(value);
  };

  const handleResultSelect = (e, { result }) => {
    setSelectedContact(result);
    setShowSuggestions(false);

    // Check if the contact is already in the selected contacts list
    const isContactAlreadySelected = selectedContacts.some(
      (contact) => contact.email === result.email
    );

    if (!isContactAlreadySelected) {
      setShowDuplicateWarning(false); // Clear the warning
      handleAddContact(result); // Add selected contact to the list
    } else {
      setShowDuplicateWarning(true); // Set warning to true
    }
  };

  const fetchContactSuggestions = async (searchTerm) => {
    try {
      const suggestionsSnapshot = await firebase
        .firestore()
        .collection("users")
        .where("email", ">=", searchTerm)
        .where("email", "<", searchTerm + "\uf8ff")
        .limit(5)
        .get();

      const suggestionsData = suggestionsSnapshot.docs.map((doc) => ({
        id: doc.id,
        email: doc.data().email
      }));
      setContactSuggestions(suggestionsData);
    } catch (error) {
      console.log("Error fetching contact suggestions:", error);
    }
  };
  const handleAddContact = async (contact) => {
    try {
      if (contact.email === user.email) {
        // Display an error message
        setShowDuplicateWarning(true);
        return;
      }

      // Add the selected contact to the list of selected contacts
      setSelectedContacts((prevSelectedContacts) => [
        ...prevSelectedContacts,
        contact
      ]);

      // Update the contacts field in Firestore
      const userRef = firebase.firestore().collection("users").doc(user.email);
      await userRef.update({
        contacts: firebase.firestore.FieldValue.arrayUnion(contact.email)
      });

      // Clear the search term and suggestions
      setSearchTerm("");
      setContactSuggestions([]);
      setShowSuggestions(false);
    } catch (error) {
      console.log("Error adding contact:", error);
    }
  };

  const handleRemoveContact = async (contact) => {
    try {
      // Remove the selected contact from the list of selected contacts
      setSelectedContacts((prevSelectedContacts) =>
        prevSelectedContacts.filter((c) => c.email !== contact.email)
      );

      // Remove the contact from Firestore
      const userRef = firebase.firestore().collection("users").doc(user.email);
      await userRef.update({
        contacts: firebase.firestore.FieldValue.arrayRemove(contact.email)
      });
    } catch (error) {
      console.log("Error removing contact:", error);
    }
  };

  const handleChatWithContact = (contact) => {
    setSelectedChatContact(contact);
    setSelectedContacts((prevSelectedContacts) => {
      return prevSelectedContacts.map((prevContact) => {
        if (prevContact.email === contact.email) {
          return { ...prevContact, hasUnreadMessages: true };
        }
        return prevContact;
      });
    });
    setShowChatDialog(true);

    // Fetch messages from Firestore
    fetchMessages(contact);
  };

  const getChatId = (userEmail1, userEmail2) => {
    const sortedEmails = [userEmail1, userEmail2].sort();
    return `${sortedEmails[0]}_${sortedEmails[1]}`;
  };

  const fetchMessages = async (contact) => {
    try {
      const chatId = getChatId(user.email, contact.email);
      const chatRef = firebase.firestore().collection("chats").doc(chatId);
      const chatSnapshot = await chatRef.get();

      if (chatSnapshot.exists) {
        const chatData = chatSnapshot.data();
        const chatMessages = chatData.messages || []; // Initialize with an empty array if messages doesn't exist
        setMessages(chatMessages);
      }
    } catch (error) {
      console.log("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async (user) => {
    console.log("User parameter:", user);
    console.log("check0");
    console.log("newMessage:", newMessage);
    console.log("selectedChatContact:", selectedChatContact);
    console.log("user:", user);
    if (!newMessage.trim() || !selectedChatContact) return;

    try {
      const chatId = getChatId(user.email, selectedChatContact.email);
      const chatRef = firebase.firestore().collection("chats").doc(chatId);

      // Update the chat document with a new message using update()
      await chatRef.set(
        {
          messages: firebase.firestore.FieldValue.arrayUnion({
            sender: user.email,
            text: newMessage,
            timestamp: new Date()
          })
        },
        { merge: true }
      );

      setSelectedContacts((prevSelectedContacts) => {
        return prevSelectedContacts.map((prevContact) => {
          if (prevContact.email === selectedChatContact.email) {
            return { ...prevContact, hasUnreadMessages: false };
          }
          return prevContact;
        });
      });

      // Clear the message input
      setNewMessage("");
    } catch (error) {
      console.log("Error sending message:", error);
    }

    const fetchAndSetMessages = async (contact) => {
      try {
        const chatId = getChatId(user.email, contact.email);
        const chatRef = firebase.firestore().collection("chats").doc(chatId);
        const chatSnapshot = await chatRef.get();

        if (chatSnapshot.exists) {
          const chatData = chatSnapshot.data();
          const chatMessages = chatData.messages || [];
          setMessages(chatMessages);
        }
      } catch (error) {
        console.log("Error fetching messages:", error);
      }
    };

    if (selectedChatContact) {
      // Fetch messages when the selectedChatContact changes
      fetchAndSetMessages(selectedChatContact);

      // Set up a timer to fetch messages periodically (every 5 seconds)
      const messageTimer = setInterval(() => {
        fetchAndSetMessages(selectedChatContact);
      }, 5000); // Adjust the interval as needed (in milliseconds)

      // Clean up the timer when the component unmounts or when selectedChatContact changes
      return () => {
        clearInterval(messageTimer);
      };
    }
  };

  return (
    <div className="messaging-container">
      <h2 className="welcome-text">Welcome to the Devlink Messaging Page</h2>
      {showSuggestions && (
        <div className="suggestions">
          {contactSuggestions.map((contact) => (
            <div
              key={contact.id}
              className="suggestion"
              onClick={() => handleResultSelect(null, { result: contact })}
            >
              {contact.email}
            </div>
          ))}
        </div>
      )}
      {/* Search component */}
      <Search
        placeholder={"Search for contacts"}
        loading={false}
        onResultSelect={handleResultSelect}
        onSearchChange={handleSearchTermChange}
        results={contactSuggestions}
        value={searchTerm}
      />

      <div className="message-container">
        <div className="autocomplete">
          {showDuplicateWarning && (
            <div className="warning-message">
              This contact is already added or cannot be added.
            </div>
          )}
        </div>

        {/* Style for the selected contacts */}
        <div className="selected-contacts">
          <h3>Contacts:</h3>
          {selectedContacts.map((contact) => (
            <div key={contact.id} className="selected-contact">
              <div className="contact-info">
                <span>{contact.email}</span>
                {contact.hasUnreadMessages && <div className="green-dot"></div>}
              </div>
              <div className="contact-actions">
                <button onClick={() => handleRemoveContact(contact)}>
                  Remove
                </button>
                <button onClick={() => handleChatWithContact(contact)}>
                  Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat overlay */}
      {showChatDialog && (
        <div className={`chat-dialog ${showChatOverlay ? "overlay" : ""}`}>
          <div className="chat-header">
            <span>Chat with {selectedChatContact.email}</span>
            <button onClick={() => setShowChatDialog(false)}>Close</button>
          </div>
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${
                  message.sender === user.email ? "sent" : "received"
                }`}
              >
                {/* Display sender's name, receiver's name (if received), and timestamp for sent messages */}
                {message.sender === user.email && (
                  <div className="message-info">
                    <span className="sender-name">You </span>
                    <span className="timestamp">
                      {new Date(
                        message.timestamp.toDate()
                      ).toLocaleTimeString()}
                    </span>
                  </div>
                )}
                {message.sender !== user.email && (
                  <div className="message-info">
                    <span className="sender-name">
                      {selectedChatContact.email}
                    </span>
                    <span className="timestamp">
                      {new Date(
                        message.timestamp.toDate()
                      ).toLocaleTimeString()}
                    </span>
                  </div>
                )}
                {message.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button onClick={() => handleSendMessage(user)}>Send</button>
          </div>
        </div>
      )}

      {/* Chat overlay backdrop */}
      {showChatOverlay && (
        <div
          className="chat-overlay-backdrop"
          onClick={toggleChatOverlay}
        ></div>
      )}
    </div>
  );
};

export default MessagingPage;
