import EventBus from "../pubsub/EventBus";
import { EVENTS } from "../pubsub/events";
import { getStudents } from "../api/studentApi";

class StudentStore {
  constructor() {
    // MySQL will be the source of truth
    this.students = [];

    // Load students from backend
    this.loadStudents();

    // ADD
    EventBus.subscribe(EVENTS.STUDENT_ADD, (student) => {
      this.students.push(student);

      EventBus.publish(
        EVENTS.STUDENT_STORE_UPDATED,
        this.students
      );

      EventBus.publish(EVENTS.DASHBOARD_REFRESH, {
        totalStudents: this.students.length,
      });
    });

    // DELETE
    EventBus.subscribe(EVENTS.STUDENT_DELETE, (id) => {
      const deletedStudent = this.students.find(
        (student) => String(student.id) === String(id)
      );

      this.students = this.students.filter(
        (student) => String(student.id) !== String(id)
      );

      EventBus.publish(
        EVENTS.STUDENT_STORE_UPDATED,
        this.students
      );

      EventBus.publish(EVENTS.DASHBOARD_REFRESH, {
        totalStudents: this.students.length,
      });

      EventBus.publish(
        EVENTS.STUDENT_DELETED,
        deletedStudent
      );
    });

    // UPDATE
    EventBus.subscribe(
      EVENTS.STUDENT_UPDATE,
      (updatedStudent) => {
        this.students = this.students.map((student) =>
          String(student.id) === String(updatedStudent.id)
            ? updatedStudent
            : student
        );

        EventBus.publish(
          EVENTS.STUDENT_STORE_UPDATED,
          this.students
        );

        EventBus.publish(EVENTS.DASHBOARD_REFRESH, {
          totalStudents: this.students.length,
        });
      }
    );
  }

  // Load students from MySQL through backend
  async loadStudents() {
    try {
      const students = await getStudents();

      this.students = students;

      console.log(
        "Students loaded from MySQL:",
        this.students
      );

      EventBus.publish(
        EVENTS.STUDENT_STORE_UPDATED,
        this.students
      );

      EventBus.publish(EVENTS.DASHBOARD_REFRESH, {
        totalStudents: this.students.length,
      });
    } catch (error) {
      console.error(
        "Failed to load students:",
        error
      );
    }
  }

  getStudents() {
    return this.students;
  }
}

export default new StudentStore();