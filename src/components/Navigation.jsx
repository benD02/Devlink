import React from "react";
import { NavLink } from "react-router-dom";
import "./navigation.css"; // Import the external CSS file

function Navigation() {
  return (
    <div className="navigation">
      {/* Navigation bar */}
      <nav className="navbar navbar-expand ">
        <div className="container">
          {/* DevLink logo and brand */}
          <NavLink className="navbar-brand" to="/">
            <img
              src="./images/logo Devlink resized heading.jpg"
              alt="DevLink Logo"
              className="logo"
            />
            DevLink
          </NavLink>
          <div>
            {/* Navigation menu */}
            <ul className="navbar-nav ml-auto">
              {/* Home link */}
              <li className="nav-item">
                <NavLink className="nav-link" to="/" style={{ color: "black" }}>
                  Home
                  <span className="sr-only">(current)</span>
                </NavLink>
              </li>
              {/* DevLink Premium link */}
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/PaymentPortal"
                  style={{ color: "black" }}
                >
                  Devlink Premium
                </NavLink>
              </li>
              {/* Find Job link */}
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/findJob"
                  style={{ color: "black" }}
                >
                  Find job
                </NavLink>
              </li>
              {/* Account link */}
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/Account/login"
                  style={{ color: "black" }}
                >
                  Account
                </NavLink>
              </li>
              {/* Browse Jobs link */}
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/browseJob"
                  style={{ color: "black" }}
                >
                  Browse Jobs
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navigation;
