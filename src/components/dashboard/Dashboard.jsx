import { useEffect, useState } from "react";
import EventBus from "../../pubsub/EventBus";
import { EVENTS } from "../../pubsub/events";

const Dashboard = () => {
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    const unsubscribe = EventBus.subscribe(
      EVENTS.STUDENT_ADD,
      () => {
        setTotalStudents((count) => count + 1);
      }
    );

    return unsubscribe;
  }, []);

  return (
    <div className="card p-3 mb-3">
      <h3>Dashboard</h3>
      <h4>Total Students: {totalStudents}</h4>
    </div>
  );
};

export default Dashboard;