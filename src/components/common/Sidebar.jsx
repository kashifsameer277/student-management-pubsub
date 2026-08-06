import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div
      className="bg-dark text-white"
      style={{
        width: "250px",
        minHeight: "100vh",
      }}
    >
      <h3 className="p-3 border-bottom">
        School ERP
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
</li>

      </ul>
    </div>
  );
};

export default Sidebar;