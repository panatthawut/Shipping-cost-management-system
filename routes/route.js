var express = require('express')
var route = express.Router();
var con = require('../dbconn')
const cookieSession = require('cookie-session');
var mysql = require('mysql2');
const flash = require('connect-flash');
var database = require('../dbconn');

/*route.get('/', (req, res)=>{
    con.query('SELECT * FROM workrecord;', (err, result) =>{
        res.render('index', {data: result});
    })
})*/
route.get('/', requireLogin, function(req, res) {
  res.render('login')
})

route.get('/add', requireLogin, function(req, res) {
    res.render('add')
})

route.post('/login1', (req, res) => {
    var name = req.body.username
    con.query(`INSERT INTO users(username, pass) VALUES(${name}, ${name});`, (err, result) =>{
        if(err) throw err;
        console.log('INSERT 1 row')
    })
    res.redirect('/add')
})

// Route for displaying the system tracking page
route.get('/system-track', (req, res) => {
  res.render('track');
});

// Route for processing the system tracking form submission
route.post('/system-tracking', (req, res) => {
  // Retrieve the tracking ID entered by the user
  const trackingID = req.body.trackingID;

  // Perform the system tracking lookup using the tracking ID
  con.query(`SELECT StatusString FROM workrecordstatus WHERE IDPac = '${trackingID}';`, (error, result) => {
    if (error) throw error;

    // Pass the tracking status string to the view for display
    const statusString = result[0].StatusString;
    res.render('track2', { statusString });
  });
});


// Route to handle POST request for tracking information
route.get('/track2', (req, res) => {
  
});






route.get('/login', function(req, res) {
    res.render('login', { message: req.flash('message'), error: null });
    
  });

  route.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    
    con.query("SELECT * FROM users WHERE username = ? AND pass = ?", [email, password], (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
          req.flash('error', 'Incorrect email or password');
          res.redirect('/login');
          console.log('2')
        } else {
          const user = results[0];
          req.session.user = user;
          req.flash('success', 'You have successfully logged in!');
          res.redirect('/dashboard');
          console.log('3')
        }
      });
      
});


route.get('/dashboard', requireLogin, function(req, res) {
  con.query("SELECT * FROM turnover;", (err, result) => {
    if (err) throw err;
    con.query("SELECT ROUND(SUM(Income),2) SumIncome,ROUND(SUM(Outcome),2) SumOutcome,ROUND(SUM(Profit),2) SumProfit FROM turnover;", (err, sumResult) => {
      if (err) throw err;
      res.render('dashboard', {user: req.session.user,turnoverList: result,sumAll: sumResult[0]} );
    });
  });
});

function requireLogin(req, res, next) {
    if (req.session.user) {
      next();
    } else {
      req.flash('error', 'You must be logged in to access this page');
      res.redirect('/login');
      console.log('6')
    }
  }

  route.get('/logout', (req, res) => {
    // destroy the user's session to log them out
    req.session.destroy((err) => {
      if (err) throw err;
      res.redirect('/login');
    });
  });
  
  const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

route.get('/insertCompany', requireLogin,function(req, res) {
  res.render('company-add');
});

