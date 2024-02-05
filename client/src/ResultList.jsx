import React, { useEffect, useState } from "react";
import { HomeButton } from "./HomeButton";

function ResultList() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make students and courses get calls to retrieve information
        const [studentsResponse, coursesResponse] = await Promise.all([
          fetch("http://localhost:5000/getStudentsList"),
          fetch("http://localhost:5000/getCoursesList"),
        ]);

        const studentsData = await studentsResponse.json();
        const coursesData = await coursesResponse.json();

        // Fetch results list and check against students & courses lists
        const resultsResponse = await fetch(
          "http://localhost:5000/getResultList"
        );
        const fetchedResults = await resultsResponse.json();

        const processedResults = fetchedResults.map((result) => {
          const studentInfo = studentsData.find(
            (student) => student.id === result.studentID
          );
          const courseInfo = coursesData.find(
            (course) => course.id === result.courseID
          );
          return {
            ...result,
            studentName: studentInfo
              ? `${studentInfo.firstName} ${studentInfo.lastName}`
              : "Unknown",
            courseName: courseInfo ? courseInfo.courseName : "Unknown",
          };
        });

        // Set the processed results
        setResults(processedResults);
      } catch (error) {
        console.error("Failed to load data", error);
      }
    };

    fetchData();
  }, []);

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
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Course</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Student
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Result</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {result.courseName}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {result.studentName}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {result.result}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ResultList;
