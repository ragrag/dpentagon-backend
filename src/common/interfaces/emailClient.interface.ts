export default interface EmailClient {
  sendWelcomeEmail: (receiverEmail: string) => void;
  sendPasswordResetLink: (receiverEmail: string, token: string) => void;
  sendEmailConfirmation: (receiverEmail: string, token: string) => void;
}
