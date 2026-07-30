class EventBus {
  constructor() {
    this.events = {};
  }

  subscribe(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].push(callback);

    return () => {
      this.events[eventName] = this.events[eventName].filter(
        (listener) => listener !== callback
      );
    };
  }

  publish(eventName, data) {
    if (!this.events[eventName]) return;

    this.events[eventName].forEach((callback) => {
      callback(data);
    });
  }
}

export default new EventBus();