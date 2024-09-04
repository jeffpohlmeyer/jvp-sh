import * as v from 'valibot';

export const schema = v.object({
  redirect_link: v.pipe(v.string('A URL must be string.'), v.url('The URL is badly formatted.'))
});