route.post('/insertCompany1', (req, res)  => {
  var NameCompany = req.body.NameCompany1;
  var telContact = req.body.telContact2;
  var email = req.body.email2;
  var AddDesc = req.body.AddDesc2;
  var SubDistrict = req.body.SubDistrict2;
  var District = req.body.District2;
  var Province = req.body.Province2;
  var Zipcode = req.body.Zipcode2;
  con.query('select AddID from address order by AddID DESC limit 1;', (err, result) => {
    if (err) throw err;
  
    var lastAddID = result[0].AddID;
    var temp = parseInt(lastAddID.substring(1, 4));
    var curAddID = 'A' + String(temp + 1).padStart(3, '0');
    con.query(`INSERT INTO address(AddID,AddDesc,SubDistrict,District,Province,Zipcode) VALUES('${curAddID}', '${AddDesc}','${SubDistrict}', '${District}', '${Province}', '${Zipcode}');`, (err, result) =>{
      if(err) throw err;
      con.query('select IDCompany from Company order by IDCompany DESC limit 1;', (err, result) => {
        if (err) throw err;
      
        var lastComID = result[0].IDCompany;
        var temp = parseInt(lastComID.substring(1, 4));
        var curComID = 'M' + String(temp + 1).padStart(3, '0');
        con.query(`INSERT INTO Company(IDCompany,NameCompany,AddID,telContact,email) VALUES('${curComID}', '${NameCompany}','${curAddID}', '${telContact}', '${email}');`, (err, result) =>{
          if(err) throw err;
          console.log('INSERT 1 row')
          } )
            res.redirect('/insertCompany')
      });
      } )
        //res.redirect('/insertCompany')
  });  
});






route.get('/insertCustomer', requireLogin,function(req, res) {
  res.render('customer-add');
});

route.post('/insertCustomer1', (req, res)  => {
  var NameCustomer = req.body.NameCustomer1;
  var telContact = req.body.telContact1;
  var email = req.body.email1;
  var AddDesc = req.body.AddDesc1;
  var SubDistrict = req.body.SubDistrict1;
  var District = req.body.District1;
  var Province = req.body.Province1;
  var Zipcode = req.body.Zipcode1;
  con.query('select AddID from address order by AddID DESC limit 1;', (err, result) => {
    if (err) throw err;
  
    var lastAddID = result[0].AddID;
    var temp = parseInt(lastAddID.substring(1, 4));
    var curAddID = 'A' + String(temp + 1).padStart(3, '0');
    con.query(`INSERT INTO address(AddID,AddDesc,SubDistrict,District,Province,Zipcode) VALUES('${curAddID}', '${AddDesc}','${SubDistrict}', '${District}', '${Province}', '${Zipcode}');`, (err, result) =>{
      if(err) throw err;
      con.query('select IDCustomer from Customer order by IDCustomer DESC limit 1;', (err, result) => {
        if (err) throw err;
      
        var lastCusID = result[0].IDCustomer;
        var temp = parseInt(lastCusID.substring(1, 4));
        var curCusID = 'C' + String(temp + 1).padStart(3, '0');
        con.query(`INSERT INTO Customer(IDCustomer,NameCustomer,AddID,telContact,email) VALUES('${curCusID}', '${NameCustomer}','${curAddID}', '${telContact}', '${email}');`, (err, result) =>{
          if(err) throw err;
          console.log('INSERT 1 row')
          } )
            res.redirect('/insertCustomer')
      });
      } )
  });  
});
  

route.get('/test', function(req, res, next) {
  res.render('test-drop', { title: 'AutoComplete Search in Node.js with MySQL' });
});

route.get('/insertCar', function(request, response, next){

  var search_query = request.query.search_query;

  var query = `
  SELECT NameCompany FROM Company 
  WHERE NameCompany LIKE '%${search_query}%' 
  LIMIT 10
  `;

  database.query(query, function(error, data){

      response.json(data);

  });

});
route.post('/add_car', (req, res) => {
  var ComName_search = req.body.Comname_search

  con.query('select IDCar from Car order by IDCar DESC limit 1;', (err, result) => {
    if (err) throw err;
  
    var lastCarID = result[0].IDCar;
    var temp = parseInt(lastCarID.substring(1, 4));
    var curCarID = 'R' + String(temp + 1).padStart(3, '0');
    con.query(`SELECT IDCompany FROM Company WHERE NameCompany = '${ComName_search}';`, (err, result) =>{
      var IDComSearch = result[0].IDCompany;
      var insurance = req.body.answer1;
      var CarType = req.body.CarType;
      var CarDesc = req.body.CarDesc;
      var CarRegis = req.body.Registration;
      con.query(`INSERT INTO Car(IDCar,CarInsurance,CarType,CarDesc,Registration,IDCompany) VALUES('${curCarID}', '${insurance}','${CarType}', '${CarDesc}', '${CarRegis}', '${IDComSearch}');`, (err, result) =>{
        if(err) throw err;
        console.log('INSERT 1 row')
        } )
          res.redirect('/test')
    });
  });
})


