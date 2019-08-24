const crawlerSteg = require('./crawlerSteg.js');
const crawlerSonede = require('./crawlerSonede.js');
const secretMgr = require('./secretMgr.js');

var aws = require('aws-sdk');

var ses = new aws.SES();

exports.handlerSteg = function (event, context, callback) {

    let dtsEmail;

    secretMgr.getStegSecret("prod/stegInvoice").then((stegSecrets) => {

        let sercrets = JSON.parse(stegSecrets);

        let login = sercrets["STEG_LOGIN"];
        let password = sercrets["STEG_PASSWORD"];
        dtsEmail = sercrets["STEG_DST_EMAIL"];

        return crawlerSteg.checkNewInvoice(login, password);

    }).then((amount) => {

        if (amount.indexOf("0,000") < 0) {
            var params = {
                Destination: {
                    ToAddresses: [dtsEmail]
                },
                Message: {
                    Subject: {Data: "STEG Invoice"},
                    Body: {Text: {Data: "A new STEG Invoice, amount : " + amount}},
                },
                Source: dtsEmail
            };

            return ses.sendEmail(params).promise();
        } else {
            return amount;
        }

    }).then(() => {

        callback(null, "done");

    }).catch((error) => {
        context.fail(error);
        console.log(error);
    });

};

exports.handlerSonede = function (event, context, callback) {

    let dtsEmail;

    secretMgr.getStegSecret("prod/sonedeInvoice").then((stegSecrets) => {

        let secrets = JSON.parse(stegSecrets);
        let login = secrets["SONEDE_LOGIN"];
        let password = secrets["SONEDE_PASSWORD"];
        dtsEmail = secrets["STEG_DST_EMAIL"];

        let district = secrets["SONEDE_DISTRICT"];
        let police = secrets["SONEDE_POLICE"];
        let tournee = secrets["SONEDE_TOURNEE"];
        let ordre = secrets["SONEDE_ORDRE"];

        return crawlerSonede.checkNewInvoice(login, password, district, police, tournee, ordre);

    }).then((newFacture) => {

        if (newFacture) {
            let params = {
                Destination: {
                    ToAddresses: [dtsEmail]
                },
                Message: {
                    Subject: {Data: "SONEDE Invoice"},
                    Body: {Text: {Data: "A New SONEDE Invoice"}}
                },
                Source: dtsEmail
            };

            return ses.sendEmail(params).promise();

        } else {
            return newFacture;
        }

    }).then(() => {

        callback(null, "done");

    }).catch((error) => {
        context.fail(error);
        console.log(error);
    });

};