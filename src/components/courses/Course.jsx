import CourseForm from "./CourseForm";
import CourseList from "./CourseList";

const Course = () => {
  return (
    <div className="container mt-4">
      <h2 className="mb-4">📚 Course Management</h2>

      <CourseForm />

      <CourseList />
    </div>
  );
};

export default Course;