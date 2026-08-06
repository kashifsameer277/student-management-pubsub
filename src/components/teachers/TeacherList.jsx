import { useEffect, useState } from "react";
import TeacherStore from "../../store/TeacherStore";
import EventBus from "../../pubsub/EventBus";
import { EVENTS } from "../../pubsub/events";
import TeacherService from "../../services/TeacherService";

const TeacherList = () => {
  const [teachers, setTeachers] = useState(
    TeacherStore.getTeachers()
  );

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
const teachersPerPage = 5;

  useEffect(() => {
    const unsubscribe = EventBus.subscribe(
      EVENTS.TEACHER_STORE_UPDATED,
      (teachers) => {
        setTeachers([...teachers]);
      }
    );

    return unsubscribe;
  }, []);

  // Search Filter
  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(search.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(search.toLowerCase())
  );
  const indexOfLastTeacher = currentPage * teachersPerPage;
const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;

const currentTeachers = filteredTeachers.slice(
  indexOfFirstTeacher,
  indexOfLastTeacher
);

const totalPages = Math.ceil(
  filteredTeachers.length / teachersPerPage
);

  return (
    <div className="card p-3">
      <h4>Teachers</h4>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search teacher by name or subject..."
        value={search}
        onChange={(e) => {
  setSearch(e.target.value);
  setCurrentPage(1);
}}
      />

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Subject</th>
            <th width="180">Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentTeachers.length > 0 ? (
            currentTeachers.map((teacher) => (
              <tr key={teacher.id}>
                <td>{teacher.name}</td>
                <td>{teacher.subject}</td>

                <td>
                
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() =>
                      TeacherService.editTeacher(teacher)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() =>
                      TeacherService.deleteTeacher(
                        teacher.id
                      )
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                No teachers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
       <div className="d-flex justify-content-between align-items-center mt-3">
  <div>
    Showing <strong>{indexOfFirstTeacher + 1}</strong> to{" "}
    <strong>{Math.min(indexOfLastTeacher, filteredTeachers.length)}</strong> of{" "}
    <strong>{filteredTeachers.length}</strong> teachers
  </div>

  <nav>
    <ul className="pagination mb-0">

      <li
        className={`page-item ${
          currentPage === 1 ? "disabled" : ""
        }`}
      >
        <button
          className="page-link"
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
      </li>

      {[...Array(totalPages)].map((_, index) => (
        <li
          key={index}
          className={`page-item ${
            currentPage === index + 1 ? "active" : ""
          }`}
        >
          <button
            className="page-link"
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        </li>
      ))}

      <li
        className={`page-item ${
          currentPage === totalPages ? "disabled" : ""
        }`}
      >
        <button
          className="page-link"
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </li>

    </ul>
  </nav>
</div>
    </div>
  );
};

export default TeacherList;