import { useEffect, useState } from "react";
import CourseStore from "../../store/CourseStore";
import EventBus from "../../pubsub/EventBus";
import { EVENTS } from "../../pubsub/events";
import CourseService from "../../services/CourseService";

const CourseList = () => {
  const [courses, setCourses] = useState(
    CourseStore.getCourses()
  );

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const coursesPerPage = 5;

  useEffect(() => {
    const unsubscribe = EventBus.subscribe(
      EVENTS.COURSE_STORE_UPDATED,
      (courses) => {
        setCourses([...courses]);
      }
    );

    return unsubscribe;
  }, []);

  // Search Filter
  const filteredCourses = courses.filter(
    (course) =>
      course.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      course.code
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  // Pagination
  const indexOfLastCourse =
    currentPage * coursesPerPage;

  const indexOfFirstCourse =
    indexOfLastCourse - coursesPerPage;

  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );

  const totalPages = Math.ceil(
    filteredCourses.length / coursesPerPage
  );

  return (
    <div className="card p-3">
      <h4>Courses</h4>

      {/* Search */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by course name or code..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />

      {/* Course Table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Course Code</th>
            <th width="180">Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentCourses.length > 0 ? (
            currentCourses.map((course) => (
              <tr key={course.id}>
                <td>{course.name}</td>
                <td>{course.code}</td>

                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() =>
                      CourseService.editCourse(course)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() =>
                      CourseService.deleteCourse(course.id)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="3"
                className="text-center"
              >
                No courses found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-3">
          <ul className="pagination justify-content-center mb-0">

            {/* Previous */}
            <li
              className={`page-item ${
                currentPage === 1 ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() =>
                  setCurrentPage(currentPage - 1)
                }
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>

            {/* Page Numbers */}
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index}
                className={`page-item ${
                  currentPage === index + 1
                    ? "active"
                    : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() =>
                    setCurrentPage(index + 1)
                  }
                >
                  {index + 1}
                </button>
              </li>
            ))}

            {/* Next */}
            <li
              className={`page-item ${
                currentPage === totalPages
                  ? "disabled"
                  : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() =>
                  setCurrentPage(currentPage + 1)
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>

          </ul>
        </nav>
      )}
    </div>
  );
};

export default CourseList;