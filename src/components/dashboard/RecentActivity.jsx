import { useEffect, useState } from "react";
import EventBus from "../../pubsub/EventBus";
import { EVENTS } from "../../pubsub/events";

const RecentActivity = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const addLog = (message) => {
      setLogs((prev) => [
        {
          id: Date.now() + Math.random(),
          time: new Date().toLocaleTimeString(),
          message,
        },
        ...prev.slice(0, 9), // Keep only the latest 10 logs
      ]);
    };

    const unsubStudentAdd = EventBus.subscribe(
      EVENTS.STUDENT_ADD,
      (student) => {
    console.log("Student Add Event:", student);

    addLog(`👨‍🎓 ${student.name} was added`);
  }
);

    const unsubStudentUpdate = EventBus.subscribe(
      EVENTS.STUDENT_UPDATE,
      (student) => addLog(`✏️ ${student.name} was updated`)
    );

    const unsubStudentDelete = EventBus.subscribe(
      EVENTS.STUDENT_DELETED,
      (student) => {
        if (student) addLog(`❌ ${student.name} was deleted`);
      }
    );

    const unsubTeacherAdd = EventBus.subscribe(
      EVENTS.TEACHER_ADD,
      (teacher) => addLog(`👨‍🏫 ${teacher.name} was added`)
    );

    const unsubTeacherUpdate = EventBus.subscribe(
      EVENTS.TEACHER_UPDATE,
      (teacher) => addLog(`✏️ ${teacher.name} was updated`)
    );

    const unsubTeacherDelete = EventBus.subscribe(
      EVENTS.TEACHER_DELETED,
      (teacher) => {
        if (teacher) addLog(`❌ ${teacher.name} was deleted`);
      }
    );

    return () => {
      unsubStudentAdd();
      unsubStudentUpdate();
      unsubStudentDelete();
      unsubTeacherAdd();
      unsubTeacherUpdate();
      unsubTeacherDelete();
    };
  }, []);

  return (
    <div className="card shadow rounded-4 mt-4">
      <div className="card-header bg-dark text-white">
        <h5 className="mb-0">🕒 Recent Activity</h5>
      </div>

      <div className="card-body">
        {logs.length === 0 ? (
          <p className="text-muted">No recent activities.</p>
        ) : (
          <ul className="list-group list-group-flush">
            {logs.map((log) => (
              <li key={log.id} className="list-group-item">
                <strong>{log.time}</strong> — {log.message}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;