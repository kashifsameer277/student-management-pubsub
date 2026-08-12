import EventBus from "../pubsub/EventBus";
import { EVENTS } from "../pubsub/events";

class ActivityStore {
  constructor() {
    this.activities =
      JSON.parse(localStorage.getItem("activities")) || [];

    // Student Added
    EventBus.subscribe(EVENTS.STUDENT_ADD, (student) => {
      this.addActivity(`👨‍🎓 ${student.name} was added`);
    });

    // Student Updated
    EventBus.subscribe(EVENTS.STUDENT_UPDATE, (student) => {
      this.addActivity(`✏️ ${student.name} was updated`);
    });

    // Student Deleted
    EventBus.subscribe(EVENTS.STUDENT_DELETED, (student) => {
      if (student) {
        this.addActivity(`❌ ${student.name} was deleted`);
      }
    });

    // Teacher Added
    EventBus.subscribe(EVENTS.TEACHER_ADD, (teacher) => {
      this.addActivity(`👨‍🏫 ${teacher.name} was added`);
    });

    // Teacher Updated
    EventBus.subscribe(EVENTS.TEACHER_UPDATE, (teacher) => {
      this.addActivity(`✏️ ${teacher.name} was updated`);
    });

    // Teacher Deleted
    EventBus.subscribe(EVENTS.TEACHER_DELETED, (teacher) => {
      if (teacher) {
        this.addActivity(`❌ ${teacher.name} was deleted`);
      }
    });
  }

  addActivity(message) {
    const activity = {
      id: Date.now() + Math.random(),
      message,
      time: new Date().toLocaleTimeString(),
    };

    this.activities = [
      activity,
      ...this.activities,
    ].slice(0, 10);

    localStorage.setItem(
      "activities",
      JSON.stringify(this.activities)
    );

    EventBus.publish(
      EVENTS.ACTIVITY_UPDATED,
      this.activities
    );
  }

  getActivities() {
    return this.activities;
  }
}

export default new ActivityStore();