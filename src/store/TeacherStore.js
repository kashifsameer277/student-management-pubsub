import EventBus from "../pubsub/EventBus";
import { EVENTS } from "../pubsub/events";

class TeacherStore {
  constructor() {
    this.teachers =
      JSON.parse(localStorage.getItem("teachers")) || [];

    EventBus.subscribe(EVENTS.TEACHER_ADD, (teacher) => {
      this.teachers.push(teacher);
      this.saveTeachers();

      EventBus.publish(
        EVENTS.TEACHER_STORE_UPDATED,
        this.teachers
      );
    });

    EventBus.subscribe(EVENTS.TEACHER_DELETE, (id) => {
      const deletedTeacher = this.teachers.find(
        (teacher) => teacher.id === id
      );

      this.teachers = this.teachers.filter(
        (teacher) => teacher.id !== id
      );

      this.saveTeachers();

      EventBus.publish(
        EVENTS.TEACHER_STORE_UPDATED,
        this.teachers
      );

      EventBus.publish(
        EVENTS.TEACHER_DELETED,
        deletedTeacher
      );
    });

    EventBus.subscribe(EVENTS.TEACHER_UPDATE, (updatedTeacher) => {
      this.teachers = this.teachers.map((teacher) =>
        teacher.id === updatedTeacher.id
          ? updatedTeacher
          : teacher
      );

      this.saveTeachers();

      EventBus.publish(
        EVENTS.TEACHER_STORE_UPDATED,
        this.teachers
      );
    });
  }

  saveTeachers() {
    localStorage.setItem(
      "teachers",
      JSON.stringify(this.teachers)
    );
  }

  getTeachers() {
    return this.teachers;
  }
}

export default new TeacherStore();