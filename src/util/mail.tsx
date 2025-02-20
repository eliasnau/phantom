import { sendEmail } from "@/lib/email";
import MyTemplate from "@/mail/example";
import { render } from "@react-email/render";

export const sendPasswordResetMail = async (email: string) => {
  const html = await render(<MyTemplate />, {
    pretty: true,
  });

  await sendEmail({
    to: email,
    subject: "Password Reset",
    text: "",
    html,
  });
};
