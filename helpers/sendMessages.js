const { default: axios } = require("axios");

const sendMessageWhatsapp = (msg, phone, callbackFunc) => {
    const wabaName = 'DemoWhatsAppMALS';
    const wabaPhone = 917834811114;
    const apikey = '80plqudd5eg9untv7icacaol4lwvocmh';

    const params = new URLSearchParams()
    params.append('channel', 'whatsapp');
    params.append('source', wabaPhone);
    params.append('destination', phone);
    params.append('message', msg);
    params.append('src.name', wabaName);
    params.append('disablePreview', false);

    const config = {
        headers: {
            'apikey': apikey,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }

    axios.post('https://api.gupshup.io/sm/api/v1/msg', params, config)
        .then((result) => {
            console.log('Message sent to whatsapp', result.data);
            callbackFunc(result.data);
        })
        .catch((err) => {
            console.log(err);
            callbackFunc(err);
        })
}

module.exports = {
    sendMessageWhatsapp,
}