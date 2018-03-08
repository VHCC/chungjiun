
var User = require('../../models/user');
var Project = require('../../models/project');

module.exports = function(app) {
    'use strict';
// application -------------------------------------------------------------

// ----- define routes
    // create

    app.get(global.apiUrl.get_all_users , function(req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, getAllUsers");
        User.find(function(err, users) {
            if (err) {
                res.send(err);
            }
            res.json(users);
        });
    });

    app.post(global.apiUrl.post_project_create, function(req, res) {
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

    app.get(global.apiUrl.get_project_find, function(req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, get projects");
        Project.find(function(err, projects) {
            if (err) {
                res.send(err);
            }
            res.json(projects);
        })
    });

}