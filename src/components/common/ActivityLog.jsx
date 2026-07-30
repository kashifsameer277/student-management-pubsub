import { useEffect, useState } from "react";
import EventBus from "../../pubsub/EventBus";
import { EVENTS } from "../../pubsub/events";

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Student Added
    const unsubscribeAdd = EventBus.subscribe(
      EVENTS.STUDENT_ADD,
      (student) => {
        const time = new Date().toLocaleTimeString();

        setLogs((prevLogs) => [
          {
            id: Date.now(),
            message: `✅ ${student.name} was added`,
            time,
          },
          ...prevLogs,
        ]);
      }
    );

    // Student Updated
    const unsubscribeUpdate = EventBus.subscribe(
      EVENTS.STUDENT_UPDATE,
      (student) => {
        const time = new Date().toLocaleTimeString();

        setLogs((prevLogs) => [
          {
            id: Date.now(),
            message: `✏️ ${student.name} was updated`,
            time,
          },
          ...prevLogs,
        ]);
      }
    );

    // Student Deleted
    const unsubscribeDeleted = EventBus.subscribe(
      EVENTS.STUDENT_DELETED,
      (student) => {
        const time = new Date().toLocaleTimeString();

        setLogs((prevLogs) => [
          {
            id: Date.now(),
            message: `❌ ${student.name} was deleted`,
            time,
          },
          ...prevLogs,
        ]);
      }
    );

    return () => {
      unsubscribeAdd();
      unsubscribeUpdate();
      unsubscribeDeleted();
    };
  }, []);

  return (
    <div className="card p-3 mt-4">
      <h4>Activity Log</h4>

      {logs.length === 0 ? (
        <p>No activities yet.</p>
      ) : (
        <ul className="list-group">
          {logs.map((log) => (
            <li key={log.id} className="list-group-item">
              <strong>{log.time}</strong> — {log.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityLog;