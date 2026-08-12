import { useEffect, useState } from "react";
import EventBus from "../../pubsub/EventBus";
import { EVENTS } from "../../pubsub/events";
import StudentStore from "../../store/StudentStore";
import StatsCard from "./StatsCard";
import TeacherStore from "../../store/TeacherStore";
import RecentActivity from "./RecentActivity";
import { Link } from "react-router-dom";
import CourseStore from "../../store/CourseStore";


const Dashboard = () => {
  const [totalStudents, setTotalStudents] = useState(
    StudentStore.getStudents().length
  );
  const [totalTeachers, setTotalTeachers] = useState(
  TeacherStore.getTeachers().length
);
const [totalCourses, setTotalCourses] = useState(
  CourseStore.getCourses().length
);

  useEffect(() => {
    const unsubscribe = EventBus.subscribe(
      EVENTS.STUDENT_STORE_UPDATED,
      (students) => {
        setTotalStudents(students.length);
      }
    );
    const unsubscribeTeacher = EventBus.subscribe(
  EVENTS.TEACHER_STORE_UPDATED,
  (teachers) => {
    setTotalTeachers(teachers.length);
  }
);
const unsubscribeCourses = EventBus.subscribe(
  EVENTS.COURSE_STORE_UPDATED,
  (courses) => {
    setTotalCourses(courses.length);
  }
);

    return () => {
  unsubscribe();
  unsubscribeTeacher();
   unsubscribeCourses();
};
  }, []);

  return (
  <div className="container-fluid">

    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 className="fw-bold">
          🎓 School Management Dashboard
        </h2>

        <p className="text-muted mb-0">
          Welcome back! Here's an overview of your system.
        </p>
      </div>

      <div>
  <Link
    to="/students"
    className="btn btn-primary me-2"
  >
    + Student
  </Link>

  <Link
    to="/teachers"
    className="btn btn-success"
  >
    + Teacher
  </Link>
</div>
    </div>
      <div className="row">
        <StatsCard
          title="Students"
          value={totalStudents}
          icon="👨‍🎓"
          color="primary"
        />

        <StatsCard
          title="Teachers"
          value={totalTeachers}
          icon="👨‍🏫"
          color="success"
        />

        <StatsCard
          title="Attendance"
          value="0%"
          icon="📅"
          color="warning"
        />

        <StatsCard
          title="Courses"
          value={totalCourses}
          icon="📚"
          color="danger"
        />
      </div>
      <RecentActivity />
    </div>
    
  );
};

export default Dashboard;