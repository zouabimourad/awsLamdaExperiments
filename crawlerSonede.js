const axios = require('axios');

function checkNewInvoice(login, password, district, police, tournee, ordre) {

    const baseUrl = "http://www.sonede.com.tn/";
    const axiosInstance = axios;

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    let params = new URLSearchParams();
    params.append('mail', encodeURIComponent(login));
    params.append('lb_mail', 'e-mail');
    params.append('rq_mail', '21');
    params.append('password', password);
    params.append('lb_password', 'Password');
    params.append('rq_password', '1');
    params.append('act', 'auth');

    return axiosInstance.post(baseUrl + 'eservices/session.php?act=auth', params, config)
        .then(function (response) {

            let cookies = response.headers['set-cookie'].map(e => e.split(";")[0]).join("; ");

            let params = new URLSearchParams();
            params.append('district', district);
            params.append('police', police);
            params.append('tournee', tournee);
            params.append('ordre', ordre);
            params.append('pwd', password);

            return axiosInstance.post(baseUrl + 'siteSonede/servlet/consultAccount', params, {headers: {Cookie: cookies}})

        }).then(function (response) {

            return !(response.data.indexOf("Vous n'avez pas de facture") > 0);

        });
}

module.exports = {

    checkNewInvoice: checkNewInvoice

};