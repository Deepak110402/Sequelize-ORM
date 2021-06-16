const express = require("express");
const app = express();

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

app.post('/login', function(request, response) {
    User.findOne(
        { where: { Email: request.body.Email }})
        .then((users) => {
            if ( users['Password'] == request.body.Password ) {
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

app.post('/insert', function (request, response) {
    return User.create({
        Name: request.body.Name,
        Email: request.body.Email,
        Password: request.body.Password,
        Role: "User"
    }).then(function (users) {
        if (users) {
            response.send(users);
        } else {
            response.status(400).send('Error in insert new record');
        }
    });
});

app.delete('/delete', authuser, function(request,response){
    User.destroy({ where: { Email: request.body.Email }});
    response.send("Success");
});

app.post('/update', authuser, function(request, response){
    User.update(
        { Password: request.body.Password },
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