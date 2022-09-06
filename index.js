const moment = require("moment");
const { default: axios } = require("axios");

const { parseResponse } = require("./helpers/parseResponse");
const {
  getActivityId,
  getBotResponse,
  conversationId,
} = require("./services/middleware");
const { gettingToken } = require("./services/services");

let condition = 0;
let course = "";
let switchName = false;
let variableUserName = "";
let variableName = "";
let variableTypeResponse = "flow";

async function MessageHandler(context, event) {
  let usermsg;
  console.log(event.messageobj);
  if (event.messageobj.raw.interactive) {
    if (event.messageobj.raw.interactive.type == "button_reply") {
      usermsg = event.message.slice(0, -2);
    }
  } else {
    usermsg = event.message;
  }

  let response;
  let user = event.contextobj.contextid;
  let token = context.simpledb.roomleveldata.token;
  let expires = context.simpledb.roomleveldata.expires;
  let inputHint = context.simpledb.roomleveldata.inputHint;
  let convId = context.simpledb.roomleveldata.convId;

  if (token) {
    if (new moment() >= expires) {
      const tokenDetails = await gettingToken();
      if (tokenDetails) {
        token = tokenDetails.token;
        expires = new moment();
        expires = expires.add(tokenDetails.expires_in, "seconds");
      }
      convId = await conversationId(token);
      if (!convId) {
        return false;
      }
      context.simpledb.roomleveldata.token = token;
      context.simpledb.roomleveldata.expires = expires;
      context.simpledb.roomleveldata.convId = convId;
    }
  } else {
    const tokenDetails = await gettingToken();
    if (tokenDetails) {
      token = tokenDetails.token;
      expires = new moment();
      expires = expires.add(tokenDetails.expires_in, "seconds");
    }

    convId = await conversationId(token);
    if (!convId) {
      return false;
    }
    context.simpledb.roomleveldata.token = token;
    context.simpledb.roomleveldata.convId = convId;
    context.simpledb.roomleveldata.expires = expires;
  }

  const actId = await getActivityId(convId, user, usermsg, inputHint, token);

  if (!actId) {
    return false;
  }

  const botresponses = await getBotResponse(convId, actId, token);
  response = parseResponse(botresponses, context.simpledb.roomleveldata);
  variableName = botresponses[botresponses.length - 1].text;
  console.log(`ESTA ES LA VARIABLE ${variableName}`);

  event.typeResponse = variableTypeResponse;
  event.userName = variableUserName;
  event.isflowCalification = false;

  if (condition === 0 && event.message === "curso") {
    condition = 1;
    course = event.message;
    event.courseName = course;
  } else if (event.message === "salir") {
    condition = 0;
    course = "Bienvenida";
    event.courseName = course;
  } else {
    event.courseName = course;
  }
  ////post to API CosmosDB Azure-Musa
  //Estructura cliente
  axios
    .post("https://musaprod.azurewebsites.net/api/cosmos/upload", {
      document: event,
    })
    .then((res) => {
      if (res.status === 200) {
        console.log(`se ha cargado correctamente a CosmosDB`);
      }
    })
    .catch((error) => {
      console.log(`hubo un error al cargar a la base de datos ${error}`);
    });

  if (botresponses[botresponses.length - 1].suggestedActions) {
    variableTypeResponse = "closed";
  } else if (botresponses[botresponses.length - 1].inputHint) {
    variableTypeResponse = "open";
  } else {
    variableTypeResponse = "flow";
  }

  if (switchName === true) {
    event.userName = event.message;
    switchName = false;
  }

  if (variableName.includes("nombre")) {
    switchName = true;
  }

  // //Estructura de bot
  for (let i = 0; i < botresponses.length; i++) {
    axios
      .post("https://musaprod.azurewebsites.net/api/cosmos/upload", {
        document: botresponses[i],
      })
      .then((res) => {
        if (res.status === 200) {
          console.log(
            `se ha cargado correctamente respuesta de bot a CosmosDB`
          );
        }
      })
      .catch((error) => {
        console.log(`hubo un error al cargar a la base de datos ${error}`);
      });
  }

  context.sendResponse(response);
}

function EventHandler(context, event) {
  context.simpledb.roomleveldata = {};
  context.sendResponse("Respuesta de EventHandler");
}
function HttpResponseHandler(context, event) {
  if (event.geturl === "http://ip-api.com/json")
    context.sendResponse(
      "This is response from http \n" +
        JSON.stringify(event.getresp, null, "\t")
    );
}

function DbGetHandler(context, event) {
  context.sendResponse(
    "testdbput keyword was last sent by:" + JSON.stringify(event.dbval)
  );
}

function DbPutHandler(context, event) {
  context.sendResponse(
    "testdbput keyword was last sent by:" + JSON.stringify(event.dbval)
  );
}

function HttpEndpointHandler(context, event) {
  context.sendResponse(
    "This is response from http \n" + JSON.stringify(event, null, "\t")
  );
}

function LocationHandler(context, event) {
  context.sendResponse("Got location");
}

exports.onMessage = MessageHandler;
exports.onEvent = EventHandler;
exports.onHttpResponse = HttpResponseHandler;
exports.onDbGet = DbGetHandler;
exports.onDbPut = DbPutHandler;
if (typeof LocationHandler == "function") {
  exports.onLocation = LocationHandler;
}
if (typeof HttpEndpointHandler == "function") {
  exports.onHttpEndpoint = HttpEndpointHandler;
}
