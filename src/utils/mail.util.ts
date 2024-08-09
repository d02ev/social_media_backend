import { createTransport, SentMessageInfo, Transporter } from 'nodemailer';

export class MailUtil {
	private readonly _email_transporter: Transporter<SentMessageInfo>;

  constructor() {
    this._email_transporter = createTransport({
			host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT!) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
		});
  }

  sendVerificationMail = async (receiverEmailAddr: string, verificationLink: string): Promise<void> => {
    await this._email_transporter.sendMail({
      from: 'admin@facegramapp.com',
      to: receiverEmailAddr,
      subject: 'Please verify your email address',
      html: `Click <a href="${verificationLink}">here</a> to verify your email address.`,
    });
  };
}
