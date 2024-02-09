import sgMail from "@sendgrid/mail";

interface Payload {
  email: string;
  code: string;
}

const baseURL = {
  development: "http://tazaker.dev",
  production: "https://www.tazaker.org",
}[process.env.ENVIRONMENT!];

export const send = ({ email, code }: Payload) => {
  sgMail.setApiKey(process.env.SENDGRID_KEY!);
  return sgMail.send({
    to: email,
    from: "Tazaker <admin@tazaker.org>",
    subject: "Tazaker Sign In",
    html: `<a href="${baseURL}/api/auth/complete?email=${email}&code=${code}">Complete sign in</a>`,
  });
};
