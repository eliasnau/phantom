import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import { env } from "../env";
import { VerifyEmail } from "../emails/verify-email";
import logger from "../utils/logger";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(
  userEmail: string,
  verificationToken: string
) {
  try {
    const verificationUrl = `${env.FORNTEND_APP_URL}/verify-email?token=${verificationToken}`;

    const emailHtml = await render(
      VerifyEmail({
        userEmail,
        verificationUrl,
      })
    );

    const info = await transporter.sendMail({
      from: `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_EMAIL}>`,
      to: userEmail,
      subject: "Verify your email address",
      html: emailHtml,
    });

    logger.info("Verification email sent successfully to: ", userEmail);
    return info;
  } catch (error) {
    logger.error("Error sending verification email:", error);
    throw error;
  }
}
