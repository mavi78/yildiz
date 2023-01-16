const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const oauth_link = "https://developers.google.com/oauthplayground";
const { EMAIL, MAILING_ID, MAILING_REFRES, MAILING_SECRET } = process.env;
const auth = new OAuth2(MAILING_ID, MAILING_SECRET, MAILING_REFRES, oauth_link);

exports.sendVerificationEmail = async (email, name, url) => {
  const stmp = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "yildizbayankuaforu54@gmail.com",
      pass: "vtshjtzntecyefgj",
    },
  });
  const mailOptions = {
    from: EMAIL,
    to: email,
    subject: "Eposta adresinizi doğrulayın",
    html: `<div style="max-width:700px;margin-bottom:1rem;display:flex;align-items:center;gap:10px;font-family:Roboto;font-weight:600;color:#3b5998"><img src="http://localhost:3500/email/logo-1.png" alt="" style="width:30px"/><span>Eylem şartı: Hesabınızı etkinleştirin</span></div><div style="padding:1rem 0;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;color:#141823;font-size:17px;font-family:Roboto"><span>Merhaba ${name}</span><div style="padding:20px 0"><span style="padding:1.5rem 0">Yakın zamanda Yıldız Bayan Kuföründe bir hesap oluşturdunuz. Kaydınızı tamamlamak için lütfen hesabınızı onaylayın.</span></div><a href="${url}" style="width:200px;padding:10px 15px;background:#4c649b;color:#fff;text-decoration:none;font-weight:600">Hesabını Onayla</a><br><div style="padding-top:20px"><span style="margin:1.5rem 0;color:#898f9c">Yıldız Bayan Kuförüne yeniden giriş yaptığınızda, paylaşılan fotoğrafları beğenebilir, yorum yapabilir ve randevu oluşturabilirsiniz.</span></div></div>`,
  };
  stmp.sendMail(mailOptions, (err, res) => {
    if (err) {
      return err;
    }
    return res;
  });
};
