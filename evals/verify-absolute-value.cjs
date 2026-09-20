const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const fixture = path.join(__dirname, 'fixtures', 'absolute-value');
const workspace = path.join(__dirname, '.work', 'absolute-value');
const ignoredNames = new Set(['.gitkeep', '__pycache__']);

function filesBelow(root, directory = '') {
  const files = new Map();
  for (const entry of fs.readdirSync(path.join(root, directory), { withFileTypes: true })) {
    if (ignoredNames.has(entry.name)) continue;
    const relativePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      for (const [name, contents] of filesBelow(root, relativePath)) files.set(name, contents);
    } else {
      files.set(relativePath, fs.readFileSync(path.join(root, relativePath)));
    }
  }
  return files;
}

function changedLineCount(before, after) {
  const oldLines = before.split('\n');
  const newLines = after.split('\n');
  let prefix = 0;
  while (prefix < oldLines.length && prefix < newLines.length && oldLines[prefix] === newLines[prefix]) prefix += 1;
  let suffix = 0;
  while (suffix < oldLines.length - prefix && suffix < newLines.length - prefix && oldLines.at(-suffix - 1) === newLines.at(-suffix - 1)) suffix += 1;
  return oldLines.length + newLines.length - (2 * prefix) - (2 * suffix);
}

module.exports = () => {
  const baseline = filesBelow(fixture);
  const candidate = filesBelow(workspace);
  const allPaths = new Set([...baseline.keys(), ...candidate.keys()]);
  const changedPaths = [...allPaths].filter((name) => {
    const beforeFile = baseline.get(name);
    const afterFile = candidate.get(name);
    return !beforeFile || !afterFile || !beforeFile.equals(afterFile);
  }).sort();
  const before = baseline.get('distance.py').toString('utf8');
  const after = candidate.get('distance.py')?.toString('utf8') ?? '';
  const changedLines = changedLineCount(before, after);
  const withinBudget = changedLines <= 4 && Buffer.byteLength(after) <= 256;
  const test = spawnSync('python3', ['-B', '-m', 'unittest', '-q', 'test_distance.py'], {
    cwd: workspace,
    encoding: 'utf8',
    timeout: 10_000,
  });
  const testPassed = !test.error && test.signal === null && test.status === 0;
  const passed = changedPaths.length === 1 && changedPaths[0] === 'distance.py' && withinBudget && testPassed;
  return {
    pass: passed,
    score: passed ? 1 : 0,
    reason: passed ? 'only distance.py changed within budget and the focused test passes' : `changedPaths=${changedPaths.join(',')}, changedLines=${changedLines}, testExit=${test.status}, testSignal=${test.signal}, testError=${test.error?.message ?? 'none'}`,
  };
};
