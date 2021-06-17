const express = require("express");
const app = express();
const bcrypt = require('bcrypt');

app.use(
    express.urlencoded({
      extended: true
    })
  )
  
app.use(express.json())

global.role = 0
global.email = ''

const db = require("./models");
const { User } = require("./models");

app.post('/login', async function(request, response) {
    User.findOne(
        { where: { Email: request.body.Email }})
        .then((users) => {
            if ( bcrypt.compareSync(request.body.Password, users['Password']) ) {
                response.send('Success')
                email = request.body.Email
                if ( users['Role'] == "Admin") {
                    role = 1
                } else if ( users['Role'] == "User" ) {
                    role = 2
                }
            } else {
                response.send("Password is wrong")
            }
        });
});

app.get('/all', function(request, response) {
    User.findAll().then((users) => {
        response.send(users);
    });
});

app.post('/insert', async function (request, response) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(request.body.Password, salt);
    User.create({
        Name: request.body.Name,
        Email: request.body.Email,
        Password: hashedPassword,
        Role: "User"
    }).then(function (users) {
        response.send(users);
    });
});

app.delete('/delete', authuser, function(request,response){
    User.destroy({ where: { Email: request.body.Email }});
    response.send("Success");
});

app.post('/update', authuser, async function(request, response){
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(request.body.Password, salt);
    User.update(
        { Password: hashedPassword },
        { where: { Email: request.body.Email }}
    );
    response.send("Success");
});

function authuser(request, response, next) {
    if (request.body.Email == email) {
        next()
    } else if (role == 1) {
        next()
    } else if (role == 2) {
        response.send('You are not admin')
    } else if (role == 0) {
        response.send('You are not login')
    }
}

app.listen(3000, function() {
    console.log("Api running");
});