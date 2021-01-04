import { EventEmitter } from 'events';

enum Events {
  USER_REGISTRATION = 'UserRegistered',
  PASSWORD_RESET = 'UserPasswordReset',
  CONFIRMATION_EMAIL = 'ConfirmationEmail',
}
const eventEmitter = new EventEmitter();

export { eventEmitter, Events };
