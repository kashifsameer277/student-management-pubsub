import { useEffect, useState } from "react";
import EventBus from "../../pubsub/EventBus";
import { EVENTS } from "../../pubsub/events";
import StudentStore from "../../store/StudentStore";
import StudentService from "../../services/StudentService";

const StudentList = () => {
 const [students, setStudents] = useState(
  StudentStore.getStudents()
);

  useEffect(() => {
    const unsubscribe = EventBus.subscribe(
      EVENTS.STUDENT_STORE_UPDATED,
  (students) => {
    setStudents([...students]);
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
                className="btn btn-danger btn-sm"
                onClick={() => StudentService.deleteStudent(student.id)}
                 >
                 Delete
               </button>
              <button
  className="btn btn-warning btn-sm me-2"
  onClick={() => StudentService.editStudent(student)}
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