route.get('/insertOrigin',requireLogin, function(req, res) {
  res.render('origin-add');
});

route.post('/insertOrigin1', (req, res)  => {
  var AddDesc = req.body.AddDesc3;
  var SubDistrict = req.body.SubDistrict3;
  var District = req.body.District3;
  var Province = req.body.Province3;
  var Zipcode = req.body.Zipcode3;
  var OrDesc = req.body.OrDesc;
  con.query('select AddID from address order by AddID DESC limit 1;', (err, result) => {
    if (err) throw err;
  
    var lastAddID = result[0].AddID;
    var temp = parseInt(lastAddID.substring(1, 4));
    var curAddID = 'A' + String(temp + 1).padStart(3, '0');
    con.query(`INSERT INTO address(AddID,AddDesc,SubDistrict,District,Province,Zipcode) VALUES('${curAddID}', '${AddDesc}','${SubDistrict}', '${District}', '${Province}', '${Zipcode}');`, (err, result) =>{
      if(err) throw err;
      con.query('select OrID from Origin order by OrID DESC limit 1;', (err, result) => {
        if (err) throw err;
      
        var lastOrID = result[0].OrID;
        var temp = parseInt(lastOrID.substring(1, 4));
        var curOrID = 'O' + String(temp + 1).padStart(3, '0');
        con.query(`INSERT INTO Origin(OrID,OrDesc,AddID) VALUES('${curOrID}', '${OrDesc}','${curAddID}');`, (err, result) =>{
          if(err) throw err;
          console.log('INSERT 1 row')
          } )
            res.redirect('/insertOrigin')
      });
      } )
  });
});

route.get('/insertDestination',requireLogin, function(req, res) {
  res.render('Destination-add');
});

route.post('/insertDestination1', (req, res)  => {
  var AddDesc = req.body.AddDesc4;
  var SubDistrict = req.body.SubDistrict4;
  var District = req.body.District4;
  var Province = req.body.Province4;
  var Zipcode = req.body.Zipcode4;
  var DestDesc = req.body.DestDesc;
  con.query('select AddID from address order by AddID DESC limit 1;', (err, result) => {
    if (err) throw err;
  
    var lastAddID = result[0].AddID;
    var temp = parseInt(lastAddID.substring(1, 4));
    var curAddID = 'A' + String(temp + 1).padStart(3, '0');
    con.query(`INSERT INTO address(AddID,AddDesc,SubDistrict,District,Province,Zipcode) VALUES('${curAddID}', '${AddDesc}','${SubDistrict}', '${District}', '${Province}', '${Zipcode}');`, (err, result) =>{
      if(err) throw err;
      con.query('select DestID from Destination order by DestID DESC limit 1;', (err, result) => {
        if (err) throw err;
      
        var lastDestID = result[0].DestID;
        var temp = parseInt(lastDestID.substring(1, 4));
        var curDestID = 'D' + String(temp + 1).padStart(3, '0');
        con.query(`INSERT INTO Destination(DestID,DestDesc,AddID) VALUES('${curDestID}', '${DestDesc}','${curAddID}');`, (err, result) =>{
          if(err) throw err;
          console.log('INSERT 1 row')
          } )
            res.redirect('/insertDestination')
      });
      } )
  });
});





route.get('/in', function(req, res) {
  res.render('index');
});

// about page
route.get('/about', function(req, res) {
  res.render('about');
});

route.get('/product-add',requireLogin, function(req, res) {
  res.render('product-add');
});

