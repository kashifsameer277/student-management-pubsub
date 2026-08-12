import { useEffect, useState } from "react";
import EventBus from "../../pubsub/EventBus";
import { EVENTS } from "../../pubsub/events";
import CourseService from "../../services/CourseService";

const CourseForm = () => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    const unsubscribe = EventBus.subscribe(
      EVENTS.COURSE_EDIT,
      (course) => {
        setEditingCourse(course);
        setName(course.name);
        setCode(course.code);
      }
    );

    return unsubscribe;
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !code) return;

    if (editingCourse) {
      CourseService.updateCourse({
        ...editingCourse,
        name,
        code,
      });

      setEditingCourse(null);
    } else {
      CourseService.addCourse({
        id: Date.now(),
        name,
        code,
      });
    }

    setName("");
    setCode("");
  };

  return (
    <div className="card p-3 mb-4">
      <h4>
        {editingCourse ? "Edit Course" : "Add Course"}
      </h4>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Course Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          className="form-control mb-2"
          placeholder="Course Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <button className="btn btn-success">
          {editingCourse ? "Update Course" : "Add Course"}
        </button>
      </form>
    </div>
  );
};

export default CourseForm;