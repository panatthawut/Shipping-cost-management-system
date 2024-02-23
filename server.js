var http = require('http');
var express = require('express');
var app = express();
var path = require('path');
var route = require('./routes/route');
var bodyParser = require('body-parser');
var {urlencoded} = require('express');
var flash = require('express-flash');
var session = require('express-session');
var cookiePaser = require('cookie-parser');
const methodOverride = require('method-override');

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookiePaser());
app.use(express.urlencoded({ extended: false}))
app.use(session({
    saveUninitialized: false,
    resave: 'false',
    secret: 'false'
}))

app.use(flash());
app.use('/',route);





app.listen(8000, ()=>{
    console.log('server is running is port 8000')
})


