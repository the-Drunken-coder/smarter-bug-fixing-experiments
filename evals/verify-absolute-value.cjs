const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const fixture = path.join(__dirname, 'fixtures', 'absolute-value');
const workspace = path.join(__dirname, '.work', 'absolute-value');

module.exports = () => {
  const changedTarget = fs.readFileSync(path.join(workspace, 'distance.py'), 'utf8') !== fs.readFileSync(path.join(fixture, 'distance.py'), 'utf8');
  const testUnchanged = fs.readFileSync(path.join(workspace, 'test_distance.py'), 'utf8') === fs.readFileSync(path.join(fixture, 'test_distance.py'), 'utf8');
  const test = spawnSync('python3', ['-m', 'unittest', '-q', 'test_distance.py'], { cwd: workspace, encoding: 'utf8' });
  const passed = changedTarget && testUnchanged && test.status === 0;
  return {
    pass: passed,
    score: passed ? 1 : 0,
    reason: passed ? 'distance.py changed and the unchanged focused test passes' : `changedTarget=${changedTarget}, testUnchanged=${testUnchanged}, testExit=${test.status}`,
  };
};
