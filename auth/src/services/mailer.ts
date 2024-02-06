import nodemailer from "nodemailer";

interface Payload {
  email: string;
  code: string;
}

const baseURL = {
  development: "http://tazaker.dev",
  production: "https://www.tazaker.org",
}[process.env.ENVIRONMENT!];

export const send = async ({ email, code }: Payload) => {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });

  const info = await transporter.sendMail({
    from: '"Tazaker" <info@tazaker.org>',
    to: email,
    subject: "Tazaker Sign In",
    html: `<a href="${baseURL}/api/auth/complete?email=${email}&code=${code}">Complete sign in</a>`,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};
