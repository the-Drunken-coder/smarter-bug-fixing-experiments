const fs = require('node:fs');
const path = require('node:path');

const fixture = path.join(__dirname, 'fixtures', 'absolute-value');
const workspace = path.join(__dirname, '.work', 'absolute-value');

function resetFixture(hookName) {
  if (hookName === 'beforeEach' || hookName === 'afterEach') {
    fs.rmSync(workspace, { force: true, recursive: true });
    fs.mkdirSync(workspace, { recursive: true });
    fs.writeFileSync(path.join(workspace, '.gitkeep'), '');
    fs.cpSync(fixture, workspace, { recursive: true });
  }
}

module.exports = { resetFixture };
