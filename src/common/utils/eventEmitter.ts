import { EventEmitter } from 'events';

enum Events {
  USER_REGISTRATION = 'UserRegistered',
  PASSWORD_FORGET = 'UserPasswordForget',
  EMAIL_CONFIRMATION_REQUEST = 'EmailConfirmationRequest',
}
const eventEmitter = new EventEmitter();

export { eventEmitter, Events };
