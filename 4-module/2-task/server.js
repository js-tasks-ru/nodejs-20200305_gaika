const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');


const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  if (pathname.indexOf('/') !== -1) {
    res.statusCode = 400;
    res.end('Not supported path');
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      const writeStream = fs.createWriteStream(filepath, {flags: 'wx'});
      const limitStream = new LimitSizeStream({limit: 1e6});


      writeStream.on('error', (err) => {
        if (err.code === 'EEXIST') {
          res.statusCode = 409;
          res.end('File already exists');
          return;
        }
        res.statusCode = 500;
        res.end('Internal error');
      });

      limitStream.on('error', (err) => {
        if (err.code === 'LIMIT_EXCEEDED') {
          res.statusCode = 413;
          res.end(err.message);
          fs.unlink(filepath, () => {});

          return;
        }
        res.statusCode = 500;
        res.end('Internal error');
      });

      req.pipe(limitStream).pipe(writeStream);

      writeStream.on('close', () => {
        res.statusCode = 201;
        res.end('saved');
      });

      req.on('aborted', () => {
        fs.unlink(filepath, () => {});
      });
      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
