import { new_id, prefixes } from './src/lib/utils/id';

function generate_id(flag: string, args: string[]) {
  const k_flag = args.indexOf(flag);
  if (k_flag > -1) {
    const prefix = args[k_flag + 1];
    if (!Object.keys(prefixes).includes(prefix)) {
      console.error('Invalid prefix!');
      process.exit(1);
    }
    const id = new_id(prefix as keyof typeof prefixes);
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
