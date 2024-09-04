import { customAlphabet } from 'nanoid';
export const nanoid = customAlphabet('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz');

export const prefixes = {
  session: 'session',
  token: 'token',
  user: 'user',
  url: 'url'
};

export function new_id(prefix, length = 16) {
  return [prefixes[prefix], nanoid(length)].join('_');
}

function generate_id(flag, args) {
  const k_flag = args.indexOf(flag);
  if (k_flag > -1) {
    const prefix = args[k_flag + 1];
    if (!Object.keys(prefixes).includes(prefix)) {
      console.error('Invalid prefix!');
      process.exit(1);
    }
    const id = new_id(prefix);
    console.log(`Generated ID with prefix "${prefix}"`);
    console.log(id);
    process.exit(0);
  }
}
function main() {
  console.log('process.argv', process.argv);
  if (process.argv.length < 3) {
    console.error('Expected at least one argument!');
    process.exit(1);
  }
  generate_id('-k', process.argv);
  generate_id('--key', process.argv);
}

main();
