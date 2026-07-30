import EventBus from "../pubsub/EventBus";
import { EVENTS } from "../pubsub/events";

class AttendanceService {
  markAttendance(record) {
    EventBus.publish(EVENTS.ATTENDANCE_ADD, record);
  }

  updateAttendance(record) {
    EventBus.publish(EVENTS.ATTENDANCE_UPDATE, record);
  }

  deleteAttendance(id) {
    EventBus.publish(EVENTS.ATTENDANCE_DELETE, id);
  }
}

export default new AttendanceService();