route.get('/insertProduct', function(request, response, next){

  var search_query = request.query.search_query;

  var query = `
  SELECT NameCustomer FROM Customer 
  WHERE NameCustomer LIKE '%${search_query}%' 
  LIMIT 10
  `;

  database.query(query, function(error, data){

      response.json(data);

  });

});

route.post('/add-product', (req, res) => {
  var CusName_search = req.body.Cusname_search;

  con.query('select IDPro from Product order by IDPro DESC limit 1;', (err, result) => {
    if (err) throw err;
  
    var lastProID = result[0].IDPro;
    var temp = parseInt(lastProID.substring(1, 4));
    var curProID = 'R' + String(temp + 1).padStart(3, '0');
    var ProName = req.body.ProName;
    var ProDesc = req.body.ProDesc;
    con.query(`SELECT IDCustomer FROM Customer WHERE NameCustomer = '${CusName_search}';`, (err, result) =>{
      var IDCusSearch = result[0].IDCustomer;
      con.query(`INSERT INTO Product(IDPro,ProName,ProDesc,IDCustomer) VALUES('${curProID}', '${ProName}','${ProDesc}', '${IDCusSearch}');`, (err, result) =>{
        if(err) throw err;
        console.log('INSERT 1 row')
        } )
          res.redirect('/product-add')
    });
  });
})
route.get('/insertWorkrecord1', function(request, response, next){

  var search_query = request.query.search_query;

  var query = `
  SELECT FullAddressOr FROM OrAddress 
  WHERE FullAddressOr LIKE '%${search_query}%' 
  LIMIT 10
  `;

  database.query(query, function(error, data){

      response.json(data);

  });

});
route.get('/insertWorkrecord2', function(request, response, next){

  var search_query = request.query.search_query;

  var query = `
  SELECT FullAddressDest FROM DestAddress 
  WHERE FullAddressDest LIKE '%${search_query}%' 
  LIMIT 10
  `;

  database.query(query, function(error, data){

      response.json(data);

  });

});
route.get('/insertWorkrecord3', function(request, response, next){

  var search_query = request.query.search_query;

  var query = `
  SELECT NameCustomer FROM Customer 
  WHERE NameCustomer LIKE '%${search_query}%' 
  LIMIT 10
  `;

  database.query(query, function(error, data){

      response.json(data);

  });

});
route.get('/insertWorkrecord4', function(request, response, next){

  var search_query = request.query.search_query;

  var query = `
  SELECT Registration FROM Car 
  WHERE Registration LIKE '%${search_query}%' 
  LIMIT 10
  `;

  database.query(query, function(error, data){

      response.json(data);

  });

});
route.get('/insertWorkrecord5', function(request, response, next){

  var search_query = request.query.search_query;

  var query = `
  SELECT ProName FROM Product 
  WHERE ProName LIKE '%${search_query}%' 
  LIMIT 10
  `;

  database.query(query, function(error, data){

      response.json(data);

  });

});
route.get('/insertWorkrecord', function(req, res) {
  res.render('workrecord');
});

