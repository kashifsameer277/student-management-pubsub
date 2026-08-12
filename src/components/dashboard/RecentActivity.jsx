import { useEffect, useState } from "react";
import EventBus from "../../pubsub/EventBus";
import { EVENTS } from "../../pubsub/events";
import ActivityStore from "../../store/ActivityStore";

const RecentActivity = () => {
  const [logs, setLogs] = useState(
    ActivityStore.getActivities()
  );

  useEffect(() => {
    const unsubscribe = EventBus.subscribe(
      EVENTS.ACTIVITY_UPDATED,
      (activities) => {
        setLogs([...activities]);
      }
    );

    return unsubscribe;
  }, []);

  return (
    <div className="card shadow rounded-4 mt-4">
      <div className="card-header bg-dark text-white">
        <h5 className="mb-0">🕒 Recent Activity</h5>
      </div>

      <div className="card-body">
        {logs.length === 0 ? (
          <p className="text-muted mb-0">
            No recent activities.
          </p>
        ) : (
          <ul className="list-group list-group-flush">
            {logs.map((log) => (
              <li
                key={log.id}
                className="list-group-item"
              >
                <strong>{log.time}</strong>
                {" — "}
                {log.message}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;