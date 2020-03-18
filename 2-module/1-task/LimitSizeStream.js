const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.content = 0;
    this.limit = options.limit;
  }

  _transform(chunk, encoding, callback) {
    if (this.content + chunk.length <= this.limit) {
      callback(null, chunk);
      this.content += chunk.length;
    } else {
      callback(new LimitExceededError('Limit exceeded'));
    }
  }
}

module.exports = LimitSizeStream;
