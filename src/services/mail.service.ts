import { Service } from 'typedi';
import MailGunClient from '../common/clients/mailGun.client';
import EmailClient from '../common/interfaces/emailClient.interface';
import { eventEmitter, Events } from '../common/utils/eventEmitter';
import { logger } from '../common/utils/logger';

@Service()
class EmailService {
  constructor(private emailClient: MailGunClient) {
    if (process.env.NODE_ENV !== 'testing') this.initializeEventListeners();
  }

  private initializeEventListeners(): void {
    eventEmitter.on(Events.USER_REGISTRATION, ({ email, token }) => {
      setImmediate(() => {
        try {
          // this.emailClient.sendWelcomeEmail(email);
          this.emailClient.sendEmailConfirmation(email, token);
        } catch (err) {
          console.log(err);
        }
      });
    });

    eventEmitter.on(Events.PASSWORD_RESET, ({ email, token }) => {
      setImmediate(() => {
        try {
          this.emailClient.sendPasswordResetLink(email, token);
        } catch (err) {
          console.log(err);
        }
      });
    });

    eventEmitter.on(Events.CONFIRMATION_EMAIL, ({ email, token }) => {
      setImmediate(() => {
        try {
          this.emailClient.sendEmailConfirmation(email, token);
        } catch (err) {
          console.log(err);
        }
      });
    });
  }
}

export default EmailService;
