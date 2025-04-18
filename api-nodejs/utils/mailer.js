var nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "89812a3bd6266f",
      pass: "aae238a11297e2",
    },
  });

module.exports = {
    send: async function(to, url){
        await transporter.sendMail({
            from: "Badminton Store Website", // sender address
            to: to, // list of receivers
            subject: "RESET PASSWORD", // Subject line
            html: "<a href="+ url +">Reset Password</a>" // html body
          });
    }
}