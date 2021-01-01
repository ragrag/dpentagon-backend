import { EventEmitter } from 'events';

enum Events {
  USER_REGISTRATION = 'UserRegistered',
}
const eventEmitter = new EventEmitter();

export { eventEmitter, Events };
