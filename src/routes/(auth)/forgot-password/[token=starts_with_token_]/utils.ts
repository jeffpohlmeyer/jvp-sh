import * as v from 'valibot';

export const schema = v.pipe(
  v.object({
    password: v.pipe(
      v.string('Password must be a string.'),
      v.nonEmpty('Password is required.'),
      v.minLength(8, 'Password must be at least 8 characters.')
    ),
    confirm_password: v.pipe(
      v.string('Password must be a string.'),
      v.nonEmpty('Password is required.'),
      v.minLength(8, 'Password must be at least 8 characters.')
    )
  }),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  v.forward(
    v.partialCheck(
      [['password'], ['confirm_password']],
      (obj) => obj.password === obj.confirm_password,
      'Passwords must match.'
    ),
    ['confirm_password']
  )
);
