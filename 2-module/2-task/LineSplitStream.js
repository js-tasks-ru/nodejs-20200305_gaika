const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.buffer = '';
  }

  _transform(chunk, encoding, callback) {
    const splitted = chunk.toString();
    let i = 0;

    while (i < splitted.length) {
      if (splitted[i] === os.EOL) {
        if (this.buffer.length > 0) {
          this.push(this.buffer);
          this.buffer = '';
        }
      } else {
        this.buffer += splitted[i];
      }
      i += 1;
    }
    callback();
  }

  _flush(callback) {
    if (this.buffer.length > 0) {
      callback(null, this.buffer);
    }
  }
}

module.exports = LineSplitStream;
