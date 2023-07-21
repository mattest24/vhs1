const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, req.url);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end('Not found');
    } else {
      res.end(data);
    }
  });
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});