import nixt from 'nixt';

describe('Topmark CLI', () => {
  it('displays output', done => {
    nixt()
    .run('topm --help')
    .end(done);
  });
  it('displays current version', done => {
    nixt()
    .run('topm -V')
    .stdout(require('../package.json').version)
    .end(done);
  });
});
