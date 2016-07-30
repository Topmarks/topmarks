/* eslint-disable func-names */
import nixt from 'nixt';
import fs from 'fs';
import path from 'path';
import existsSync from '../src/lib/exists-sync';

const anotherPlugin = path.resolve(__dirname, 'fixtures', 'another-plugin');
const simplePlugin = path.resolve(__dirname, 'fixtures', 'simple-plugin');

describe('Topmark CLI', () => {
  it('displays help', done => {
    nixt()
    .expect((result) => {
      if (result.stdout.trim().indexOf('Usage: topm') < 0) {
        return new Error('No help returned.');
      }
      return false;
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
  it('should output report file', function (done) {
    this.timeout(50000);
    const outputFile = './test/fixtures/results-log.json';
    try {
      fs.unlinkSync(outputFile);
    } catch (e) {
      // do nothing
    }
    nixt()
    .expect(() => {
      existsSync(outputFile).should.equal(true);
    })
    .run(`topm --plugins ${anotherPlugin} --output ${outputFile}`)
    .end(done);
  });
  it('should append report file', function (done) {
    this.timeout(50000);
    const outputFile = './test/fixtures/results-log.json';
    let reportLength = 0;
    if (existsSync(path.resolve(outputFile))) {
      const readData = JSON.parse(fs.readFileSync(path.resolve(outputFile), 'utf8'));
      reportLength = readData.length;
    }
    nixt()
    .expect(() => {
      const readData = JSON.parse(fs.readFileSync(path.resolve(outputFile), 'utf8'));
      readData.length.should.equal(reportLength + 1);
    })
    .run(`topm --append-output --plugins ${anotherPlugin} --output ${outputFile}`)
    .end(done);
  });
  it('should include id when provided', function (done) {
    this.timeout(50000);
    const options = { default: { pageId: 'doop' } };
    const optionsString = JSON.stringify(options);
    nixt()
    .expect((result) => {
      JSON.parse(result.stdout)[0].pageId.should.equal(options.default.pageId);
    })
    .run(`topm --plugins ${simplePlugin} --parameters '${optionsString}'`)
    .end(done);
  });
});
