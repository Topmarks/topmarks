import nixt from 'nixt';
import TopmarkCLI from '../bin/topmark';

describe('Topmark CLI', () => {
  it('displays help', done => {
    // console.log(TopmarkCLI.helpInformation())
    nixt()
    .expect((result) => {
      TopmarkCLI._name = 'topm';
      if(result.stdout.trim() != TopmarkCLI.helpInformation().trim()){
        return new Error('Help not returning the correct help information');
      }
    })
    .run('topm --help')
    .end(done);
  });
  it('displays current version', done => {
    nixt()
    .run('topm -V')
    .stdout(require('../package.json').version)
    .end(done);
  });
  it('should output file', function(done) {
    this.timeout(50000);
    nixt()
    .expect((result) => {
      console.log(result);
    })
    .run('topm --plugins topmark-loadspeed --output ./test/fixtures/results-log.json')
    .end(done);
  });
});
