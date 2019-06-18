var chalk = require('chalk');
var path = require('path');
var http = require('http');
var fs = require('fs');

const PORT = 3000;

function handleRequest(req, res) {
  console.log(`Recieved Request for ${req.url}`);
  if(req.url === "/") {
    // Index 
    fs.readFile('public/index.html', (err, data) => {
      if(err) {
        return sendIndexPage(res);
      }
      res.statusCode = 200;
      res.end(data);
    }); 
  } else {
    // Static files
    fs.readFile(path.join('public', req.url), (err, data) => {
      if(err) {
        console.log(chalk.red(`${req.url} not found on the server`));
        res.statusCode = 404;
        res.statusMessage = "Not Found";
        res.end("Not Found");
        return;
      }
      console.log(chalk.green(`Serving ${req.url}`));
      res.end(data);
    });
  }
}

function sendIndexPage(res) {
  fs.readdir('public', function(err, files) {
    if(err) {
      console.log(chalk.read(`Error reading directory ${dirname}`));
      res.statusCode = 500;
      res.statusMessage = "Server Error";
      res.end("Server Error");
      return;
    }
    var links = files.map(function(file){
      return `<li><a href="${file}">${file}</a></li>`
    });
    var body = `<h3>Index of public/</h3><ul>${links.join('')}</ul>`;
    res.setHeader('Content-Type', 'text/html');
    res.end(body);
  });
}
              
var server = http.createServer(handleRequest);
              
server.listen(3000, function(){
  console.log(chalk.yellow('Server is running at'));
  console.log(chalk.yellow(`http://${process.env.CODIO_BOX_DOMAIN}:${PORT}\n`));
});