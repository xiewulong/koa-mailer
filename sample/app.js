/*!
 * App
 * xiewulong <xiewulong@vip.qq.com>
 * create: 2017/12/13
 * since: 0.0.1
 */
'use strict';

const Koa = require('koa');
const mailer = require('../');

const app = module.exports = new Koa();
const development = app.env === 'development';
const production = app.env === 'production';

app.keys = ['APP COOKIE SECRET KEY'];
app
  .use(mailer({
    from: 'mail_from@domain.com',
    host: 'localhost',
    port: 587,
    secure: false,
    auth: {
      type: 'login',
      user: 'username',
      pass: 'password',
    },
    logger: development,
    debug: development,
    test: development,
  }))
  .use(async(ctx, next) => {
    let url = await new Promise((resolve, reject) => {
      ctx.mailer({
        to: 'mail_to@domain.com',
        subject: 'Test mail',
        text: 'It\'s just a test mail!',
        html: '<p>It\'s just a test mail!</p>',
      }, (error, info, nodemailer) => {
        if (error) {
          console.log(error);

          return reject(error);
        }

        let test_message_url = nodemailer.getTestMessageUrl(info);
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', test_message_url);
        resolve(test_message_url);
      });
    });

    ctx.body = `<a href="${url}" target="_blank">Test message</a>`;
  })
  .use(async (ctx) => {
    ctx.status = 404;

    let text = 'Page Not Found';
    switch(ctx.accepts('html', 'json')) {
      case 'html':
        ctx.type = 'html';
        ctx.body = `<p>${text}</p>`;
        break;
      case 'json':
        ctx.body = {message: text};
        break;
      default:
        ctx.type = 'text';
        ctx.body = text;
    }
  })
  ;

!module.parent && app.listen(3000);
