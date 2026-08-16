import { useEffect, useState } from "react";
import EventBus from "../../pubsub/EventBus";
import { EVENTS } from "../../pubsub/events";
import StudentService from "../../services/StudentService";

const StudentForm = () => {
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    const unsubscribe = EventBus.subscribe(
      EVENTS.STUDENT_EDIT,
      (student) => {
        setEditingStudent(student);
        setName(student.name);
        setRollNo(student.rollNo);
      }
    );

    return unsubscribe;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !rollNo) return;

    try {
      if (editingStudent) {
        StudentService.updateStudent({
          ...editingStudent,
          name,
          rollNo,
        });

        setEditingStudent(null);
      } else {
        await StudentService.addStudent({
          name,
          rollNo,
        });
      }

      setName("");
      setRollNo("");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add student");
    }
  };

  return (
    <div className="card p-3 mb-4">
      <h4>
        {editingStudent ? "Update Student" : "Add Student"}
      </h4>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          className="form-control mb-2"
          placeholder="Roll Number"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
        />

        <button className="btn btn-primary">
          {editingStudent ? "Update Student" : "Add Student"}
        </button>
      </form>
    </div>
  );
};

export default StudentForm;