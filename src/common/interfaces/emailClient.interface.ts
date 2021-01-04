export default interface EmailClient {
  sendWelcomeEmail: (receiverEmail: string) => void;
  sendPasswordResetLink: (receiverEmail: string, token: string) => void;
  sendEmailConfirmationLink: (receiverEmail: string, token: string) => void;
}
