var nixt = require('nixt');

describe('basic output', function() {
  it('displays output', function(done) {
    nixt()
    .run('topl --help')
    .end(done);
  });
  it('displays current version', function(done) {
    nixt()
    .run('topl -V')
    .stdout(require('../package.json').version)
    .end(done);
  });
});
