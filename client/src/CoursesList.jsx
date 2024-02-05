import React, { useEffect, useState } from "react";
import { HomeButton } from "./HomeButton";

function CoursesList() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/getCoursesList")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((data) => {
        setCourses(data);
      })
      .catch((error) => {
        console.error("There was an error fetching the courses list:", error);
      });
  }, []);

  const deleteCourse = (courseID) => {
    fetch("http://localhost:5000/removeCourse", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ courseID }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Failed to delete the course.");
      })
      .then(() => {
        setCourses(courses.filter((course) => course.id !== courseID));
      })
      .catch((error) => {
        console.error("There was an error deleting the course:", error);
      });
  };

  return (
    <div style={{ marginLeft: "20px", marginRight: "20px" }}>
      <HomeButton></HomeButton>
      <table
        style={{
          width: "calc(100% - 40px)",
          textAlign: "left",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Course Name
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Delete</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course, index) => (
            <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {course.courseName}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <button onClick={() => deleteCourse(course.id)}>
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CoursesList;
