import { test, expect } from '@playwright/test';

test('registration', async ({ page }) => {
  await page.goto('http://localhost:5173/register');

  const email = page.getByTestId('email');
  await email.fill('a@b.co');
  const password = page.getByTestId('password');
  await password.fill('123456');
  const password2 = page.getByTestId('confirm_password');
  await password2.fill('123456');
  const submit = page.getByTestId('submit');
  await submit.click();

  expect(page.url()).toBe('http://localhost:5173/register');
});
