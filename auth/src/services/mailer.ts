import sgMail from "@sendgrid/mail";

interface Payload {
  email: string;
  code: string;
}

const baseURL = {
  development: "http://tazaker.dev",
  production: "https://www.tazaker.org",
}[process.env.ENVIRONMENT!];

const templateId = "d-9e1523620a424dd7825a77ded3e1b39a";

export const send = ({ email, code }: Payload) => {
  sgMail.setApiKey(process.env.SENDGRID_KEY!);
  return sgMail.send({
    from: "Tazaker <info@tazaker.org>",
    templateId,
    personalizations: [
      {
        to: email,
        dynamicTemplateData: {
          url: `${baseURL}/api/auth/complete?email=${email}&code=${code}`,
        },
      },
    ],
  });
};
