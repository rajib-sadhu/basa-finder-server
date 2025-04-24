import nodemailer from "nodemailer";

export const EmailSender = (
  emailSendTo: string,
  emailSubject: string,
  emailText: string
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_ID,
    to: emailSendTo,
    subject: emailSubject,
    text: emailText,
  };

  console.log(mailOptions);

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
