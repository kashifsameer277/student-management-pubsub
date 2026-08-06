import EventBus from "../pubsub/EventBus";
import { EVENTS } from "../pubsub/events";

class TeacherService {
  addTeacher(teacher) {
    EventBus.publish(EVENTS.TEACHER_ADD, teacher);
  }

  editTeacher(teacher) {
    EventBus.publish(EVENTS.TEACHER_EDIT, teacher);
  }

  updateTeacher(teacher) {
    EventBus.publish(EVENTS.TEACHER_UPDATE, teacher);
  }

  deleteTeacher(id) {
    EventBus.publish(EVENTS.TEACHER_DELETE, id);
  }
}

export default new TeacherService();