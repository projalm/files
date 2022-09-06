const { getConvId, startConv, getResponse } = require("./services")

const conversationId = async (token) => {
    const { error, data } = await getConvId(token);

    if (error) {
        return false;
    }

    if (data.conversationId) {
        console.log('convID', data.conversationId);
        return data.conversationId;
    }
}

const getActivityId = async (convId, user, msg, context, token) => {
    const { error, data } = await startConv(convId, user, msg, context, token);

    if (error) {
        return false;
    }

    if (data.id) {
        console.log('actID', data.id);
        return data.id.split('|')[1];
    }
}

const getBotResponse = async (convId, actId, token) => {
    const { error, data } = await getResponse(convId, actId, token);

    if (error) {
        return false;
    }

    if (data.activities) {
        return data.activities;
    }

}


module.exports = {
    conversationId,
    getActivityId,
    getBotResponse
}