import { useEffect, useState } from "react";
import EventBus from "../../pubsub/EventBus";
import { EVENTS } from "../../pubsub/events";
import TeacherService from "../../services/TeacherService";

const TeacherForm = () => {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [editingTeacher, setEditingTeacher] = useState(null);

  useEffect(() => {
    const unsubscribe = EventBus.subscribe(
      EVENTS.TEACHER_EDIT,
      (teacher) => {
        setEditingTeacher(teacher);
        setName(teacher.name);
        setSubject(teacher.subject);
      }
    );

    return unsubscribe;
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !subject) return;

    if (editingTeacher) {
      TeacherService.updateTeacher({
        ...editingTeacher,
        name,
        subject,
      });

      setEditingTeacher(null);
    } else {
      TeacherService.addTeacher({
        id: Date.now(),
        name,
        subject,
      });
    }

    setName("");
    setSubject("");
  };

  return (
    <div className="card p-3 mb-4">
      <h4>
        {editingTeacher ? "Update Teacher" : "Add Teacher"}
      </h4>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Teacher Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          className="form-control mb-2"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <button className="btn btn-success">
          {editingTeacher
            ? "Update Teacher"
            : "Add Teacher"}
        </button>
      </form>
    </div>
  );
};

export default TeacherForm;