import React, { useEffect, useState } from "react";
import { HomeButton } from "./HomeButton";

function AddNewResults() {
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedScore, setSelectedScore] = useState("");
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const scores = ["A", "B", "C", "D", "E", "F"];

  useEffect(() => {
    // Fetch courses
    fetch("http://localhost:5000/getCoursesList")
      .then((response) => response.json())
      .then(setCourses)
      .catch((error) => console.error("Failed to fetch courses", error));

    // Fetch students
    fetch("http://localhost:5000/getStudentsList")
      .then((response) => response.json())
      .then(setStudents)
      .catch((error) => console.error("Failed to fetch students", error));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedCourseId && selectedStudentId && selectedScore) {
      const payload = {
        courseID: selectedCourseId,
        studentID: selectedStudentId,
        result: selectedScore,
      };

      fetch("http://localhost:5000/addNewResult", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Failed to submit the result.");
        })
        .then(() => {
          // Reset the form fields
          setSelectedCourseId("");
          setSelectedStudentId("");
          setSelectedScore("");
          alert("Result submitted successfully!");
        })
        .catch((error) => {
          console.error("There was an error submitting the result:", error);
        });
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <HomeButton></HomeButton>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          style={{ margin: "10px", padding: "10px" }}
        >
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.courseName}
            </option>
          ))}
        </select>

        <select
          value={selectedStudentId}
          onChange={(e) => setSelectedStudentId(e.target.value)}
          style={{ margin: "10px", padding: "10px" }}
        >
          <option value="">Select a student</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.firstName} {student.lastName}
            </option>
          ))}
        </select>

        <select
          value={selectedScore}
          onChange={(e) => setSelectedScore(e.target.value)}
          style={{ margin: "10px", padding: "10px" }}
        >
          <option value="">Select a score</option>
          {scores.map((score, index) => (
            <option key={index} value={score}>
              {score}
            </option>
          ))}
        </select>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            margin: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
          disabled={!(selectedCourseId && selectedStudentId && selectedScore)}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddNewResults;
