import EventBus from "../pubsub/EventBus";
import { EVENTS } from "../pubsub/events";

class AttendanceStore {
  constructor() {
    this.attendance =
      JSON.parse(localStorage.getItem("attendance")) || [];

    // Add Attendance
    EventBus.subscribe(EVENTS.ATTENDANCE_ADD, (record) => {
       

      this.attendance.push(record);

      this.saveAttendance();
       

      EventBus.publish(
        EVENTS.ATTENDANCE_STORE_UPDATED,
        this.attendance
      );
    });

    // Update Attendance
    EventBus.subscribe(
  EVENTS.ATTENDANCE_UPDATE,
  (updatedRecord) => {
    this.attendance = this.attendance.map((record) =>
      record.id === updatedRecord.id
        ? updatedRecord
        : record
    );

    this.saveAttendance();

    EventBus.publish(
      EVENTS.ATTENDANCE_STORE_UPDATED,
      [...this.attendance]
    );
  }
);

    // Delete Attendance
    EventBus.subscribe(
      EVENTS.ATTENDANCE_DELETE,
      (id) => {
        this.attendance = this.attendance.filter(
          (record) => record.id !== id
        );

        this.saveAttendance();

        EventBus.publish(
          EVENTS.ATTENDANCE_STORE_UPDATED,
          this.attendance
        );
      }
    );
  }

  saveAttendance() {
    localStorage.setItem(
      "attendance",
      JSON.stringify(this.attendance)
    );
  }

  getAttendance() {
    return this.attendance;
  }
}

export default new AttendanceStore();