const exp = require('constants');
const express = require('express');
const https = require('https');

const app = express();

// using middleware
app.use(express.static('./public'));
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res)=>{
    res.send();
})
app.post('/', (req, res)=>{
    const fName = req.body.fName;
    const lName = req.body.lName;
    const email = req.body.email;
    var data = {
        members: [{
            email_address: email,
            status:"subscribed",
            merge_fields: {
                FNAME: fName,
                LNAME: lName
            }
        }
        ]
    }
    // converting to flat json data
    var jsonData = JSON.stringify(data);
    // const url = "https://us14.api.mailchimp.com/3.0/lists/e123d40401"
    // const options = {
    //     method: 'POST',
    //     auth:"thanwin1:dd524b7446c83b4daf09faf17c2e7c37-us14"
    // }
    const url = "https://us14.api.mailchimp.com/3.0/lists/e123d40401"
    const options = {
        method: 'POST',
        auth:"thanwin1:9992e85f64dcbf0c2739709be8ed9483-us14"
    }
    
    //posting data to external secured server
    // it returns writable stream
    const request = https.request(url, options, (response)=>{
        if (response.statusCode === 200){
            res.sendFile(__dirname + '/success.html')
        }
        else {
            res.sendFile(__dirname + '/failure.html')
        }
        // a chunk of data has been received
        response.on('data', (data)=>{
            console.log(JSON.parse(data));
        })
    })
    // wrting data to the body
    request.write(jsonData);
    request.end()
})
app.post('/failure', (req, res)=>{
    // redirecting to root file
    res.redirect('/');
})
app.listen(3000, (req, res)=>{
    console.log("server is running on port 3000")
})
