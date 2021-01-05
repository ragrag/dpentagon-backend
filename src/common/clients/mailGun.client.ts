import mailgun from 'mailgun-js';
import { Service } from 'typedi';
import EmailClient from '../interfaces/emailClient.interface';
import { logger } from '../utils/logger';

@Service()
class MailGunClient implements EmailClient {
  private mailer: mailgun.Mailgun;

  constructor() {
    this.mailer = mailgun({
      apiKey: process.env.MAILGUN_KEY,
      domain: 'mail.dpentagon.com',
      host: 'api.eu.mailgun.net',
    });
  }

  public sendWelcomeEmail = (receiverEmail: string) => {
    this.mailer.messages().send(
      {
        from: 'Dpentagon <no-reply@mail.dpentagon.com>',
        to: receiverEmail,
        subject: 'Welcome to DPentagon',
        template: 'welcome',
        text: 'Welcome to the app!',
      },
      (error, body) => {
        if (error) logger.error(error);
        else logger.info(`welcome email sent: ${receiverEmail}`);
      },
    );
  };

  public sendPasswordResetLink = (receiverEmail: string, token: string) => {
    this.mailer.messages().send(
      {
        from: 'Dpentagon <no-reply@mail.dpentagon.com>',
        to: receiverEmail,
        subject: 'DPentagon Password Reset',
        // text: `www.dpentagon.com/password/reset/${token}`,
        template: 'password-reset',
        'v:link': `https://www.dpentagon.com/password/reset/${token}`,
      },
      (error, body) => {
        if (error) logger.error(error);
        else logger.info(`password reset link sent: ${receiverEmail}`);
      },
    );
  };
  public sendEmailConfirmation = (receiverEmail: string, token: string) => {
    this.mailer.messages().send(
      {
        from: 'Dpentagon <no-reply@mail.dpentagon.com>',
        to: receiverEmail,
        subject: 'DPentagon Email Confirmation',
        // text: `www.dpentagon.com/email/confirm/${token}`,
        template: 'email-confirmation',
        'v:link': `https://www.dpentagon.com/email/confirm/${token}`,
      },
      (error, body) => {
        if (error) logger.error(error);
        else logger.info(`email confirmation link sent: ${receiverEmail}`);
      },
    );
  };
}

export default MailGunClient;
