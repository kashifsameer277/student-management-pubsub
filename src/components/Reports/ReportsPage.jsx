import { useEffect, useState, useRef } from "react";

import StudentStore from "../../store/StudentStore";
import AttendanceStore from "../../store/AttendanceStore";

import EventBus from "../../pubsub/EventBus";
import { EVENTS } from "../../pubsub/events";

const ReportsPage = () => {
 
  const [presentToday, setPresentToday] = useState(0);
const [absentToday, setAbsentToday] = useState(0);
const [attendancePercentage, setAttendancePercentage] = useState(0);
const [studentSearch, setStudentSearch] = useState("");
const [attendanceFilter, setAttendanceFilter] = useState("All");
const [selectedDate, setSelectedDate] = useState(
  new Date().toISOString().split("T")[0]
);
const calculateAttendanceReport = (records, date) => {
  const selectedDateRecords = records.filter(
    (record) => record.date === date
  );

  const present = selectedDateRecords.filter(
    (record) => record.status === "Present"
  ).length;

  const absent = selectedDateRecords.filter(
    (record) => record.status === "Absent"
  ).length;

  const totalStudents = StudentStore.getStudents().length;

  const percentage =
    totalStudents > 0
      ? Math.round((present / totalStudents) * 100)
      : 0;

  setPresentToday(present);
  setAbsentToday(absent);
  setAttendancePercentage(percentage);
};
const reportRef = useRef();
const selectedDateReportRef = useRef();

  useEffect(() => {
   

   const unsubAttendance = EventBus.subscribe(
  EVENTS.ATTENDANCE_STORE_UPDATED,
  (records) => {
   calculateAttendanceReport(records, selectedDate);
  }
);
calculateAttendanceReport(
  AttendanceStore.getAttendance(),
  selectedDate
);

    return () => {
      unsubAttendance();
    };
  }, []);
  useEffect(() => {
  calculateAttendanceReport(
    AttendanceStore.getAttendance(),
    selectedDate
  );
}, [selectedDate]);
const getStudentAttendanceReport = () => {
  const students = StudentStore.getStudents();
  const attendanceRecords = AttendanceStore.getAttendance();

  return students.map((student) => {
    const studentRecords = attendanceRecords.filter(
      (record) => record.studentId === student.id
    );

    const present = studentRecords.filter(
      (record) => record.status === "Present"
    ).length;

    const absent = studentRecords.filter(
      (record) => record.status === "Absent"
    ).length;

    const total = present + absent;

    const percentage =
      total > 0
        ? Math.round((present / total) * 100)
        : 0;

    return {
      ...student,
      present,
      absent,
      percentage,
    };
  });
};
const studentAttendanceReport = getStudentAttendanceReport();
const filteredStudentAttendanceReport =
  studentAttendanceReport.filter((student) => {
    const matchesSearch = student.name
      .toLowerCase()
      .includes(studentSearch.toLowerCase());

    const matchesFilter =
      attendanceFilter === "All" ||
      (attendanceFilter === "Good" &&
        student.percentage >= 75) ||
      (attendanceFilter === "Average" &&
        student.percentage >= 50 &&
        student.percentage < 75) ||
      (attendanceFilter === "Low" &&
        student.percentage < 50);

    return matchesSearch && matchesFilter;
  });
  const savedSettings = JSON.parse(
  localStorage.getItem("instituteSettings")
) || {};
  const handlePrint = () => {
  const printContent =
  selectedDateReportRef.current.innerHTML;

  const printWindow = window.open(
    "",
    "",
    "width=1000,height=800"
  );

  printWindow.document.write(`
    <html>
      <head>
        <title>Student Attendance Report</title>

        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 30px;
            color: #222;
          }

          .report-header {
            text-align: center;
            margin-bottom: 25px;
            border-bottom: 2px solid #333;
            padding-bottom: 15px;
          }

          .report-header h1 {
            margin: 0;
            font-size: 24px;
          }

          .report-header h2 {
            margin: 5px 0;
            font-size: 18px;
            font-weight: normal;
          }

          .report-date {
            font-size: 13px;
            color: #666;
          }
            .no-print {
  display: none;
}
  .report-header p {
  margin: 3px 0;
  font-size: 14px;
}

.report-header h2 {
  margin-top: 15px;
}

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }

          th,
          td {
            border: 1px solid #333;
            padding: 10px;
            text-align: center;
          }

          th {
            background: #f2f2f2;
            font-weight: bold;
          }

          td:first-child {
            text-align: left;
          }

          .badge {
            padding: 5px 8px;
            border-radius: 4px;
            font-weight: bold;
          }

          .bg-success {
            color: #198754;
          }

          .bg-warning {
            color: #b58100;
          }

          .bg-danger {
            color: #dc3545;
          }

          .text-muted {
            color: #666;
          }

          h4 {
            display: none;
          }

          @media print {
            body {
              padding: 15px;
            }
          }
            
        </style>
      </head>

      <body>

       <div class="report-header">
  <h1>
    ${savedSettings.instituteName || "Radiant Coaching Centre"}
  </h1>

  ${
    savedSettings.address
      ? `<p>${savedSettings.address}</p>`
      : ""
  }

  ${
    savedSettings.phone
      ? `<p>Phone: ${savedSettings.phone}</p>`
      : ""
  }

  ${
    savedSettings.email
      ? `<p>Email: ${savedSettings.email}</p>`
      : ""
  }

  <h2>Student Attendance Report</h2>

  <div class="report-date">
    Date: ${selectedDate.split("-").reverse().join("/")}
  </div>
</div>

        ${printContent}

      </body>
    </html>
  `);

  printWindow.document.close();

  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
};
const handleExportCSV = () => {
  const headers = [
    "Student Name",
    "Roll No.",
    "Present",
    "Absent",
    "Attendance Percentage",
  ];

  const rows = filteredStudentAttendanceReport.map(
    (student) => [
      student.name,
      student.rollNo,
      student.present,
      student.absent,
      `${student.percentage}%`,
    ]
  );

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob(
    [csvContent],
    { type: "text/csv;charset=utf-8;" }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.setAttribute(
    "download",
    "Student_Attendance_Report.csv"
  );

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};
const selectedDateAttendanceReport =
  StudentStore.getStudents().map((student) => {
    const record = AttendanceStore.getAttendance().find(
      (record) =>
        record.studentId === student.id &&
        record.date === selectedDate
    );

    return {
      ...student,
      status: record ? record.status : "Not Marked",
    };
  });
  return (
    <div className="container mt-4">
      <h2 className="mb-4">📊 Reports</h2>

      <div className="card mb-4">
  <div className="card-body">
    <div className="row align-items-center">
      <div className="col-md-6">
        <h5 className="mb-md-0">
          📅 Select Attendance Date
        </h5>
      </div>

      <div className="col-md-6">
        <input
          type="date"
          className="form-control"
          value={selectedDate}
          onChange={(e) =>
            setSelectedDate(e.target.value)
          }
        />
      </div>
    </div>
  </div>
</div>
      {/* Attendance Summary */}
<div className="card mt-2">
  <div className="card-body">
    <h4 className="mb-4">📅 Attendance Summary</h4>

    <div className="row">
      

      <div className="col-md-4 mb-3">
        <div className="card border-success text-center p-3">
          <h6 className="text-muted">Present Today</h6>

          <h2 className="text-success">
            {presentToday}
          </h2>

          <small className="text-success">
            Students Present
          </small>
        </div>
      </div>

      <div className="col-md-4 mb-3">
        <div className="card border-danger text-center p-3">
          <h6 className="text-muted">Absent Today</h6>

          <h2 className="text-danger">
            {absentToday}
          </h2>

          <small className="text-danger">
            Students Absent
          </small>
        </div>
      </div>

      <div className="col-md-4 mb-3">
        <div className="card border-primary text-center p-3">
          <h6 className="text-muted">
            Attendance Percentage
          </h6>

          <h2 className="text-primary">
            {attendancePercentage}%
          </h2>

          <small className="text-primary">
            Today's Attendance
          </small>
        </div>
      </div>

    </div>
  </div>
</div>
{/* Selected Date Attendance Report */}
{/* Selected Date Attendance Report */}
<div
  className="card mt-4"
  ref={selectedDateReportRef}
>
  <div className="card-body">
    <h4 className="mb-3">
      📅 Attendance for Selected Date
    </h4>

    <div className="table-responsive">
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Student Name</th>
            <th>Roll No.</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {selectedDateAttendanceReport.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>

              <td>{student.rollNo}</td>

              <td>
                <span
                  className={
                    student.status === "Present"
                      ? "badge bg-success"
                      : student.status === "Absent"
                      ? "badge bg-danger"
                      : "badge bg-secondary"
                  }
                >
                  {student.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>
{/* Student-wise Attendance Report */}
<div className="card mt-4" ref={reportRef}>
  <div className="card-body">
  <div className="d-flex justify-content-between align-items-center mb-3">
  <h4 className="mb-0">
    👨‍🎓 Student-wise Attendance Report
  </h4>

  <div>
    <button
      className="btn btn-success me-2"
      onClick={handleExportCSV}
    >
      📥 Export CSV
    </button>

    <button
      className="btn btn-primary"
      onClick={handlePrint}
    >
      🖨️ Print Report
    </button>
  </div>
</div>
   <div className="row mb-3 no-print">
  <div className="col-md-6 mb-2">
    <input
      type="text"
      className="form-control"
      placeholder="🔍 Search student by name..."
      value={studentSearch}
      onChange={(e) =>
        setStudentSearch(e.target.value)
      }
    />
  </div>

  <div className="col-md-4 mb-2">
    <select
      className="form-select"
      value={attendanceFilter}
      onChange={(e) =>
        setAttendanceFilter(e.target.value)
      }
    >
      <option value="All">All Students</option>
      <option value="Good">
        🟢 Good Attendance (75%+)
      </option>
      <option value="Average">
        🟡 Average Attendance (50% - 74%)
      </option>
      <option value="Low">
        🔴 Low Attendance (Below 50%)
      </option>
    </select>
  </div>
</div>

    <div className="table-responsive">
      <table className="table table-bordered table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Student Name</th>
            <th>Roll No.</th>
            <th>Present</th>
            <th>Absent</th>
            <th>Attendance %</th>
          </tr>
        </thead>

        <tbody>
          {filteredStudentAttendanceReport.length > 0 ? (
            filteredStudentAttendanceReport.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>

                <td>{student.rollNo}</td>

                <td>
                  <span className="badge bg-success">
                    {student.present}
                  </span>
                </td>

                <td>
                  <span className="badge bg-danger">
                    {student.absent}
                  </span>
                </td>

                <td>
                  <span
                    className={
                      student.percentage >= 75
                        ? "badge bg-success"
                        : student.percentage >= 50
                        ? "badge bg-warning text-dark"
                        : "badge bg-danger"
                    }
                  >
                    {student.percentage}%
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="5"
                className="text-center text-muted"
              >
                No students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
</div>
    </div>
  );
};

export default ReportsPage;