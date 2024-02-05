import React, { useEffect, useState } from "react";
import { HomeButton } from "./HomeButton";

function StudentList() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/getStudentsList")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((data) => {
        setStudents(data);
      })
      .catch((error) => {
        console.error("There was an error fetching the student list:", error);
      });
  }, []);

  const deleteStudent = (studentID) => {
    fetch("http://localhost:5000/removeStudent", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studentID }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Failed to delete the student.");
      })
      .then(() => {
        setStudents(students.filter((student) => student.id !== studentID));
      })
      .catch((error) => {
        console.error("There was an error deleting the student:", error);
      });
  };

  return (
    <div>
      <HomeButton></HomeButton>
      <div
        style={{ marginTop: "20px", marginLeft: "20px", marginRight: "20px" }}
      >
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
                Name & Family name
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Email
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Date of Birth
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {student.firstName + " " + student.lastName}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {student.email}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {student.dob}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <button onClick={() => deleteStudent(student.id)}>
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentList;
