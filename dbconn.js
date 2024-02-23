var mysql = require('mysql2');

var con = mysql.createConnection({
    host: "10.66.176.90", // Your database host name
    user: "csproj", // Your database username for your application
    password: "p123", // Your database password for your application
    database: "transportproj", // Your database name
    port: '3306'
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = con;