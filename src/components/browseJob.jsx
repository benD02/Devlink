import React, { useEffect, useState } from "react";
import firebase from "../firebaseConfig";
import "./jobBrowse.css";

const BrowseJob = () => {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [expandedJobId, setExpandedJobId] = useState(null);

  // Function to handle the click on a job card to expand/collapse
  const handleExpandJob = (jobId) => {
    // If the clicked job card is already expanded, collapse it.
    // Otherwise, expand it.
    setExpandedJobId((prevJobId) => (prevJobId === jobId ? null : jobId));
  };

  useEffect(() => {
    // Fetch job data from Firestore
    const fetchJobs = async () => {
      try {
        const employmentJobsSnapshot = await firebase
          .firestore()
          .collection("employmentJobs")
          .get();
        const freelanceJobsSnapshot = await firebase
          .firestore()
          .collection("freelanceJobs")
          .get();

        const employmentJobsData = employmentJobsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        const freelanceJobsData = freelanceJobsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        // Merge the two arrays of jobs
        const allJobs = [...employmentJobsData, ...freelanceJobsData];
        setJobs(allJobs);
      } catch (error) {
        console.log("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  const handleFilterChange = (e) => {
    setFilter(e.target.value.toLowerCase());
  };

  useEffect(() => {
    const filtered = jobs.filter(
      (job) =>
        job.skills.toLowerCase().includes(filter) ||
        job.jobTitle.toLowerCase().includes(filter)
    );
    setFilteredJobs(filtered);
  }, [filter, jobs]);

  const handleDeleteJob = async (jobId) => {
    try {
      // Delete the job from Firestore
      await firebase
        .firestore()
        .collection("employmentJobs")
        .doc(jobId)
        .delete();
      await firebase
        .firestore()
        .collection("freelanceJobs")
        .doc(jobId)
        .delete();
      // Update the state to remove the deleted job from the list
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
    } catch (error) {
      console.log("Error deleting job:", error);
    }
  };

  return (
    <div className="find-jobs">
      <h2>Browse Jobs</h2>
      <div>
        <input
          type="text"
          value={filter}
          onChange={handleFilterChange}
          placeholder="Filter by Skill or Job Title"
          className="filter-input"
        />
      </div>
      <div className="job-cards-container">
        {filteredJobs.length === 0 ? (
          <p>No jobs found.</p>
        ) : (
          filteredJobs.map((job) => (
            <div key={job.id} className="job-card">
              <h3>{job.jobTitle}</h3>
              <p>
                _________________________________________________________________
              </p>
              <p>
                <strong>Description:</strong> {job.description}
              </p>
              <p>
                <strong>Skills:</strong> {job.skills}
              </p>

              {/* Render additional details only for the expanded job card */}
              {expandedJobId === job.id && (
                <div>
                  <p>
                    <strong>Project Length:</strong> {job.projectLength}
                  </p>
                  <p>
                    <strong>Payment:</strong> {job.minPayment} -{" "}
                    {job.maxPayment}
                  </p>
                  <p>
                    <strong>Working Hours:</strong> {job.workingHours}
                  </p>

                  {/* Display the image if available */}
                  {job.imageURL && (
                    <img src={job.imageURL} alt={job.jobTitle} />
                  )}
                </div>
              )}

              <div className="button-container">
                <button onClick={() => handleExpandJob(job.id)}>
                  {expandedJobId === job.id
                    ? "Hide more details"
                    : "Show more details"}
                </button>
                <button onClick={() => handleDeleteJob(job.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BrowseJob;
