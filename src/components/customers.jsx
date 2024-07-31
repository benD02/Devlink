import React from "react";
import "./seemore.css"; // Import your stylesheet here

const Customers = () => {
  return (
    <div>
      {/* Profiles */}
      <div className="content">
        <div className="freelancer-profile">
          <img src="./images/company 5.jpg" alt="Profile Photo" />
          <h3>Binary Systems LLC</h3>
          <p>Hired Devlink freelancers to work on hardware systems projects.</p>
        </div>

        <div className="freelancer-profile">
          <img src="./images/company 4.jpg" alt="Profile Photo" />
          <h3>Johnson and Smith Accounting</h3>
          <p>
            Hired Devlink freelancers to design accounting software and setup
            network architecture.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Customers;