route.post('/addWorkrecord', (req, res) => {

  con.query('select IDWork from Workrecord order by IDWork DESC limit 1;', (err, result) => {
    if (err) throw err;
  
    var lastWorkID = result[0].IDWork;
    var temp = parseInt(lastWorkID.substring(1, 6));
    var curWorkID = 'W' + String(temp + 1).padStart(5, '0');
    var DeliverDate = req.body.deliverDate;
    var ProInsurance = req.body.answer2;
    var Price = parseFloat(req.body.price);
    var Weight = parseFloat(req.body.weight);
    var Freight = Price * Weight;
    var Outcome = Freight*0.8;
    con.query(`SELECT DestID FROM DestAddress WHERE FullAddressDest = '${req.body.DestName_search}';`, (err, result) =>{
      var DestIDSearch = result[0].DestID;
      con.query(`SELECT OrID FROM OrAddress WHERE FullAddressOr = '${req.body.OrName_search}';`, (err, result) =>{
        var OrIDSearch = result[0].OrID;
        con.query(`SELECT IDCustomer FROM Customer WHERE NameCustomer = '${req.body.CusName_searchWR}';`, (err, result) =>{
          var CusIDSearch = result[0].IDCustomer;
          con.query(`SELECT IDPro FROM Product WHERE ProName = '${req.body.ProName_search}';`, (err, result) =>{
            var ProIDSearch = result[0].IDPro;
            con.query(`SELECT IDCar,IDCompany FROM Car WHERE Registration = '${req.body.Registration_search}';`, (err, result) =>{
              var CarIDSearch = result[0].IDCar;
              var ComIDSearch = result[0].IDCompany;
              con.query(`INSERT INTO workrecord(IDWork,Price,DeliveryDate,Freight,Weight,ProductInsurance,DestID,OrID,IDCustomer,IDPro,IDCompany,IDCar,outcome,BillDate) VALUES('${curWorkID}', ${Price}, '${DeliverDate}',${Freight},${Weight}, '${ProInsurance}', '${DestIDSearch}', '${OrIDSearch}', '${CusIDSearch}', '${ProIDSearch}', '${ComIDSearch}', '${CarIDSearch}', ${Outcome}, CURDATE());`, (err, result) =>{
                if(err) throw err;
                console.log('INSERT Workrecord 1 row')
                con.query('select CURDATE() CurrentDate;', (err, result) => {
                  var CurDate = result[0].CurrentDate;
                  con.query('select TOID,TurnDate,OutCome,Income,Profit from turnover order by TOID DESC limit 1;', (err, result) => {
                    if (err) throw err;
                    var LastTurnDate = result[0].TurnDate;
                    console.log(LastTurnDate);
                    console.log(CurDate);
                    var LastOutcome = result[0].OutCome;
                    var LastIncome = result[0].Income;
                    var LastProfit = result[0].Profit;
                    var lastTOID = result[0].TOID;
                    var temp = parseInt(lastTOID.substring(1, 6));
                    var curTOID = 'T' + String(temp + 1).padStart(5, '0');
                
                    if (LastTurnDate.toLocaleString() == CurDate.toLocaleString()){
                      con.query(`UPDATE Turnover set Outcome = ${LastOutcome+Outcome}, Income = ${LastIncome+Freight}, Profit = ${LastProfit+(Freight-Outcome)} WHERE TOID = '${lastTOID}';`, (err, result) =>{
                        if(err) throw err;
                        console.log('Update Turnover 1 row')
                      });
                    }else{
                      con.query(`INSERT INTO Turnover(TOID,TurnDate,Outcome,Income,Profit) VALUES('${curTOID}', CURDATE(), ${Outcome},${Freight}, ${Freight-Outcome});`, (err, result) =>{
                        if(err) throw err;
                        console.log('INSERT Turnover 1 row')
                      });
                    }
                    con.query('SELECT IDPac FROM workrecordstatus ORDER BY IDPac DESC LIMIT 1;', (err, result) =>{
                      if(err) throw err;
                      var lastPacID = result[0].IDPac;
                      var temp = parseInt(lastPacID.substring(2, 6));
                      var curPacID = 'PA' + String(temp + 1).padStart(4, '0');
                      con.query(`INSERT INTO Workrecordstatus(IDPac,IDWork,StatusString) VALUES('${curPacID}','${curWorkID}','กำลังจัดส่ง');`, (err,result) =>{
                        if (err) throw err;
                        console.log('INSERT Workrecordstatus 1 ROW');
                      });
                    });
                });
              })
            })
                  res.redirect('/insertWorkrecord')  
            } )  
            } )
          } )
        } )
      } )
  });
  })




  route.get('/billing',requireLogin, function(req, res) {
    res.render('billing');
  });
  route.get('/insertbilling', function(request, response, next){

    var search_query = request.query.search_query;
  
    var query = `
    SELECT Datas FROM WorkView
    WHERE Datas LIKE '%${search_query}%' 
    LIMIT 10
    `;
  
    database.query(query, function(error, data){
  
        response.json(data);
  
    });
  
  });

  route.post('/billingPrint', (req, res)  => {
    con.query(`SELECT IDWork FROM WorkView WHERE Datas = '${req.body.Datas_search}';`, (err, result) =>{
      if (err) throw err;
      var WorkIDSearch = result[0].IDWork;
      con.query(`SELECT Freight,Price,Weight,DestID,OrID,IDCustomer,IDPro,IDCar FROM workrecord WHERE IDWork = '${WorkIDSearch}';`, (err, result) =>{
        if (err) throw err;
        var Freight = result[0].Freight;
        var Price = result[0].Price;
        var Weight = result[0].Weight;
        var OrIDSearch = result[0].OrID;
        var DestIDSearch = result[0].DestID;
        var CusIDSearch = result[0].IDCustomer;
        var ProIDSearch = result[0].IDPro;
        var CarIDSearch = result[0].IDCar;
        con.query(`SELECT Province FROM OrProv WHERE OrID = '${OrIDSearch}';`, (err, result) =>{
          if (err) throw err;
          var OrProv = result[0].province;
          con.query(`SELECT Province FROM DestProv WHERE DestID = '${DestIDSearch}';`, (err, result) =>{
            if (err) throw err;
            var DestProv = result[0].province;
            con.query(`SELECT AddDesc,NameCustomer,SubDistrict,District,Province,Zipcode,TelContact FROM CusAddress WHERE IDCustomer = '${CusIDSearch}';`, (err, result) =>{
              if (err) throw err;
              var NameCustomer = result[0].NameCustomer;
              var CusAddDesc = result[0].AddDesc;
              var CusSubDistrict = result[0].SubDistrict;
              var CusDistrict = result[0].District;
              var CusProvince = result[0].Province;
              var CusZipcode = result[0].Zipcode;
              var CusTelContact = result[0].telContact;
              con.query(`SELECT ProName FROM Product WHERE IDPro = '${ProIDSearch}';`, (err, result) =>{
                if (err) throw err;
                var ProName = result[0].ProName;
                con.query(`SELECT Registration FROM Car WHERE IDCar = '${CarIDSearch}';`, (err, result) =>{
                  if (err) throw err;
                  var Registration = result[0].Registration;
                    
                    const { createInvoice } = require("./createInvoice.js");
                    
                    var invnum = "INV"+WorkIDSearch.substring(1,6);
                    const invoice = {
                      shipping: {
                        name: NameCustomer,
                        address: CusAddDesc,
                        sub_district: CusSubDistrict,
                        district: CusDistrict,
                        province: CusProvince,
                        zipcode: CusZipcode,
                        tel: CusTelContact.substring(0,1) + "-" + CusTelContact.substring(1,5) + "-"+CusTelContact.substring(5,9),
                      },
                      items: [
                        {
                          item: "ค่าขนส่ง",
                          origin: OrProv,
                          destination: DestProv,
                          product: ProName,
                          registration: Registration,
                          quantity: Weight,
                          price: Price
                        }
                      ],
                      subtotal: Freight,
                      invoice_nr: invnum
                    };

                    createInvoice(invoice, "invoice.pdf");
                    const file = `C:/Users/Dragon/Desktop/pro-dbms/invoice.pdf`;
                    setTimeout(() => {
                      res.download(file, 'invoice.pdf', (err) => {
                        if (err) {
                          console.log('Error:', err);
                        } else {
                          console.log('File downloaded successfully.');
                        }
                      });
                    },2000);
                    
                });
              });
            });
          });
        });

      });
    });
  });



  



  route.get('/customer',requireLogin, function(req, res) {
    con.query('SELECT * FROM customer', function(err, result) {
        if (err) throw err;
        res.render('customer', {customerList: result});
    });
});

