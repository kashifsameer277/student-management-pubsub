import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./store/StudentStore";
import "./store/AttendanceStore";
import "./store/TeacherStore";

import Layout from "./layout/Layout";
import Dashboard from "./components/dashboard/Dashboard";
import Student from "./components/students/Student";
import AttendancePage from "./attendance/AttendancePage";
import Teacher from "./components/teachers/Teacher";

function App() {
  return (
    <BrowserRouter>
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Dashboard />} />
      <Route path="students" element={<Student />} />
      <Route path="attendance" element={<AttendancePage />} />

      {/* This route must exist */}
      <Route path="teachers" element={<Teacher />} />
    </Route>
  </Routes>
</BrowserRouter>
  );
}

export default App;