import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AddNewStudents from "./AddNewStudents";
import StudentsList from "./StudentsList";
import AddNewCourses from "./AddNewCourses";
import CoursesList from "./CoursesList";
import AddNewResults from "./AddNewResults";
import ResultList from "./ResultList";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/addNewStudents" element={<AddNewStudents />} />
        <Route path="/studentsList" element={<StudentsList />} />
        <Route path="/addNewCourses" element={<AddNewCourses />} />
        <Route path="/coursesList" element={<CoursesList />} />
        <Route path="/AddNewResults" element={<AddNewResults />} />
        <Route path="/resultsList" element={<ResultList />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
