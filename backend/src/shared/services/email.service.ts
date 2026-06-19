import { logger } from "../../config/logger.ts";
import nodemailer from "nodemailer";
import { env } from "../../config/env.ts";

class EmailService {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  async sendOtp(email: string, otp: string): Promise<void> {
    logger.info(`[EMAIL MOCK] Sending OTP ${otp} to ${email}`);
    const mailOptions = {
      from: `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: "Your FitZone Verification OTP",
      html: this.getOtpTemplate(
        otp,
        "Welcome to FitZone!",
        "Please use the following One-Time password (OTP ) to verify your email address:",
        "#007bff",
      ),
    };
    await this.sendEmail(mailOptions, email, "OTP");
  }
  async sendPasswordResetOtp(email: string, otp: string): Promise<void> {
    logger.info(`[EMAIL MOCK] Sending Password Reset OTP ${otp} to ${email}`);
    const mailOption = {
      from: `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: "Reset Your FitZone password",
      html: this.getOtpTemplate(
        otp,
        "Password Reset Request",
        "We received a request to reset your password. Use the following OTP to proceed:",
        "#dc3545",
      ),
    };
    await this.sendEmail(mailOption, email, "Password Reset OTP");
  }

  private getOtpTemplate(
    otp: string,
    title: string,
    message: string,
    color: string,
  ): string {
    return `
       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
        <h2 style="color: #333; text-align: center;">${title}</h2>
        <p style="color: #555; font-size: 16px; text-align: center;">${message}</p>
        <div style="background-color: #f7f7f7; padding: 15px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: ${color}; margin: 20px 0; border-radius: 5px; border: 1px dashed ${color};">
          ${otp}
        </div>
        <p style="color: #777; font-size: 14px; text-align: center;">This OTP will expire in <strong>10 minutes</strong>.</p>
        <p style="color: #777; font-size: 14px; text-align: center;">If you did not request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999; text-align: center;">&copy; ${new Date().getFullYear()} FitZone. Train Smart. Live Well.</p>
      </div>
      `;
  }
  private async sendEmail(
    mailOptions: nodemailer.SendMailOptions,
    email: string,
    type: string,
  ): Promise<void> {
    try {
      await this.transporter.sendMail(mailOptions);
      logger.info(`✅ ${type} email sent successfully to ${email}`);
    } catch (error: any) {
      logger.error(
        `❌ Failed to send ${type} email to ${email}`,
        error.message,
      );
      throw new Error(
        `Failed to send ${type.toLowerCase()} email. please try again later`,
      );
    }
  }
}
export const emailService = new EmailService();
