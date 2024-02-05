import React, { useState } from "react";
import { HomeButton } from "./HomeButton";

function AddNewCourses() {
  const [formData, setFormData] = useState({
    courseName: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    const { courseName } = formData;

    if (!courseName) tempErrors.courseName = "Course name is required.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      fetch("http://localhost:5000/addNewCourse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          alert("Course already exists.");
          throw new Error("Failed to add the course.");
        })
        .then(() => {
          // Clearing the form after successful submit
          setFormData({
            courseName: "",
          });
          alert("Course successfully added!");
        })
        .catch((error) => {
          console.error("There was an error submitting the form:", error);
        });
    } else {
      console.log("Validation failed.");
    }
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
  };

  const inputStyle = {
    fontSize: "16px",
    padding: "10px",
    width: "300px",
    borderColor: "#ccc",
  };

  const errorStyle = {
    color: "red",
    fontSize: "14px",
    height: "18px",
    marginTop: "-5px",
    textAlign: "center",
  };

  const labelStyle = {
    fontSize: "18px",
    display: "block",
    textAlign: "center",
    margin: "10px 0",
  };

  const buttonStyle = {
    fontSize: "18px",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px",
  };

  const buttonWrapperStyle = {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  };

  return (
    <div style={formStyle}>
      <HomeButton></HomeButton>
      <form onSubmit={handleSubmit}>
        <div>
          <p style={labelStyle}>Course Name</p>
          {errors.courseName && (
            <div style={errorStyle}>{errors.courseName}</div>
          )}
          <input
            type="text"
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            style={{
              ...inputStyle,
              borderColor: errors.courseName ? "red" : "#ccc",
            }}
          />
        </div>
        <div style={buttonWrapperStyle}>
          <button type="submit" style={buttonStyle}>
            Add Course
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddNewCourses;
