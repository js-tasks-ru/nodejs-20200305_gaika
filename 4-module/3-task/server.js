const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);
  if (pathname.indexOf('/') !== -1) {
    res.statusCode = 400;
    res.end('Not supported path');
    return;
  }

  switch (req.method) {
    case 'DELETE':
      fs.unlink(filepath, (err) => {
        if (err) {
          if (err.code === 'ENOENT') {
            res.statusCode = 404;
            res.end('File not found');
            return;
          }
          res.statusCode = 500;
          res.end('Internal error');
          return;
        }
        res.statusCode = 200;
        res.end('Success removed');
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
