import nixt from 'nixt';
import fs from 'fs';
import path from 'path';
import * as plugiator from 'plugiator';

function existsSync(filePath){
  try{
    fs.statSync(filePath);
  }catch(err){
    if(err.code == 'ENOENT') return false;
  }
  return true;
};

const anotherPlugin = path.resolve(__dirname, 'fixtures', 'another-plugin');
const simplePlugin = path.resolve(__dirname, 'fixtures', 'simple-plugin');

describe('Topmark CLI', () => {
  it('displays help', done => {
    nixt()
    .expect((result) => {
      if(result.stdout.trim().indexOf('Usage: topm') < 0){
        return new Error('No help returned.')
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
  it('should output report file', function(done) {
    this.timeout(50000);
    let outputFile = './test/fixtures/results-log.json';
    try {
      fs.unlinkSync(outputFile);
    } catch(e) {}
    nixt()
    .expect((result) => {
      existsSync(outputFile).should.be.true;
    })
    .run(`topm --plugins ${anotherPlugin} --output ${outputFile}`)
    .end(done);
  });
  it('should append report file', function(done) {
    this.timeout(50000);
    let outputFile = './test/fixtures/results-log.json';
    let reportLength = 0;
    try {
      fs.accessSync(path.resolve(outputFile), fs.F_OK);
      let readData = JSON.parse(fs.readFileSync(path.resolve(outputFile),'utf8'));
      reportLength = readData.length;
    } catch(e) {}
    nixt()
    .expect((result) => {
      fs.accessSync(path.resolve(outputFile), fs.F_OK);
      let readData = JSON.parse(fs.readFileSync(path.resolve(outputFile),'utf8'));
      readData.length.should.equal(reportLength + 1);
    })
    .run(`topm --append-output --plugins ${anotherPlugin} --output ${outputFile}`)
    .end(done);
  });
  it('should include id when provided', function(done) {
    this.timeout(50000);
    const id = 'doop';
    nixt()
    .expect((result) => {
      JSON.parse(result.stdout)[0].id.should.equal(id);
    })
    .run(`topm --append-output --plugins ${simplePlugin} --id ${id}`)
    .end(done);
  });
});
