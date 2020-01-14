const crawlerSteg = require('./crawlerSteg.js');
const crawlerSonede = require('./crawlerSonede.js');
const secretMgr = require('./secretMgr.js');

const aws = require('aws-sdk');

const ses = new aws.SES();

exports.handlerSteg = function (event, context, callback) {

    secretMgr.getStegSecret("prod/stegInvoice").then((stegSecrets) => {

        let sercrets = JSON.parse(stegSecrets);

        let login = sercrets["STEG_LOGIN"];
        let password = sercrets["STEG_PASSWORD"];
        let dstEmail = sercrets["STEG_DST_EMAIL"];

        return crawlerSteg.checkNewInvoice(login, password)
            .then(response => {
                return {"amount": response, "dstEmail": dstEmail};
            })

    }).then((response) => {

        if (response.amount.indexOf("0,000") < 0 && response.amount !== "0") {
            let params = {
                Source: response.dstEmail,
                Destination: {
                    ToAddresses: [response.dstEmail]
                },
                Message: {
                    Subject: {Data: "STEG Invoice"},
                    Body: {Text: {Data: "A new STEG Invoice, amount : " + response.amount}},
                }
            };

            return ses.sendEmail(params).promise();
        } else {
            return response.amount;
        }

    }).then(() => {

        callback(null, "done");

    }).catch((error) => {

        context.fail(error);

    });

};

exports.handlerSonede = function (event, context, callback) {

    secretMgr.getStegSecret("prod/sonedeInvoice").then((stegSecrets) => {

        let secrets = JSON.parse(stegSecrets);
        let login = secrets["SONEDE_LOGIN"];
        let password = secrets["SONEDE_PASSWORD"];
        let dstEmail = secrets["STEG_DST_EMAIL"];

        let district = secrets["SONEDE_DISTRICT"];
        let police = secrets["SONEDE_POLICE"];
        let tournee = secrets["SONEDE_TOURNEE"];
        let ordre = secrets["SONEDE_ORDRE"];

        return crawlerSonede.checkNewInvoice(login, password, district, police, tournee, ordre)
            .then(response => {
                return {"newFacture": response, "dstEmail": dstEmail};
            })

    }).then((response) => {

        if (response.newFacture) {

            let params = {
                Source: response.dstEmail,
                Destination: {
                    ToAddresses: [response.dstEmail]
                },
                Message: {
                    Subject: {Data: "SONEDE Invoice"},
                    Body: {Text: {Data: "A New SONEDE Invoice"}}
                }
            };

            return ses.sendEmail(params).promise();

        } else {
            return response.newFacture;
        }

    }).then(() => {

        callback(null, "done");

    }).catch((error) => {

        context.fail(error);

    });

};