import { Service } from 'typedi';
import MailGunClient from '../common/clients/mailGun.client';
import EmailClient from '../common/interfaces/emailClient.interface';
import { eventEmitter, Events } from '../common/utils/eventEmitter';
import { logger } from '../common/utils/logger';

@Service()
class EmailService {
  constructor(private emailClient: MailGunClient) {
    this.initializeEventListeners();
  }

  private initializeEventListeners(): void {
    eventEmitter.on(Events.USER_REGISTRATION, ({ email }) => {
      setImmediate(() => {
        try {
          this.emailClient.sendWelcomeEmail(email);
          logger.info(`Welcome Email sent to ${email}`);
        } catch (err) {
          console.log(err);
        }
      });
    });

    eventEmitter.on(Events.PASSWORD_FORGET, ({ email, token }) => {
      setImmediate(() => {
        try {
          this.emailClient.sendPasswordResetLink(email, token);
          logger.info(`password reset link sent: ${email}`);
        } catch (err) {
          console.log(err);
        }
      });
    });

    eventEmitter.on(Events.EMAIL_CONFIRMATION_REQUEST, ({ email, token }) => {
      setImmediate(() => {
        try {
          this.emailClient.sendEmailConfirmationLink(email, token);
          logger.info(`password reset link sent: ${email}`);
        } catch (err) {
          console.log(err);
        }
      });
    });
  }
}

export default EmailService;
