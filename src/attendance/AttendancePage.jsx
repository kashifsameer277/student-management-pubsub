import { useEffect, useState } from "react";
import StudentStore from "../store/StudentStore";
import AttendanceStore from "../store/AttendanceStore";
import AttendanceService from "../services/AttendanceService";
import EventBus from "../pubsub/EventBus";
import { EVENTS } from "../pubsub/events";

const AttendancePage = () => {
  const [students] = useState(StudentStore.getStudents());

  const [attendance, setAttendance] = useState(
    AttendanceStore.getAttendance()
  );
  const [historySearch, setHistorySearch] = useState("");
const [historyDate, setHistoryDate] = useState("");

  useEffect(() => {
     console.log(
    "AttendancePage subscribed to:",
    EVENTS.ATTENDANCE_STORE_UPDATED
  );
    const unsubscribe = EventBus.subscribe(
      EVENTS.ATTENDANCE_STORE_UPDATED,
      (records) => {
        console.log("Attendance updated:", records);
        setAttendance([...records]);
      }
    );
   

    return () => {
    console.log("AttendancePage unsubscribed");

    unsubscribe();
  };
  }, []);

const handleAttendance = (student, status) => {
  const today = new Date().toISOString().split("T")[0];

  const studentRecords = attendance.filter(
    (record) =>
      record.studentId === student.id &&
      record.date === today
  );

  const existingRecord =
    studentRecords[studentRecords.length - 1];

  if (existingRecord) {
    AttendanceService.updateAttendance({
      ...existingRecord,
      status: status,
    });
  } else {
    AttendanceService.markAttendance({
      id: Date.now() + Math.random(),
      studentId: student.id,
      studentName: student.name,
      status: status,
      date: today,
    });
  }
};
 const getStudentAttendance = (studentId) => {
  const today = new Date().toLocaleDateString();

  const records = attendance.filter(
    (record) =>
      record.studentId === studentId &&
      record.date === today
  );
  

  return records[records.length - 1];
};
const today = new Date().toLocaleDateString();

const todayAttendance = attendance.filter(
  (record) => record.date === today
);

const presentCount = todayAttendance.filter(
  (record) => record.status === "Present"
).length;

const absentCount = todayAttendance.filter(
  (record) => record.status === "Absent"
).length;

const totalStudents = students.length;

const attendancePercentage =
  totalStudents > 0
    ? Math.round((presentCount / totalStudents) * 100)
    : 0;
     const filteredAttendanceHistory = attendance.filter((record) => {
  const matchesSearch = record.studentName
    .toLowerCase()
    .includes(historySearch.toLowerCase());

  const matchesDate =
    historyDate === "" || record.date === historyDate;

  return matchesSearch && matchesDate;
});

  return (
    <div className="container mt-4">
      <h2 className="mb-4">📅 Attendance Management</h2>
      <div className="row mb-4">
  <div className="col-md-3">
    <div className="card text-center p-3">
      <h6>Total Students</h6>
      <h3>{totalStudents}</h3>
    </div>
  </div>

  <div className="col-md-3">
    <div className="card text-center p-3 border-success">
      <h6>Present Today</h6>
      <h3 className="text-success">{presentCount}</h3>
    </div>
  </div>

  <div className="col-md-3">
    <div className="card text-center p-3 border-danger">
      <h6>Absent Today</h6>
      <h3 className="text-danger">{absentCount}</h3>
    </div>
  </div>

  <div className="col-md-3">
    <div className="card text-center p-3 border-primary">
      <h6>Attendance</h6>
      <h3 className="text-primary">
        {attendancePercentage}%
      </h3>
    </div>
  </div>
</div>

      <div className="card p-3">
        <h4 className="mb-3">Mark Attendance</h4>
      

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Roll No.</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {students.length > 0 ? (
              students.map((student) => {
                const record = getStudentAttendance(student.id);

                return (
                  <tr key={student.id}>
                    <td>{student.name}</td>

                    <td>{student.rollNo}</td>

                    <td>
                      {record ? (
                        <span
                          className={
                            record.status === "Present"
                              ? "badge bg-success"
                              : "badge bg-danger"
                          }
                        >
                          {record.status}
                        </span>
                      ) : (
                        <span className="badge bg-secondary">
                          Not Marked
                        </span>
                      )}
                    </td>

                    <td>
                      <button
                        type="button"
                        className="btn btn-success btn-sm me-2"
                        onClick={() =>
                          handleAttendance(student, "Present")
                        }
                      >
                        Present
                      </button>

                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          handleAttendance(student, "Absent")
                        }
                      >
                        Absent
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* attendance History */}
      <div className="card mt-4">
  <div className="card-body">
    <h4 className="mb-3">📋 Attendance History</h4>
              <div className="row mb-3">
  <div className="col-md-6 mb-2">
    <input
      type="text"
      className="form-control"
      placeholder="🔍 Search by student name..."
      value={historySearch}
      onChange={(e) => setHistorySearch(e.target.value)}
    />
  </div>

  <div className="col-md-4 mb-2">
    <input
      type="date"
      className="form-control"
      value={historyDate}
      onChange={(e) => setHistoryDate(e.target.value)}
    />
  </div>

  <div className="col-md-2 mb-2">
    <button
      className="btn btn-secondary w-100"
      onClick={() => {
        setHistorySearch("");
        setHistoryDate("");
      }}
    >
      Clear
    </button>
  </div>
</div>
    <table className="table table-bordered table-hover">
      <thead>
        <tr>
          <th>Student Name</th>
          <th>Date</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {filteredAttendanceHistory.length > 0 ? (
          [...filteredAttendanceHistory]
            .reverse()
            .map((record) => (
              <tr key={record.id}>
                <td>{record.studentName}</td>

                <td>{record.date}</td>

                <td>
                  <span
                    className={
                      record.status === "Present"
                        ? "badge bg-success"
                        : "badge bg-danger"
                    }
                  >
                    {record.status}
                  </span>
                </td>
              </tr>
            ))
        ) : (
          <tr>
            <td colSpan="3" className="text-center text-muted">
              No attendance records found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>
    </div>
  );
};

export default AttendancePage;