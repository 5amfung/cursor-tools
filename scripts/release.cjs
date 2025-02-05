/* eslint-env node */
const { execSync } = require('child_process');
const { readFileSync } = require('fs');
const { resolve } = require('path');

function run(command) {
  console.log(`> ${command}`);
  execSync(command, { stdio: 'inherit' });
}

function getVersion() {
  const packageJson = JSON.parse(readFileSync(resolve(__dirname, '../package.json')));
  return packageJson.version;
}

function hasGitChanges() {
  try {
    execSync('git diff --staged --quiet', { stdio: 'ignore' });
    return false;
  } catch {
    return true;
  }
}

try {
  // Run lint and build
  run('npm run lint');
  run('npm run build');

  // Get version from package.json
  const version = getVersion();

  // Stage all changes
  run('git add .');

  // Only commit if there are staged changes
  if (hasGitChanges()) {
    run(`git commit -m "release: v${version}"`);
  }

  // Publish to npm
  run('npm publish');

  // Push to GitHub
  run('git push');

  console.log(`\n✨ Successfully released v${version}`);
} catch (error) {
  console.error('\n🚨 Release failed:', error.message);
  process.exit(1);
} 
