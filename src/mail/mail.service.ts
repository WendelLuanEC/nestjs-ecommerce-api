import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT || '25', 10),
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendConfirmationEmail(email: string, token: string) {
    const confirmUrl = `http://localhost:3000/auth/confirm?token=${token}`;

    await this.transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: 'Confirme sua conta',
      html: `<p>Clique aqui para confirmar sua conta:</p>
             <a href="${confirmUrl}">${confirmUrl}</a>`,
    });
  }
}
