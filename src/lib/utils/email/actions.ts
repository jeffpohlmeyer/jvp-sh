import { BASE_URL } from '$env/static/private';
import { send_mail } from '$lib/utils/email';

export function tell_user_password_has_changed(email: string) {
  send_mail({
    to: email,
    subject: 'Password Changed',
    text: `Your password has been changed at https://jvp.sh. If you did not intend on doing this please reset your password immediately.`,
    html: {
      title: 'Password Changed',
      body: `
            <h1>Password Changed</h1>
					  <p>Your password has been changed at <a href="${BASE_URL}">${BASE_URL}</a>.</p>
					  <p>If you did not intend on doing this please <a href="${BASE_URL}/forgot-password" target="_blank">reset your password</a> immediately.</p>
					  <p>If the link does not work please copy and paste this link into the browser: ${BASE_URL}/forgot-password</p>
					  <p>Thanks,</p>
					  <p>The team at jvp.sh</p>
          `
    }
  });
}

type SendEmailWithTokenPayloadType = {
  token: string;
  email: string;
};

export function send_reset_password_email({ token, email }: SendEmailWithTokenPayloadType) {
  const url = `${BASE_URL}/forgot-password/${token}`;
  send_mail({
    to: email,
    subject: 'Reset your password',
    text: `A request to reset your password has been sent from ${BASE_URL}. Please visit ${url} to reset your password.`,
    html: {
      title: 'Reset your password',
      body: `
				 <h1>Reset Password</h1>
         <p>A request has been made to reset the password for your account at <a href="${BASE_URL}">${BASE_URL}</a> using this email address.</p>
         <p>Please follow <a href="${url}">this link</a> to reset your password.</p>
         <p>If the link does not work please copy and paste this link into the browser: ${url}</p>
         <p>Thanks,</p>
         <p>The team at jvp.sh</p>
        `
    }
  });
}

export function send_activate_account_email({ token, email }: SendEmailWithTokenPayloadType) {
  const url = `${BASE_URL}/register/confirm/${token}`;

  send_mail({
    to: email,
    subject: 'Activate your account',
    text: `Click the link to activate your account: ${url}`,
    html: {
      title: 'Activate your account',
      body: `
          <h1>New Account</h1>
          <p>A new account has been created at <a href="${BASE_URL}">${BASE_URL}</a> using this email address.</p>
          <p>Please follow <a href="${url}">this link</a> to complete the registration process.</p>
          <p>If the link does not work please copy and paste this link into the browser: ${url}</p>
          <p>Thanks,</p>
          <p>The team at jvp.sh</p>
        `
    }
  });
}
