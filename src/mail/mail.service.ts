import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  async sendConfirmationEmail(email: string) {
    const confirmationLink = `http://localhost:3000/auth/confirm?email=${email}`;
    // Aqui seria nodemailer ou outro provider
    console.log(`📩 Send confirmation to ${email}: ${confirmationLink}`);
  }
}
