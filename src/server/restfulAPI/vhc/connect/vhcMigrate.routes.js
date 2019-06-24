var VhcUser = require('../../vhc/model/vhcUser');
var VhcUserEyeCheckInfo = require('../../vhc/model/vhcUserEyeCheckInfo');
var VhcPurchaseRecord = require('../../vhc/model/vhcPurchaseRecord');
var mysql      = require('mysql');

var connectInfo = {
    host     : 'ichenprocin.dsmynas.com',
    database : 'vhc',
    user     : 'PiggyAdmin',
    password : '',
}

var connection = mysql.createConnection(connectInfo);

connection.connect(function(err) {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }

    console.log(' ----- Connect to '
        + connectInfo.host
        + ':'
        + connectInfo.database
        + ' Succeed. ----- ');
    console.log(' ----- Connected as id: '
        + connection.threadId);
});


module.exports = function (app) {
    'use strict';

    // create Form
    app.post(global.apiUrl.connect_db, function (req, res) {
        console.log(JSON.stringify(req.body));


        connection.query('SELECT * FROM user',
            function (error,
                      results,
                      fields) {

                if (error) {
                    throw error;
                } else {

                    results.forEach(result => {
                        VhcUser.create({
                            user_id: result.USER_ID,
                            user_number: result.USER_NUMBER.trim(),
                            user_name: result.USER_NAME,
                            user_sex: result.USER_SEX,
                            user_birth: result.USER_BIRTH,
                            user_mobile: result.USER_MOBILE,
                            user_homephone: result.USER_HOMEPHONE,
                            user_officephone: result.USER_OFFICEPHONE,
                            user_email: result.USER_EMAIL,
                            user_address: result.USER_ADDRESS,
                            user_memo: result.USER_MEMO,
                        }, function (err) {
                            if (err) {
                                res.send(err);
                            }
                        })

                        VhcUserEyeCheckInfo.create({
                            user_number: result.USER_NUMBER,

                            record_data: '',
                            user_rightolds: result.USER_RIGHTOLDS,
                            user_rightoldc: result.USER_RIGHTOLDC,
                            user_rightolda: result.USER_RIGHTOLDA,
                            user_rightoldbc: result.USER_RIGHTOLDBC,
                            user_rightoldadd: result.USER_RIGHTOLDADD,
                            user_rightoldva: result.USER_RIGHTOLDVA,
                            user_rightoldpd: result.USER_RIGHTOLDPD,
                            user_leftolds: result.USER_LEFTOLDS,
                            user_leftoldc: result.USER_LEFTOLDC,
                            user_leftolda: result.USER_LEFTOLDA,
                            user_leftoldbc: result.USER_LEFTOLDBC,
                            user_leftoldadd: result.USER_LEFTOLDADD,
                            user_leftoldva: result.USER_LEFTOLDVA,
                            user_leftoldpd: result.USER_LEFTOLDPD,
                        }, function (err) {
                            if (err) {
                                res.send(err);
                            }
                        })

                    });
                }
            }
        );

        connection.query('SELECT * FROM userrecord',
            function (error,
                      results,
                      fields) {

                if (error) {
                    throw error;
                } else {

                    results.forEach(result => {
                        VhcPurchaseRecord.create({
                            user_number: result.USER_NUMBER,

                            purchase_recorddate: result.USER_RECORDDATE,

                            purchase_rights: result.USER_RIGHTS,
                            purchase_rightc: result.USER_RIGHTC,
                            purchase_righta: result.USER_RIGHTA,
                            purchase_rightbc: result.USER_RIGHTBC,
                            purchase_rightadd: result.USER_RIGHTADD,
                            purchase_rightpd: result.USER_RIGHTPD,

                            purchase_lefts: result.USER_LEFTS,
                            purchase_leftc: result.USER_LEFTC,
                            purchase_lefta: result.USER_LEFTA,
                            purchase_leftbc: result.USER_LEFTBC,
                            purchase_leftadd: result.USER_LEFTADD,
                            purchase_leftpd: result.USER_LEFTPD,

                            purchase_f: result.USER_F,
                            purchase_fprice: result.USER_FPRICE,
                            purchase_l: result.USER_L,
                            purchase_lprice: result.USER_LPRICE,

                        }, function (err) {
                            if (err) {
                                res.send(err);
                            }
                        })
                    });
                }
            }
        );

        res.status(200).send({
            code: 200,
            error: global.status._200,
            // payload: payment,
        });

    });

}