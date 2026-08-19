import EventBus from "../pubsub/EventBus";
import { EVENTS } from "../pubsub/events";
import {
  addStudent,
  deleteStudent,
  updateStudent,
} from "../api/studentApi";

class StudentService {
  async addStudent(student) {
    try {
      const newStudent = await addStudent(student);

      EventBus.publish(
        EVENTS.STUDENT_ADD,
        newStudent
      );

      return newStudent;
    } catch (error) {
      console.error("Error adding student:", error);
      throw error;
    }
  }

  async deleteStudent(id) {
    try {
      const result = await deleteStudent(id);

      EventBus.publish(
        EVENTS.STUDENT_DELETE,
        id
      );

      return result;
    } catch (error) {
      console.error("Delete student error:", error);
      throw error;
    }
  }

  async updateStudent(student) {
    try {
      const updatedStudent = await updateStudent(student);

      EventBus.publish(
        EVENTS.STUDENT_UPDATE,
        updatedStudent
      );

      return updatedStudent;
    } catch (error) {
      console.error("Update student error:", error);
      throw error;
    }
  }

  editStudent(student) {
    EventBus.publish(
      EVENTS.STUDENT_EDIT,
      student
    );
  }
}

export default new StudentService();