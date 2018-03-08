
var User = require('../../models/user');
var Project = require('../../models/project');

module.exports = function(app) {
    'use strict';
// application -------------------------------------------------------------

// ----- define routes
    // create

    app.get('/api/getAllUsersName', function(req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, getAllUsersName");
        User.find(function(err, users) {
            if (err) {
                res.send(err);
            }
            res.json(users);
        });
    });

    app.post('/api/project', function(req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, create project");
        console.log('major= ' + req.body.majorID);
        console.log('name= ' + req.body.name);
        console.log('creator= ' + req.body.creator);
        console.log('code= ' + req.body.code);
        Project.create({
            code : req.body.code,
            name : req.body.name,
            majorID : req.body.majorID,
            creator : req.body.creator,
            done : false
        }, function(err, project) {
            if (err) {
                res.send(err);
            }
            res.json(project);
        });
    });

    app.get('/api/project', function(req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, get projects");
        Project.find(function(err, projects) {
            if (err) {
                res.send(err);
            }
            res.json(projects);
        })
    });

}