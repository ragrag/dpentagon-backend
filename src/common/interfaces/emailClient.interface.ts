export default interface EmailClient {
  sendWelcomeEmail: (receiverEmail: string) => void;
}
