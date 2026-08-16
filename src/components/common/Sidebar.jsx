import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import EventBus from "../../pubsub/EventBus";
import { EVENTS } from "../../pubsub/events";

const Sidebar = () => {
  const [instituteName, setInstituteName] = useState(
  "Radiant Coaching Centre"
);

useEffect(() => {
  const savedSettings = JSON.parse(
    localStorage.getItem("instituteSettings")
  );

  if (savedSettings?.instituteName) {
    setInstituteName(savedSettings.instituteName);
  }
}, []);
  return (
    <div
      className="bg-dark text-white"
      style={{
        width: "250px",
        minHeight: "100vh",
      }}
    >
      <h3 className="p-3 border-bottom">
  🏫 {instituteName}
</h3>

      <ul className="nav flex-column">

        <li className="nav-item">
          <NavLink
            className="nav-link text-white"
            to="/"
          >
            🏠 Dashboard
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            className="nav-link text-white"
            to="/students"
          >
            👨‍🎓 Students
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            className="nav-link text-white"
            to="/attendance"
          >
            📅 Attendance
          </NavLink>
        </li>
        <li className="nav-item">
  <NavLink
    className="nav-link text-white"
    to="/teachers"
  >
    👨‍🏫 Teachers
  </NavLink>
  <Link to="/courses" className="list-group-item list-group-item-action">
  📚 Courses
</Link>
<NavLink
  to="/reports"
  className="nav-link text-white"
>
  📊 Reports
</NavLink>
<NavLink to="/settings"
 className="nav-link text-white">

  ⚙️ Settings
</NavLink>
</li>

      </ul>
    </div>
  );
};

export default Sidebar;