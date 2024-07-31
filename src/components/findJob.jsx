import React, { useState } from "react";
import FreelanceJobForm from "./forms/FreelanceJobForm";
import EmploymentJobForm from "./forms/EmploymentJobForm";
import "./FindJob.css"; // Import the CSS file for the component

function FindJob() {
  // State to keep track of the selected job type
  const [jobType, setJobType] = useState("freelance");
  // Function to handle job type switch
  const handleJobTypeSwitch = (type) => {
    setJobType(type);
  };
  return (
    <div className="job-page">
      <h1 className="job-pagetitle">
        {" "}
        <br /> What job type are you looking for?{" "}
      </h1>
      <br />
      {/* Job type switch buttons */}
      <div className="job-type-switch">
        <button
          onClick={() => handleJobTypeSwitch("freelance")}
          className={jobType === "freelance" ? "active" : ""}
        >
          Freelance
        </button>
        <button
          onClick={() => handleJobTypeSwitch("employment")}
          className={jobType === "employment" ? "active" : ""}
        >
          Employment
        </button>
      </div>

      {/* Conditionally render the appropriate form based on the selected job type */}
      {jobType === "freelance" ? <FreelanceJobForm /> : <EmploymentJobForm />}

      {/* Add other components and elements as needed */}
    </div>
  );
}

export default FindJob;
