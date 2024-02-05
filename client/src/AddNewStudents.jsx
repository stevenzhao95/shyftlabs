import React, { useState } from "react";
import { HomeButton } from "./HomeButton";

function AddNewStudents() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
  });
  const [errors, setErrors] = useState({});

  // Email regex for basic validation
  const emailRegex = /\S+@\S+\.\S+/;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Remove error for a field when it's being edited
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    const { firstName, lastName, email, dob } = formData;
    // Check each field and add error message if empty
    if (!firstName) tempErrors.firstName = "First name is required.";
    if (!lastName) tempErrors.lastName = "Last name is required.";
    if (!email) tempErrors.email = "Email address is required.";
    else if (!emailRegex.test(email))
      tempErrors.email = "Please enter a valid email address.";
    if (!dob) tempErrors.dob = "Date of birth is required.";
    else {
      const dateOfBirth = new Date(dob);
      const tenYearsAgo = new Date();
      tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
      if (dateOfBirth >= tenYearsAgo)
        tempErrors.dob = "The student must be at least 10 years old.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      fetch("http://localhost:5000/addNewStudents", {
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
          throw new Error("Failed to add the student.");
        })
        .then(() => {
          // Clearing the form after successful submit
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            dob: "",
          });
          alert("Student successfully added!");
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
    display: "block", // This will ensure the label is above the input
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
    width: "100%", // Ensure it takes full width to center the button correctly
  };

  return (
    <div className="addNewStudents" style={formStyle}>
      <HomeButton></HomeButton>
      <form onSubmit={handleSubmit}>
        <div>
          <p style={labelStyle}>First Name</p>
          {errors.firstName && <div style={errorStyle}>{errors.firstName}</div>}
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            style={{
              ...inputStyle,
              borderColor: errors.firstName ? "red" : "#ccc",
            }}
          />
        </div>
        <div>
          <p style={labelStyle}>Last Name</p>
          {errors.lastName && <div style={errorStyle}>{errors.lastName}</div>}
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            style={{
              ...inputStyle,
              borderColor: errors.lastName ? "red" : "#ccc",
            }}
          />
        </div>
        <div>
          <p style={labelStyle}>Email Address</p>
          {errors.email && <div style={errorStyle}>{errors.email}</div>}
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{
              ...inputStyle,
              borderColor: errors.email ? "red" : "#ccc",
            }}
          />
        </div>
        <div>
          <p style={labelStyle}>Date of Birth</p>
          {errors.dob && <div style={errorStyle}>{errors.dob}</div>}
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            style={{
              ...inputStyle,
              borderColor: errors.dob ? "red" : "#ccc",
            }}
          />
        </div>
        <div style={buttonWrapperStyle}>
          <button type="submit" style={buttonStyle}>
            Add Student
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddNewStudents;
