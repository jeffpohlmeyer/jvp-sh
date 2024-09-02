import * as v from 'valibot';

export const schema = v.pipe(
  v.object({
    current_password: v.pipe(
      v.string('Current Password must be a string.'),
      v.nonEmpty('Current Password is required.'),
      v.minLength(8, 'Current Password must be at least 8 characters.')
    ),
    new_password: v.pipe(
      v.string('New Password must be a string.'),
      v.nonEmpty('New Password is required.'),
      v.minLength(8, 'New Password must be at least 8 characters.')
    ),
    confirm_password: v.pipe(
      v.string('Confirm Password must be a string.'),
      v.nonEmpty('Confirm Password is required.'),
      v.minLength(8, 'Confirm Password must be at least 8 characters.')
    )
  }),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  v.forward(
    v.partialCheck(
      [['new_password'], ['confirm_password']],
      (obj) => obj.new_password === obj.confirm_password,
      'Passwords must match.'
    ),
    ['confirm_password']
  )
);
