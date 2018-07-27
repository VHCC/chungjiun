var moment = require('moment');



module.exports = function (app) {
    'use strict';
    // ----- define routes

    // fetch
    app.post(global.apiUrl.post_fetch_hrmachine_data_by_machine_did, function (req, res) {
        var resultArry = [];
        // console.log(req.body);
        var startDate = moment(req.body.startDate);

        var endDate = moment(req.body.endDate);

        var daysCount = endDate.diff(startDate, 'days');
        console.log(daysCount);

        var resultCount = 0;

        for (var index = 0; index < daysCount + 1; index ++) {
            var workDate = startDate.add(index, 'days').format('YYYYMMDD');
            console.log(workDate);

            var HrMachineForm = require('../../models/hrMachine')(workDate);

            HrMachineForm.find({
                did: req.body.machineDID,
            }, function (err, formDataResponse) {
                resultCount++;
                if (err) {
                    res.send(err);
                }
                // console.log(formDataResponse);
                resultArry.push(formDataResponse);
                // console.log(resultCount);

                if (resultCount === daysCount + 1) {
                    // console.log(resultArry);
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: resultArry,
                    });
                }
            })
        }
    });

}