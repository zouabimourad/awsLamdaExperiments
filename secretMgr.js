var aws = require('aws-sdk');

function getStegSecret(secretName) {

    // Load the AWS SDK
    let region = "eu-west-1",
        secret,
        decodedBinarySecret;

    let client = new aws.SecretsManager({
        region: region
    });

    return new Promise(function (resolve, reject) {
        client.getSecretValue({SecretId: secretName}, function (err, data) {
            if (err) {
                reject(err);
            } else {

                if ('SecretString' in data) {
                    secret = data.SecretString;
                    resolve(secret);
                } else {
                    let buff = new Buffer(data.SecretBinary, 'base64');
                    decodedBinarySecret = buff.toString('ascii');
                    resolve(decodedBinarySecret);
                }
            }
        });

    });

}

module.exports = {
    getStegSecret: getStegSecret
};