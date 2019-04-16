var express = require('express')
var app = express()
var path = require('path')
var options = {
  maxAge: 20000,
  setHeaders(res, path, stat) {
    res.setHeader('date', new Date(new Date().getTime() + 10000).toGMTString())
  }
}
app.use(express.static(path.join(__dirname, "./"), options))


app.get('/', function(req, res) {
  res.sendFile('./index.html')
})

app.listen(3200)