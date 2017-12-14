# Koa 2 mailer

Koa 2 邮件管理

## 目录

<details>

* [安装](#install)
* [使用](#useage)
* [更多](#more)
* [License](#license)

</details>

## Install

安装

```bash
$ npm i [-S] koa-mailer-v2
```

## Useage

配置中间件

```js
const Koa = require('koa');
const mailer = require('koa-mailer-v2');

const app = new Koa();
app.use(mailer({
  from: 'mail_from@domain.com',   // Define mail from address
  host: 'localhost',              // Smtp host, default: localhost
  port: 587,                      // Smtp port, default: 587
  secure: false,                  // Smtp secure, default: false
  auth: {
    type: 'login',                // Auth type, default: login
    user: 'username',             // Username
    pass: 'password',             // Password
  },
  logger: false,                  // Log, default: false
  debug: false,                   // Debug, default: false
  test: false,                    // Auto create test account by nodemailer.createTestAccount, default: false
}));

// ...
```

发送邮件

```js
// ...
app.use(async(ctx, next) => {
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
});
// ...
```

## More

本项目基于[nodemailer](https://github.com/nodemailer/nodemailer)封装, 更多文档细节请参考[nodemailer](https://nodemailer.com)

## License

MIT - [xiewulong](https://github.com/xiewulong)
