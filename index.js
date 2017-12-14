/*!
 * Koa mailer
 * xiewulong <xiewulong@vip.qq.com>
 * create: 2017/12/13
 * since: 0.0.1
 */
'use strict';

const nodemailer = require('nodemailer');

module.exports = (options) => {
  let transporter;
  if(!options.test) {
    transporter = nodemailer.createTransport(options);
  }

  let default_data = {};
  if(options.from) {
    default_data.from = options.from;
  }

  return async (ctx, next) => {
    if(!transporter && options.test) {
      let test_account = await new Promise((resolve, reject) => {
        nodemailer.createTestAccount((err, account) => err ? reject(err) : resolve(account));
      });
      options.host = test_account.smtp.host;
      options.port = test_account.smtp.port;
      options.secure = test_account.smtp.secure;
      options.auth = {
        user: test_account.user,
        pass: test_account.pass,
      };

      transporter = nodemailer.createTransport(options);
    }

    ctx.mailer = (data, callback) => transporter.sendMail(Object.assign(default_data, data), (error, info) => callback(error, info, nodemailer));

    await next();
  };
};
