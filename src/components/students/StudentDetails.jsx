import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStudents } from "../../api/studentApi";

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudent = async () => {
      try {
        const students = await getStudents();

        const selectedStudent = students.find(
          (student) => String(student.id) === String(id)
        );

        setStudent(selectedStudent);
      } catch (error) {
        console.error("Failed to load student:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, [id]);

  if (loading) {
    return (
      <div className="card p-4">
        <h4>Loading student details...</h4>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="card p-4">
        <h4>Student not found</h4>

        <button
          className="btn btn-secondary mt-3"
          onClick={() => navigate("/students")}
        >
          Back to Students
        </button>
      </div>
    );
  }

  return (
    <div className="card shadow-sm p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Student Details</h3>

        <button
          className="btn btn-secondary"
          onClick={() => navigate("/students")}
        >
          ← Back
        </button>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <div className="border rounded p-3">
            <small className="text-muted">Student ID</small>
            <h5>{student.id}</h5>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="border rounded p-3">
            <small className="text-muted">Roll Number</small>
            <h5>{student.rollNo}</h5>
          </div>
        </div>

        <div className="col-md-12 mb-3">
          <div className="border rounded p-3">
            <small className="text-muted">Student Name</small>
            <h5>{student.name}</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;