// jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const mailchimp = require('mailchimp-api-v3');
const app = express();
 const dotenv = require('dotenv');
 dotenv.config();

// DYNAMIC HEROKU PORT
const port = process.env.PORT || 3200;

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));
// Display the sign Up form

app.get('/', function(req,res){
  res.sendFile(__dirname + '/public/signUp.html')
});

app.post('/', function(req,res){
  // Fetch the input from the form
  const firstName = req.body.fname;
  const lastname = req.body.lname;
  const email = req.body.email;

  const apiKey = process.env.API_KEY;
  const listId = process.env.LIST_ID;

  console.log(apiKey,listId);

// This is the data we want to send to mailchimp
  const data = {
    members:[
      {
        email_address:email,
        status: 'subscribed',
        merge_fields:{
          FNAME:firstName,
          LNAME:lastname
        }
      }
    ]
  };

  // SINCE WE NEED A FLAT PACK JSON - like a straight line json
    const jsonData = JSON.stringify(data);
  // TO MAKE OUR REQUEST TO SEND/POST TO EXTERNAL
    const url = 'https://us9.api.mailchimp.com/3.0/lists/d1c528071c';
    const options = {
      method:'POST',
      auth:'abdfatahi:' + apiKey,
    };
   const request = https.request(url, options, function(response){
     if(response.statusCode === 200){
       res.sendFile(__dirname + '/public/success.html');
       } else{
         res.sendFile(__dirname + '/public/failure.html');
       }
        response.on('data', function(data){
          console.log(JSON.parse(data));
        });
      });
      // To send the data that we created to mailchimp
      request.write(jsonData);
      request.end();
});

app.post("/success", function(req,res){
  res.redirect("/")
});
app.post("/failure", function(req,res){
  res.redirect("/")
});

app.listen(port, function(){
  console.log('Server has started running on port 3200');
});








// API KEY
// c02e51f11513ab02fc7cf036d06060bf-us9

// LIST ID
//  d1c528071c
