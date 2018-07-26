var fileDate = '20180712';

var HrMachineForm = require('../../models/hrMachine')(fileDate);

module.exports = function (app) {
    'use strict';
    // ----- define routes

    // fetch
    app.post(global.apiUrl.post_fetch_hrmachine_data_by_machine_did, function (req, res) {
        console.log(req.body);
        HrMachineForm.find({
            did: req.body.machineDID,
        }, function (err, formDataResponse) {
            if (err) {
                res.send(err);
            }
            res.status(200).send({
                code: 200,
                error: global.status._200,
                payload: formDataResponse,
            });
        })
    });
}