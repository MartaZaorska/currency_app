class Watched {
  constructor(value) {
    this._value = value;
    this.subscribers = [];
  }

  notify(newValue) {
    this.subscribers.forEach(subscriber => subscriber(newValue));
  }

  get value() {
    return this._value;
  }

  set value(newValue) {
    if (this._value === newValue) return this._value;
    this._value = newValue;
    this.notify(newValue);
  }

  addSubscriber(subscriber) {
    this.subscribers.push(subscriber);
  }
}
