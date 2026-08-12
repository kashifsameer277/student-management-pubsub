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

  return (
    <div className="card p-3">
      <h4>Courses</h4>

      {/* Search */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by course name or code..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Course Code</th>
            <th width="180">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
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
                      CourseService.deleteCourse(
                        course.id
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
    </div>
  );
};

export default CourseList;