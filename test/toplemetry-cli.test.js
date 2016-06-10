import nixt from 'nixt';

describe('Toplemetry CLI', () => {
  it('displays output', done => {
    nixt()
    .run('topl --help')
    .end(done);
  });
  it('displays current version', done => {
    nixt()
    .run('topl -V')
    .stdout(require('../package.json').version)
    .end(done);
  });
});
