const axios = require('axios');

function checkNewInvoice(login, password, district, police, tournee, ordre) {

    const baseUrl = "http://www.sonede.com.tn/";
    const axiosInstance = axios;

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',
            'Sec-Fetch-Mode': 'nested-navigate',
            'Sec-Fetch-User': ' ?1',
            'Upgrade-Insecure-Requests': '1',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
            'Referer': 'https://www.sonede.com.tn/eservices/session.php'
        }
    };

    let params = new URLSearchParams();
    params.append('mail', encodeURIComponent('zouabi.mourad@gmail.com'));
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

// checkNewInvoice("").then((res) => {
//     console.log(res);
// }).catch((e)=>{
//     console.log(e);
// });