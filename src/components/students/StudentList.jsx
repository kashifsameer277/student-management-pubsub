import { useEffect, useState } from "react";
import EventBus from "../../pubsub/EventBus";
import { EVENTS } from "../../pubsub/events";
import StudentService from "../../services/StudentService";
import { getStudents } from "../../api/studentApi";
import { useNavigate } from "react-router-dom";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await getStudents();
        setStudents(data);
      } catch (error) {
        console.error("Failed to load students:", error);
      }
    };

    // Load students when page opens
    loadStudents();

    // Reload students when StudentStore is updated
    const unsubscribe = EventBus.subscribe(
      EVENTS.STUDENT_STORE_UPDATED,
      () => {
        loadStudents();
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="card p-3">
      <h4>Student List</h4>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Roll No</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student, index) => (
            <tr key={student.id}>
              <td>{index + 1}</td>
              <td>{student.name}</td>
              <td>{student.rollNo}</td>

              <td>
                <button
  className="btn btn-info btn-sm me-2"
  onClick={() => navigate(`/students/${student.id}`)}
>
  Details
</button>
                <button
                  className="btn btn-danger btn-sm me-2"
                  onClick={() =>
                    StudentService.deleteStudent(student.id)
                  }
                >
                  Delete
                </button>

                <button
                  className="btn btn-warning btn-sm"
                  onClick={() =>
                    StudentService.editStudent(student)
                  }
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;