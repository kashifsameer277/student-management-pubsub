import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";

const Layout = () => {
  return (
    <div className="d-flex">
      <Sidebar />

      <div
        className="flex-grow-1 p-4"
        style={{ background: "#f8f9fa", minHeight: "100vh" }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;