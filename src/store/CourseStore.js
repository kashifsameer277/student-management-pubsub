import EventBus from "../pubsub/EventBus";
import { EVENTS } from "../pubsub/events";

class CourseStore {
  constructor() {
    this.courses =
      JSON.parse(localStorage.getItem("courses")) || [];

    // Add Course
    EventBus.subscribe(EVENTS.COURSE_ADD, (course) => {
      this.courses.push(course);

      this.saveCourses();

      EventBus.publish(
        EVENTS.COURSE_STORE_UPDATED,
        this.courses
      );
    });

    // Delete Course
    EventBus.subscribe(EVENTS.COURSE_DELETE, (id) => {
      const deletedCourse = this.courses.find(
        (course) => course.id === id
      );

      this.courses = this.courses.filter(
        (course) => course.id !== id
      );

      this.saveCourses();

      EventBus.publish(
        EVENTS.COURSE_STORE_UPDATED,
        this.courses
      );

      EventBus.publish(
        EVENTS.COURSE_DELETED,
        deletedCourse
      );
    });

    // Update Course
    EventBus.subscribe(
      EVENTS.COURSE_UPDATE,
      (updatedCourse) => {
        this.courses = this.courses.map((course) =>
          course.id === updatedCourse.id
            ? updatedCourse
            : course
        );

        this.saveCourses();

        EventBus.publish(
          EVENTS.COURSE_STORE_UPDATED,
          this.courses
        );
      }
    );
  }

  saveCourses() {
    localStorage.setItem(
      "courses",
      JSON.stringify(this.courses)
    );
  }

  getCourses() {
    return this.courses;
  }
}

export default new CourseStore();