var path = require('path');
var appDir = path.dirname(require.main.filename);

var Todo = require('./models/todo');

module.exports = function(app) {

// application -------------------------------------------------------------
// app.get('*', function (req, res) {
//     res.sendFile(__dirname + '/public/indexold.html'); // load the single view file (angular will handle the page changes on the front-end)
// });

// ----- define routes
// get all todos
    app.get('/api/todos', function(req, res) {
        console.log(" get all todos");
        // use mongoose to get all todos in the database
        Todo.find(function(err, todos) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err) {
                res.send(err);
            }
            res.json(todos); // return all todos in JSON format
        });
    });
// create Todo and send back all todos after creation
    app.post('/api/todos', function(req, res) {
        // create a Todo, information comes from AJAX request from Angular
        console.log("create");
        Todo.create({
            text : req.body.text,
            done : false
        }, function(err, todo) {
            if (err) {
                res.send(err);
            }
            // get and return all the todos after you create another
            Todo.find(function(err, todos) {
                if (err) {
                    res.send(err);
                }
                res.json(todos);
            });
        });
    });

// delete a todo
    app.delete('/api/todos/:todo_id', function(req, res) {
        console.log("delete");
        Todo.remove({
            _id : req.params.todo_id
        }, function(err, todo) {
            if (err)
                res.send(err);
            // get and return all the todos after you create another
            Todo.find(function(err, todos) {
                if (err) {
                    res.send(err);
                }
                res.json(todos);
            });
        });
    });

    app.post('/api/todos/test', function (req, res) {
        console.log("delete All");
        Todo.remove({}, function(err, todo) {
            if (err)
                res.send(err);
            // get and return all the todos after you create another
            Todo.find(function(err, todos) {
                if (err) {
                    res.send(err);
                }
                res.json(todos);
            });
        });
    })

// // get the indexold.html
//     app.get('*', function(req, res) {
//         // res.sendFile(appDir + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
//         res.sendFile('/public/views/index.html' , { root : appDir}); // load the single view file (angular will handle the page changes on the front-end)
//     });
}