// Render delete confirmation page for customer


// Delete customer data from database
route.get('/customer/delete/:id',requireLogin, function(req, res) {
  con.query('DELETE FROM customer WHERE IDCustomer = ?', [req.params.id], function(err, result) {
    if (err) throw err;
    res.redirect('/customer');
  });
});

// Render edit form for customer
route.get('/customer/edit/:id', requireLogin,function(req, res) {
  con.query('SELECT * FROM customer WHERE IDCustomer = ?', [req.params.id], function(err, result) {
      if (err) throw err;
      con.query(`SELECT * FROM address WHERE AddID = '${result[0].AddID}'`, function(err, addressResult) {
          if (err) throw err;
          res.render('customer_edit', {customer: result[0], address: addressResult[0]});
      });
  });
});

// Update customer data in database
route.post('/customer/edit/:id', function(req, res) {
  const {NameCustomer, AddID, telContact, email,addDesc,subDist,dist,prov,zipcode} = req.body;
  con.query('UPDATE customer SET NameCustomer = ?, AddID = ?, telContact = ?, email = ? WHERE IDCustomer = ?', [NameCustomer, AddID, telContact, email, req.params.id], function(err, result) {
      if (err) throw err;
      con.query('UPDATE address SET AddDesc = ?,SubDistrict = ?, District = ?, Province = ?, Zipcode = ? WHERE AddID = ?;',[addDesc,subDist,dist,prov,zipcode,AddID],(err,result) => {
        if (err) throw err;
        res.redirect('/customer');
      });
  });
});








