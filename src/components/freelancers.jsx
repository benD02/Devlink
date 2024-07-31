import React from "react";
import "./seemore.css"; // Import your stylesheet here

const Freelancers = () => {
  return (
    <div>
      {/* Profiles */}
      <div className="content">
        <div className="freelancer-profile">
          <img src="./images/profile 5.jpg" alt="Profile Photo" />
          <h3>Brian Johnson</h3>
          <p>
            Brian is a qualified IOT and electronics engineer. he has a PHD and
            10 years experience
          </p>
        </div>

        <div className="freelancer-profile">
          <img src="./images/profile 4.jpg" alt="Profile Photo" />
          <h3>Jane Briggs</h3>
          <p>
            Jane has a masters in Artificial Intelligence and previously worked
            for Google.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Freelancers;
