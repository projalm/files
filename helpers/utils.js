const { conversationId } = require("../services/middleware");
const { gettingToken } = require("../services/services");

const renewToken = (context) => {
    let token;
    let expires;
    const tokenDetails = await gettingToken();
    if (tokenDetails) {
        token = tokenDetails.token;
        expires = new moment();
        expires = expires.add(tokenDetails.expires_in, 'seconds');
    }

    let convId = await conversationId(token);
    if (!convId) {
        return false;
    }
    context.token = token;
    context.convId = convId;
    context.expires = expires;

    return { t: token, c: convId, e: expires };
}


module.exports = {
    renewToken
}