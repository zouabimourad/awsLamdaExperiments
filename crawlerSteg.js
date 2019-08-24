const axios = require('axios');
const https = require('https');
const cheerio = require('cheerio');

function checkNewInvoice(login, password) {

    const baseUrl = "https://www.steg.com.tn/fr/espace/";

    const axiosInstance = axios.create({
        httpsAgent: new https.Agent({
            rejectUnauthorized: false
        })
    });

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    const params = new URLSearchParams();
    params.append('utilisateur', login);
    params.append('pwd', password);

    return axiosInstance.post(baseUrl + 'login.php', params, config)
        .then(function (response) {

            const $ = cheerio.load(response.data);
            const consultationHref = $(".menuactioncon").attr('href');
            return axiosInstance.get(baseUrl + consultationHref)

        }).then(function (response) {

            const $ = cheerio.load(response.data);
            const amount = $(".soustitrebleuclair").text().trim();
            return amount;

        });
}

module.exports = {
    checkNewInvoice: checkNewInvoice
};

// checkNewInvoice("", "").then((res) => {
//     console.log(res);
// }).catch(e=>console.log(e));