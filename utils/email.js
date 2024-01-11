const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

module.exports = class {
  constructor(user, url) {
    this.to = user.email;
    this.username = user.username;
    this.url = url;
  }

  newTransport() {
    const params = {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    };
    return nodemailer.createTransport(params);
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      subject,
      username: this.username,
      url: this.url,
    });
    const text = htmlToText(html);
    const emailOptions = {
      from: 'AniPortal',
      to: this.to,
      subject,
      html,
      text,
    };

    await this.newTransport().sendMail(emailOptions);
  }

  async sendEmailConfirmLink() {
    await this.send('emailConfirm', 'Please, confirm your email...');
  }

  async frozenAccount() {
    await this.send('security', 'Security alert!');
  }

  async sendPasswordResetLink() {
    await this.send('passwordReset', 'Password reset link');
  }
};
