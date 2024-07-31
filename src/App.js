import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import firebase from "./firebaseConfig"; // Import Firebase configuration
import Login from "./components/Account/Login"; // Import the Login component
import Create from "./components/Account/create"; // Import the Create component
import Home from "./components/Home"; // Import the Home component
import AccountPage from "./components/AccountPage"; // Import the AccountPage component
import MessagingPage from "./components/messagingPage"; // Import the MessagingPage component
import SettingsPage from "./components/settingsPage"; // Import the SettingsPage component
import Customers from "./components/customers"; // Import the Customers component
import Freelancers from "./components/freelancers"; // Import the Freelancers component

// Define a PrivateRoute component to protect routes that require authentication
const PrivateRoute = ({ component: Component, ...rest }) => {
  // Check if there is a currently authenticated user using Firebase authentication
  const user = firebase.auth().currentUser;
  return (
    <Route
      {...rest}
      render={
        (props) =>
          user ? <Component {...props} /> : <Redirect to="/Account/login" /> // Render the component if authenticated, otherwise redirect to the login page
      }
    />
  );
};

// Define the main App component
const App = () => {
  return (
    <Router>
      <Switch>
        {/* Define various routes using React Router */}
        <Route exact path="/Account/login" component={Login} />
        <Route exact path="/Account/create" component={Create} />
        <PrivateRoute exact path="/home" component={Home} />{" "}
        {/* Protected route */}
        <Route exact path="/Account" component={AccountPage} />
        <Route path="/Account/messagingPage" component={MessagingPage} />
        <Route path="/Account/settingsPage" component={SettingsPage} />
        <Route path="/customers" component={Customers} />
        <Route path="/freelancers" component={Freelancers} />
      </Switch>
    </Router>
  );
};

export default App;
