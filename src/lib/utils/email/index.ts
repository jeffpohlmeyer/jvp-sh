import nodemailer, { type TransportOptions } from 'nodemailer';
import mg from 'nodemailer-mailgun-transport';

import { dev } from '$app/environment';
import {
  EMAIL_HOST,
  EMAIL_PORT,
  MAILGUN_API_KEY,
  MAILGUN_DOMAIN,
  NOREPLY_EMAIL
} from '$env/static/private';

export type EmailHtmlType = {
  title: string;
  style?: string;
  body: string;
};

export type EmailDataType = {
  to: string;
  subject: string;
  text?: string;
  user?: string;
  from?: string;
  html: EmailHtmlType;
  replyTo?: string;
};

export async function send_mail(payload: EmailDataType) {
  const { to, subject, text, html: _html, replyTo } = payload;
  const from = `jvp.sh <${NOREPLY_EMAIL}>`;
  const { title, style, body } = _html;
  const html = `<!doctype html>
        <html lang="en">
          <head>
            <title>${title}</title>
            <style>
              ${style ?? ''}
              body {font-family: sans-serif;}
            </style>
          </head>
          <body>
            ${body}
          </body>
        </html>
      `;

  const config = {
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: false
  } as TransportOptions;

  const auth = {
    auth: {
      api_key: MAILGUN_API_KEY,
      domain: MAILGUN_DOMAIN
    }
  };

  let transportArgument;
  if (dev) {
    transportArgument = config;
  } else {
    transportArgument = mg(auth);
    // transportArgument = config;
  }

  const transporter = nodemailer.createTransport(transportArgument);
  if (dev) {
    try {
      await transporter.sendMail({ from, to, subject, text, html, replyTo });
    } catch (err) {
      console.log('err', err);
      console.log('Sending mail failed. Here is the text content of the message.');
      console.log(text ?? html);
    }
  } else {
    await transporter.sendMail({ from, to, subject, text, html, replyTo });
  }
}