route.get('/company',requireLogin, function(req, res) {
  con.query('SELECT * FROM company', function(err, result) {
      if (err) throw err;
      res.render('company', {companyList: result});
  });
});
route.get('/company/delete/:id',requireLogin, function(req, res) {
  con.query('DELETE FROM company WHERE IDCompany = ?', [req.params.id], function(err, result) {
      if (err) throw err;
      res.redirect('/company');
  });
});

// Render edit form for company
route.get('/company/edit/:id',requireLogin, function(req, res) {
  con.query('SELECT * FROM company WHERE IDCompany = ?', [req.params.id], function(err, result) {
      if (err) throw err;
      con.query(`SELECT * FROM address WHERE AddID = '${result[0].AddID}'`, function(err, addressResult) {
        if (err) throw err;
        res.render('company_edit', {company: result[0], address: addressResult[0]});
    });
  });
});

// Update company data in database
route.post('/company/edit/:id', function(req, res) {
  const {NameCompany, AddID, telContact, email,addDesc,subDist,dist,prov,zipcode} = req.body;
  con.query('UPDATE company SET NameCompany = ?, AddID = ?, telContact = ?, email = ? WHERE IDCompany = ?', [NameCompany, AddID, telContact, email, req.params.id], function(err, result) {
      if (err) throw err;
      con.query('UPDATE address SET AddDesc = ?,SubDistrict = ?, District = ?, Province = ?, Zipcode = ? WHERE AddID = ?;',[addDesc,subDist,dist,prov,zipcode,AddID],(err,result) => {
        if (err) throw err;
        res.redirect('/company');
      });
  });
});

route.get('/updatestatus',requireLogin, function(req, res) {
  con.query('SELECT * FROM workrecordstatus', function(err, result) {
      if (err) throw err;
      res.render('workrecordstatus', {workrecordstatusList: result});
  });
});

route.get('/workrecordstatus/edit/:id',requireLogin, function(req, res) {
  con.query('SELECT * FROM workrecordstatus WHERE IDPac = ?', [req.params.id], function(err, result) {
      if (err) throw err;
      //console.log(typeof(result));
      res.render('editStatus', {workrecordstatus: result[0]});
  });
});

route.post('/status/edit/:id', function(req, res) {
  const {statusString} = req.body;
  con.query('UPDATE workrecordstatus SET StatusString = ? WHERE IDPac = ?', [statusString, req.params.id], function(err, result) {
    console.log(req.params.id);  
    if (err) throw err;
      res.redirect('/updatestatus');
  });
});



module.exports = route;