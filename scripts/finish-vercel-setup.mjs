// Finishes the production setup: points Vercel's DATABASE_URL at the
// hosted Postgres database (read from local .env) and redeploys the site.
// Run:  node scripts/finish-vercel-setup.mjs
import { readFileSync } from 'fs';
import { spawnSync } from 'child_process';

const env = readFileSync(new URL('../.env', import.meta.url), 'utf8');
const m = env.match(/^DATABASE_URL="([^"]+)"/m);
if (!m || !m[1].startsWith('postgres')) {
  console.error('Could not find a postgres DATABASE_URL in .env — aborting.');
  process.exit(1);
}
const url = m[1];

function run(args, input) {
  console.log(`\n> vercel ${args.join(' ')}`);
  const r = spawnSync('npx', ['vercel', ...args], {
    input,
    stdio: [input ? 'pipe' : 'inherit', 'inherit', 'inherit'],
    shell: true,
  });
  if (r.status !== 0) console.error(`(command exited with ${r.status})`);
  return r.status;
}

console.log('Setting DATABASE_URL on Vercel (production + preview)...');
run(['env', 'add', 'DATABASE_URL', 'production', '--force'], url);
run(['env', 'add', 'DATABASE_URL', 'preview', '--force'], url);

console.log('\nDeploying to production with the new database...');
run(['--prod', '--yes']);

console.log('\nAll done. Check https://www.rentinalvin.com/dev/analytics');
