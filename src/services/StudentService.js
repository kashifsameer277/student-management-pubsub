import EventBus from "../pubsub/EventBus";
import { EVENTS } from "../pubsub/events";
import { addStudent } from "../api/studentApi";

class StudentService {
  async addStudent(student) {
    try {
      // Send student to backend/MySQL
      const newStudent = await addStudent(student);

      // Publish the student returned from MySQL
      EventBus.publish(EVENTS.STUDENT_ADD, newStudent);

      return newStudent;
    } catch (error) {
      console.error("Error adding student:", error);
      throw error;
    }
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