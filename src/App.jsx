import "./store/StudentStore";

import Dashboard from "./components/dashboard/Dashboard";
import StudentForm from "./components/students/StudentForm";
import StudentList from "./components/students/StudentList";
import ActivityLog from "./components/common/ActivityLog";
import Attendance from "./attendance/Attendance";


function App() {
  return (
    <div className="container mt-4">
      <Dashboard />
      <StudentForm />
      <StudentList />
        <ActivityLog />
    </div>
  );
}

export default App;