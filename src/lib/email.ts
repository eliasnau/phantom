import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT ?? "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

const emailTemplates = {
    verifyEmail: (url: string) => ({
        subject: "Verify your email address",
        text: `Click this link to verify your email: ${url}`,
        html: `
            <!DOCTYPE html>
            <html>
                <body style="font-family: Arial, sans-serif; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 10px;">
                        <h1 style="color: #333; text-align: center;">Verify Your Email</h1>
                        <p style="color: #666; text-align: center;">Please verify your email address by clicking the button below:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${url}" 
                               style="background: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                                Verify Email
                            </a>
                        </div>
                        <p style="color: #999; font-size: 12px; text-align: center;">
                            If you didn't request this email, you can safely ignore it.
                        </p>
                    </div>
                </body>
            </html>
        `
    }),

    resetPassword: (url: string) => ({
        subject: "Reset your password",
        text: `Click this link to reset your password: ${url}`,
        html: `
            <!DOCTYPE html>
            <html>
                <body style="font-family: Arial, sans-serif; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 10px;">
                        <h1 style="color: #333; text-align: center;">Reset Your Password</h1>
                        <p style="color: #666; text-align: center;">Click the button below to reset your password:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${url}" 
                               style="background: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                                Reset Password
                            </a>
                        </div>
                        <p style="color: #999; font-size: 12px; text-align: center;">
                            If you didn't request this email, you can safely ignore it.
                        </p>
                    </div>
                </body>
            </html>
        `
    })
};

export const sendEmail = async ({
    to,
    subject,
    text,
    html
}: {
    to: string;
    subject: string;
    text: string;
    html?: string;
}) => {
    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject,
        text,
        html,
    });
};

export { emailTemplates };