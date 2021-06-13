const express = require("express");
const { futimesSync } = require("fs");
const app = express();

app.use(
    express.urlencoded({
      extended: true
    })
  )
  
app.use(express.json())

const db = require("./models");
const { User } = require("./models");

app.get('/all', function(request, response) {
    User.findAll().then((users) => {
        response.send(users);
    });
});

app.post('/insert', function (request, response) {
    return User.create({
        Name: request.body.Name,
        Email: request.body.Email,
        Password: request.body.Password
    }).then(function (users) {
        if (users) {
            response.send(users);
        } else {
            response.status(400).send('Error in insert new record');
        }
    });
});

app.delete('/delete', function(request,response){
    User.destroy({ where: { Name: request.body.Name }});
    response.send("Success");
});

app.post('/update', function(request, response){
    User.update(
        { Email: request.body.Email },
        { where: { Name: request.body.Name }}
    );
    response.send("Success");
});

db.sequelize.sync().then((req) => {
    app.listen(3000, function() {
        console.log("Api running");
    });
});