import React from "react";

const JobCard = ({ job, onDelete }) => {
  const { jobTitle, description, skills } = job;

  return (
    <div className="job-card">
      <h3>{jobTitle}</h3>
      <p>Description:{description}</p>
      <p>Skills: {skills}</p>
    </div>
  );
};

export default JobCard;
