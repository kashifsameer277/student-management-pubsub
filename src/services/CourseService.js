import EventBus from "../pubsub/EventBus";
import { EVENTS } from "../pubsub/events";

class CourseService {
  addCourse(course) {
    EventBus.publish(EVENTS.COURSE_ADD, course);
  }

  deleteCourse(id) {
    EventBus.publish(EVENTS.COURSE_DELETE, id);
  }

  updateCourse(course) {
    EventBus.publish(EVENTS.COURSE_UPDATE, course);
  }

  editCourse(course) {
    EventBus.publish(EVENTS.COURSE_EDIT, course);
  }
}

export default new CourseService();