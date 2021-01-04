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
      domain: 'mail.algomoon.com',
    });
  }

  public sendWelcomeEmail = (receiverEmail: string) => {
    this.mailer.messages().send(
      {
        from: 'Algomoon <no-reply@mail.algomoon.com>',
        to: receiverEmail,
        subject: 'Welcome to Algomoon',
        template: 'welcome',
        text: 'Welcome to the app!',
      },
      (error, body) => {
        if (error) logger.error(error);
      },
    );
  };

  public sendPasswordResetLink = (receiverEmail: string, token: string) => {
    this.mailer.messages().send(
      {
        from: 'Algomoon <no-reply@mail.algomoon.com>',
        to: receiverEmail,
        subject: 'DPentagon Password Reset',
        text: `www.dpentagon.com/password/reset/${token}`,
        // template: 'password-reset',
        // 'v:link': `www.dpentagon.com/password/reset/${token}`,
      },
      (error, body) => {
        if (error) logger.error(error);
      },
    );
  };
  public sendEmailConfirmation = (receiverEmail: string, token: string) => {
    this.mailer.messages().send(
      {
        from: 'Algomoon <no-reply@mail.algomoon.com>',
        to: receiverEmail,
        subject: 'DPentagon Email Confirmation',
        text: `www.dpentagon.com/email/confirm/${token}`,
        // template: 'email-confirmation',
        // 'v:link': `www.dpentagon.com/email/confirm/${token}`,
      },
      (error, body) => {
        if (error) logger.error(error);
      },
    );
  };
}

export default MailGunClient;
