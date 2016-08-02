import fs from 'fs';

/**
 *  Public: checks to see if a file exists in sync
 *
 *  * `filePath` a {String} representing the path to the file to check
 *
 *  ## Example
 *
 *    console.log(existsSync('somefile.txt'));
 *    // outputs true if file exists
 *
 *  Returns {Bool}
 */
export default function existsSync(filePath) {
  try {
    fs.statSync(filePath);
  } catch (err) {
    if (err.code === 'ENOENT') return false;
    throw err;
  }
  return true;
}
