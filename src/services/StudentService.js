import EventBus from "../pubsub/EventBus";
import { EVENTS } from "../pubsub/events";

class StudentService {
  addStudent(student) {
    EventBus.publish(EVENTS.STUDENT_ADD, student);
  }
  deleteStudent(id) {
  EventBus.publish(EVENTS.STUDENT_DELETE, id);
}
updateStudent(student) {
  EventBus.publish(EVENTS.STUDENT_UPDATE, student);
}
editStudent(student) {
  EventBus.publish(EVENTS.STUDENT_EDIT, student);
}
}

export default new StudentService();