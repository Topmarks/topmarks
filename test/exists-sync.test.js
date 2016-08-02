/* eslint-disable func-names */
import existsSync from '../src/lib/exists-sync';
import path from 'path';

describe('existsSync', () => {
  it('should return true if file exists', () => {
    const filePath = path.resolve(__dirname, 'fixtures', 'another-plugin', 'package.json');
    existsSync(filePath).should.equal(true);
  });
  it('should return false if file does not exist', () => {
    const filePath = path.resolve(__dirname, 'pooper-scooper.js');
    existsSync(filePath).should.equal(false);
  });
  it('should throw error if error other than ENOENT', () => {
    const dumbObject = { object: true };
    (() => { existsSync(dumbObject); }).should.throw('path must be a string or Buffer');
  });
});
