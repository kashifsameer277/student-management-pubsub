import EventBus from "../pubsub/EventBus";
import { EVENTS } from "../pubsub/events";

class StudentStore {
  constructor() {
    this.students =
  JSON.parse(localStorage.getItem("students")) || [];

    EventBus.subscribe(EVENTS.STUDENT_ADD, (student) => {
      this.students.push(student);
      this.saveStudents();
      EventBus.publish(
  EVENTS.STUDENT_STORE_UPDATED,
  this.students
);
     EventBus.publish(EVENTS.DASHBOARD_REFRESH, {
        totalStudents: this.students.length,
      });
    });
  EventBus.subscribe(EVENTS.STUDENT_DELETE, (id) => {
  const deletedStudent = this.students.find(
    (student) => student.id === id
  );

  this.students = this.students.filter(
    (student) => student.id !== id
  );
  this.saveStudents();

  EventBus.publish(
    EVENTS.STUDENT_STORE_UPDATED,
    this.students
  );

  EventBus.publish(EVENTS.DASHBOARD_REFRESH, {
    totalStudents: this.students.length,
  });

  EventBus.publish(EVENTS.STUDENT_DELETED, deletedStudent);
});
EventBus.subscribe(EVENTS.STUDENT_UPDATE, (updatedStudent) => {
  this.students = this.students.map((student) =>
    student.id === updatedStudent.id
      ? updatedStudent
      : student
  );
  this.saveStudents();

  EventBus.publish(
    EVENTS.STUDENT_STORE_UPDATED,
    this.students
  );

  EventBus.publish(EVENTS.DASHBOARD_REFRESH, {
    totalStudents: this.students.length,
  });
});
  }
  saveStudents() {
  localStorage.setItem(
    "students",
    JSON.stringify(this.students)
  );
}

  getStudents() {
    return this.students;
  }
}

export default new StudentStore();