import React, { useState } from "react";
import "./FreelanceJobForm.css"; // Import the CSS file for the component
import ImageUploader from "./ImageUploader"; // Import the ImageUploader component
import firebase from "../../firebaseConfig"; // Import Firebase if not already imported

function FreelanceJobForm() {
  const [jobTitle, setJobTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [projectLength, setProjectLength] = useState("");
  const [minPayment, setMinPayment] = useState("");
  const [maxPayment, setMaxPayment] = useState("");
  const [workingHours, setWorkingHours] = useState("");
  const [imageURL, setImageURL] = useState(null);
  const [isJobPosted, setIsJobPosted] = useState(false);
  const [validationErrors, setValidationErrors] = useState({}); // State for validation errors

  const handlePostJob = async () => {
    const errors = {};

    if (!jobTitle.trim()) {
      errors.jobTitle = "Job Title is required";
    }
    if (!description.trim()) {
      errors.description = "Job Description is required";
    }
    if (!description.trim()) {
      errors.payment = "Payment is required";
    }
    if (!description.trim()) {
      errors.workingHours = "Working hours is required";
    }

    if (Object.keys(errors).length > 0) {
      // If there are validation errors, set them in state and prevent submission
      setValidationErrors(errors);
      return;
    }

    // Create an object with the job data
    const jobData = {
      jobTitle,
      description,
      skills,
      projectLength,
      minPayment,
      maxPayment,
      workingHours,
      imageURL
      // Include the imageURL in the jobData object
    };

    try {
      // Save job data to Firestore
      const jobRef = firebase.firestore().collection("freelanceJobs").doc();
      await jobRef.set(jobData);

      // Clear the form fields after successful submission
      setJobTitle("");
      setDescription("");
      setSkills("");
      setProjectLength("");
      setMinPayment("");
      setMaxPayment("");
      setWorkingHours("");
      setImageURL(null); // Clear the image URL after successful submission
      // ... Clear other form fields ...

      console.log("Freelance Job posted successfully");
      setIsJobPosted(true); // Set the state to indicate job posting success
    } catch (error) {
      console.log(error);
    }
  };

  // Function to handle the image upload and store the image URL in state
  const handleImageUpload = (url) => {
    console.log("Image URL:", url);
    setImageURL(url);
  };

  return (
    <div className="freelance-job-form">
      <h2>Freelance Job Form</h2>
      <br />
      {/* Describe Your Job Section */}
      <div className="describe-job-section">
        <h3>Describe Your Job</h3>
        <br />

        <label>
          Job Title/Position:
          <input
            type="text"
            name="jobTitle"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
          {validationErrors.jobTitle && (
            <span className="error">{validationErrors.jobTitle}</span>
          )}
        </label>
        <br />
        <label>
          Job Description:
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {validationErrors.description && (
            <span className="error">{validationErrors.description}</span>
          )}
        </label>
        <br />
        <label>
          Skills:
          <input
            type="text"
            name="skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Please add skills that are required for your job e.g., Java"
          />
          <p className="subHead">
            {" "}
            Developers will find your job based on the skills you added here{" "}
          </p>
        </label>
      </div>
      <br />

      {/* Projection Conditions Section */}
      <div className="projection-conditions-section">
        <h3>Projection Conditions</h3>
        <br />

        <label>
          Project Length:
          <input
            type="text"
            name="projectLength"
            value={projectLength}
            onChange={(e) => setProjectLength(e.target.value)}
          />
        </label>
        <br />
        <label>
          Payment: <br />
          <input
            type="text"
            name="minPayment"
            value={minPayment}
            onChange={(e) => setMinPayment(e.target.value)}
            placeholder="Min"
          />
          <input
            type="text"
            name="maxPayment"
            value={maxPayment}
            onChange={(e) => setMaxPayment(e.target.value)}
            placeholder="Max"
          />
          {validationErrors.payment && (
            <span className="error">{validationErrors.payment}</span>
          )}
        </label>
        <br />
        <label>
          Working Hours:
          <input
            type="text"
            name="workingHours"
            value={workingHours}
            onChange={(e) => setWorkingHours(e.target.value)}
          />
          {validationErrors.workingHours && (
            <span className="error">{validationErrors.workingHours}</span>
          )}
        </label>
      </div>

      {/* Image Uploader */}

      <div className="image-uploader-section">
        <h3>Upload Images</h3>
        <ImageUploader onImageUpload={handleImageUpload} />
      </div>

      <button onClick={handlePostJob}>Post Job</button>
      {isJobPosted && <p>Job posted successfully</p>}
    </div>
  );
}

export default FreelanceJobForm;
