const APID = 'http://172.20.110.42:10000';
const APIP = 'http://172.20.110.43:10000';
let API = '';

var API_HOST = window.API_HOST;

if (!API_HOST) {
    if (process.env.NODE_ENV === 'development') {
        API = APID;
    } else {
        API = APIP;
    }
} else {
    API = API_HOST;
}

module.exports = {
    footerText: 'Tap4fun  © 2018 Chengdu',
    logo: '/public/logo.svg',
    API: API,
    api: {}
};
