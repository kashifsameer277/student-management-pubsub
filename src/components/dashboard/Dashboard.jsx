import { useEffect, useState } from "react";
import EventBus from "../../pubsub/EventBus";
import { EVENTS } from "../../pubsub/events";
import StudentStore from "../../store/StudentStore";
import StatsCard from "./StatsCard";
import TeacherStore from "../../store/TeacherStore";
import RecentActivity from "./RecentActivity";
import { Link } from "react-router-dom";
import CourseStore from "../../store/CourseStore";
import AttendanceStore from "../../store/AttendanceStore";



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
const [attendancePercentage, setAttendancePercentage] =
  useState(0);
  const [presentToday, setPresentToday] = useState(0);
const [absentToday, setAbsentToday] = useState(0);

  const calculateAttendance = (records) => {
  const today = new Date().toLocaleDateString();

  const todayAttendance = records.filter(
    (record) => record.date === today
  );

  const presentCount = todayAttendance.filter(
    (record) => record.status === "Present"
  ).length;

  const absentCount = todayAttendance.filter(
    (record) => record.status === "Absent"
  ).length;

  const total = StudentStore.getStudents().length;

  const percentage =
    total > 0
      ? Math.round((presentCount / total) * 100)
      : 0;

  setPresentToday(presentCount);
  setAbsentToday(absentCount);
  setAttendancePercentage(percentage);
};

 useEffect(() => {
  const unsubscribe = EventBus.subscribe(
    EVENTS.STUDENT_STORE_UPDATED,
    (students) => {
      setTotalStudents(students.length);

      calculateAttendance(
        AttendanceStore.getAttendance()
      );
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

  const unsubscribeAttendance = EventBus.subscribe(
    EVENTS.ATTENDANCE_STORE_UPDATED,
    (records) => {
      calculateAttendance(records);
    }
  );

  // Calculate attendance when Dashboard opens
  calculateAttendance(
    AttendanceStore.getAttendance()
  );

  return () => {
    unsubscribe();
    unsubscribeTeacher();
    unsubscribeCourses();
    unsubscribeAttendance();
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
  value={`${attendancePercentage}%`}
  icon="📅"
  color="warning"
  presentToday={presentToday}
  absentToday={absentToday}
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