import StudentForm from "./StudentForm";
import StudentList from "./StudentList";
import ActivityLog from "../common/ActivityLog";

const Student = () => {
  return (
    <div className="container mt-4">
      <StudentForm />
      <StudentList />
      <ActivityLog />
    </div>
  );
};

export default Student;