import sgMail from "@sendgrid/mail";

export const send = (
  templateId: string,
  to: string,
  dynamicTemplateData?: any
) => {
  sgMail.setApiKey(process.env.SENDGRID_KEY!);
  return sgMail.send({
    from: "Tazaker <info@tazaker.org>",
    templateId,
    personalizations: [{ to, dynamicTemplateData }],
  });
};
