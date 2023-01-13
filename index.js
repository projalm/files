const moment = require("moment");
const { default: axios } = require("axios");
const { parseResponse } = require("./helpers/parseResponse");
const {
  getActivityId,
  getBotResponse,
  conversationId,
} = require("./services/middleware");
const { gettingToken } = require("./services/services");

//VALORS JSON COMPOSER A AGREGAR
const SECRET = `1SCyxsJ6PZ0.w9hBMOnpkBKf7TDmR4CTtu0Yh6ovK-WZBk-osiGohf4`;
let condition = 0;
let timerPermission = true;
let timerTomorrow = "";
let course = "";
let switchName = false;
let variableUserName = "";
let variableName = "";
let variableTypeResponse = "flow";
let borrar;
let startUser = "";
let endUser = "0";
let entityUser = "0";
let entityBot = "0";
let typeResponseUser = "0";
let typeResponseBot = "0";
// let orderUsuario;
// let userName = "";
// let eventCodEvaluation = "";
// let eventSurvey = false;
// let deleteExtraCaracter = false; //SE USA PARA ELIMINAR EL NUMERO QUE SE INSERTA A LAS RESPUESTA DE BOTONES
let IdConversation = "";
// let dni = "";
// let dniUploaded = false;
///////////////////////////////////

async function MessageHandler(context, event) {
  //SETEAMOS LOS DIAS PARA EL ACCESO A CADA CURSO POR DIA
  // const setTimer = new Date();

  // if (setTimer.getDate() === timerTomorrow) {
  //   let time = new Date();
  //   let todayday = time.getDate();
  //   timerToday = todayday.getDate() + 1;
  //   timerPermission = true;
  // }
  //EN CASO DE QUE EL CLIENTE QUIERA BORRAR SU COVERSACION SE DECLARA ESTA CONDICIONAL
  // let deleteConvId = context.simpledb.roomleveldata.deleteConvId;
  // context.simpledb.roomleveldata = {};

  // context.simpledb.roomleveldata = {};
  // if (deleteConvId === undefined) {
  //   context.simpledb.roomleveldata = {};
  //   context.simpledb.roomleveldata.deleteConvId = true;
  // }

  let borrar = context.simpledb.roomleveldata.borrar;

  if (borrar === undefined) {
    context.simpledb.roomleveldata = {};
    context.simpledb.roomleveldata.borrar = false;
  }

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
  let courseIn = context.simpledb.roomleveldata.courseIn;
  let userName = context.simpledb.roomleveldata.userName;
  let eventCodEvaluation = context.simpledb.roomleveldata.eventCodEvaluation;
  let eventSurvey = context.simpledb.roomleveldata.eventSurvey;
  let dni = context.simpledb.roomleveldata.dni;
  let dniUploaded = context.simpledb.roomleveldata.dniUploaded;
  let deleteExtraCaracter = context.simpledb.roomleveldata.deleteExtraCaracter;
  let orderUsuario = context.simpledb.roomleveldata.orderUsuario;
  let rut = context.simpledb.roomleveldata.rut;
  let rutUploaded = context.simpledb.roomleveldata.rutUploaded;
  let menuPrevio = context.simpledb.roomleveldata.menuPrevio;

  //DECLARAMOS FALSE LA PRIMERA INTERACCION PORQUE DEBE IDENTIFICARSE DESDE SIEMPRE, YA LUEGO NO VUELVE A ENTRAR PORQUE
  //SIEMPRE ESTARA DEFINIDA
  if (eventSurvey !== true && eventSurvey !== false) {
    context.simpledb.roomleveldata.eventSurvey = false;
  }
  //PARA QUE NO DE ERROR EN LA PRIMERA INTERACCION QUE NO EXISTE SUBIDA DEL DNI
  if (dniUploaded !== true && dniUploaded !== false) {
    context.simpledb.roomleveldata.dniUploaded = false;
  }

  if (rutUploaded !== true && rutUploaded !== false) {
    context.simpledb.roomleveldata.rutUploaded = false;
  }

  if (deleteExtraCaracter !== true && deleteExtraCaracter !== false) {
    context.simpledb.roomleveldata.deleteExtraCaracter = false;
  }

  // if (token) {
  //   if (new moment() >= expires) {
  //     const tokenDetails = await gettingToken();
  //     if (tokenDetails) {
  //       token = tokenDetails.token;
  //       expires = new moment();
  //       expires = expires.add(tokenDetails.expires_in, "seconds");
  //       console.log("TOKEN ACTUALIZADA");
  //     }
  //     convId = await conversationId(SECRET);
  //     if (!convId) {
  //       return false;
  //     }
  //     context.simpledb.roomleveldata.token = token;
  //     context.simpledb.roomleveldata.expires = expires;
  //     context.simpledb.roomleveldata.convId = convId;
  //     console.log("CONVERSACION CON TOKEN ACTUALIZADO");
  //   }
  // } else {
  //   const tokenDetails = await gettingToken();
  //   if (tokenDetails) {
  //     token = tokenDetails.token;
  //     expires = new moment();
  //     expires = expires.add(tokenDetails.expires_in, "seconds");
  //     console.log("TOKEN");
  //   }

  //   convId = await conversationId(SECRET);
  //   if (!convId) {
  //     return false;
  //   }
  //   context.simpledb.roomleveldata.token = token;
  //   context.simpledb.roomleveldata.convId = convId;
  //   context.simpledb.roomleveldata.expires = expires;
  //   console.log("CONVERSACION CON TOKEN");
  // }

  if (!convId) {
    convId = await conversationId(SECRET);
    if (!convId) {
      return false;
    }
    console.log("OBTENEMOS ID");
    context.simpledb.roomleveldata.convId = convId;
  }

  const actId = await getActivityId(convId, user, usermsg, inputHint, SECRET);
  console.log("CONVERSACIONID");
  if (!actId) {
    return false;
  }

  let stamp = event.messageobj.timestamp;
  let stamp2 = stamp.toString();
  let stamp3 = stamp2.slice(0, -3);
  definitiveStamp = parseInt(stamp3);
  event.messageobj.timestamp = definitiveStamp;

  //LOGICA COMPOSER---AGREGANDO VALORES JSON

  const botresponses = await getBotResponse(convId, actId, SECRET);
  response = parseResponse(botresponses, context.simpledb.roomleveldata);
  variableName = botresponses[botresponses.length - 1].text;

  for (let i = 0; i < botresponses.length; i++) {
    if (botresponses[i].speak.includes("name")) {
      let global;
      let globalJson;
      global = botresponses[i].speak;
      console.log(global);
      globalJson = JSON.parse(global);
      // userName = globalJson.name;
      // userName = globalJson.name;
      context.simpledb.roomleveldata.userName = globalJson.name;
      userName = context.simpledb.roomleveldata.userName;
    }
    if (botresponses[i].speak.includes("curso")) {
      let global;
      let globalJson;
      global = botresponses[i].speak;
      globalJson = JSON.parse(global);
      context.simpledb.roomleveldata.courseIn = globalJson.curso;
      courseIn = context.simpledb.roomleveldata.courseIn;
    }
    if (botresponses[i].attachments) {
      botresponses[i].text = botresponses[i].attachments[0].content.text;
    }
    if (botresponses[i].speak.includes("order")) {
      let global;
      let globalJson;
      global = botresponses[i].speak;
      globalJson = JSON.parse(global);
      botresponses[i].order_course = globalJson.order;
    }

    if (botresponses[i].speak.includes("score")) {
      let global;
      let globalJson;
      global = botresponses[i].speak;
      console.log(global);
      globalJson = JSON.parse(global);
      event.score = globalJson.score;
    }

    if (botresponses[i].speak.includes("codEvaluation")) {
      let global;
      let globalJson;
      global = botresponses[i].speak;
      globalJson = JSON.parse(global);
      console.log(globalJson.codEvaluation);
      botresponses[i].codEvaluation = globalJson.codEvaluation;
    } else {
      botresponses[i].codEvaluation = "";
    }

    if (botresponses[i].speak.includes("calification")) {
      botresponses[i].isflowCalification = true;
    } else {
      botresponses[i].isflowCalification = false;
    }

    if (botresponses[i].speak.includes("survey")) {
      botresponses[i].isflowSurvey = true;
    } else {
      botresponses[i].isflowSurvey = false;
    }

    if (botresponses[i].speak.includes("dni")) {
      let global;
      let globalJson;
      global = botresponses[i].speak;
      console.log(global);
      globalJson = JSON.parse(global);
      // dni = globalJson.dni;
      context.simpledb.roomleveldata.dni = globalJson.dni;
      dni = context.simpledb.roomleveldata.dni;
    }

    if (botresponses[i].speak.includes("rdt")) {
      let global;
      let globalJson;
      global = botresponses[i].speak;
      console.log(global);
      globalJson = JSON.parse(global);
      context.simpledb.roomleveldata.rut = globalJson.rdt;
      rut = context.simpledb.roomleveldata.rut;
    }

    if (botresponses[i].speak.includes("start")) {
      startUser = "1";
    } else {
      startUser = "0";
    }

    if (botresponses[i].speak.includes("menuPrevio")) {
      let global;
      let globalJson;
      global = botresponses[i].speak;
      console.log(global);
      globalJson = JSON.parse(global);
      context.simpledb.roomleveldata.menuPrevio = globalJson.menuPrevio;
      menuPrevio = context.simpledb.roomleveldata.menuPrevio;
    }

    botresponses[i].responseTo = event.messageobj.from;
    botresponses[i].timestamp = definitiveStamp;
    botresponses[i].from.id = courseIn;
    botresponses[i].from.name = courseIn;
    botresponses[i].courseName = courseIn;
    botresponses[i].actualRoute = "";
    botresponses[i].typeFlow = "";
  }

  //LA PRIMERA INTERACCION CON EL BOT ES DEL USUARIO, SE HACE ESTA LOGICA PARA EMPAREJARLA CON EL ORDER CORRECTO DEL USUARIO
  // let orderUsuario = +botresponses[0].order_course - 1;

  // let orderDefinitivo = orderUsuario - botresponses.length;

  let sender = event.messageobj.from;

  event.order_course = `${orderUsuario}`;
  event.courseName = courseIn;
  event.userName = userName;
  event.id = event.messageobj.id;
  event.typeResponse = variableTypeResponse;
  event.codEvaluation = eventCodEvaluation;
  event.typeFlow = "";
  event.actualRoute = "";
  // event.messageobj.from = botresponses[botresponses.length - 1].responseTo;

  // event.userName = variableUserName;
  event.isflowCalification =
    botresponses[botresponses.length - 1].isflowCalification;
  event.isflowSurvey = eventSurvey;
  event.order_answer = "";
  //SE HACE ESTA CONDICION PARA EL CAMPO SCORE, YA QUE DEPENDERA SI LAS RESPUESTAS DEL CHATBOT TRAEN ALGUNA PUNTUACION, EN CASO DE QUE EXISTAN NO ENTRARA
  // A ESTA CONDICION Y SE LLENARA CON LA PUNTUACION QUE ENVIE EL CHATBOT, DE LO CONTRARIO, ENTRARA A ESTA CONDICION Y SE ENVIARA VACIO
  if (!event.score) {
    event.score = "";
  }

  context.simpledb.roomleveldata.orderUsuario =
    +botresponses[botresponses.length - 1].order_course + 1;

  //QUITAR LOS NUMEROS QUE SE ESTA GUARDANDO EN LA BD YA QUE NO DEBERIA ENVIARLOS

  if (deleteExtraCaracter === true) {
    event.messageobj.text = event.messageobj.text.slice(0, -2);
    event.message = event.message.slice(0, -2);
  }

  if (botresponses[botresponses.length - 1].suggestedActions) {
    context.simpledb.roomleveldata.deleteExtraCaracter = true;
  } else {
    context.simpledb.roomleveldata.deleteExtraCaracter = false;
  }

  // POST DE DOCUMENTO DEL USUARIO
  // if (dniUploaded === false && dni) {
  //   await axios
  //     .post("https://musaprod.azurewebsites.net/api/user/dni", {
  //       phone: event.messageobj.from,
  //       document: dni,
  //     })
  //     .then((res) => {
  //       if (res.message === 200) {
  //         console.log(res);
  //         console.log(
  //           `se ha cargado documento exitosamente ${JSON.stringify(res)}`
  //         );
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(`hubo un error al cargar el documento ${error}`);
  //     });

  //   context.simpledb.roomleveldata.dniUploaded = true;
  // }

  // https://musaqa.azurewebsites.net/api/welcome/rut
  // https://musaprod.azurewebsites.net/api/welcome/bot

  if (rutUploaded === false && rut) {
    await axios
      .post(
        "https://musaqa.azurewebsites.net/api/welcome/rut",
        {
          phone: event.messageobj.from,
          rut: rut,
        }
        // {
        // phone: event.messageobj.from,
        // email: "",
        // role: "",
        // company: "Falabella",
        // document: rut,
        // source: "Falabella1",
        // name: context.simpledb.roomleveldata.userName,
        // }
      )
      .then((res) => {
        if (res.message === 200) {
          console.log(res);
          console.log(`se ha cargado rut exitosamente ${JSON.stringify(res)}`);
        }
      })
      .catch((error) => {
        console.log(`hubo un error al cargar el rut ${error}`);
      });

    context.simpledb.roomleveldata.rutUploaded = true;
  }

  // https://musaprod.azurewebsites.net/api/cosmos/upload
  // https://musaprod.azurewebsites.net/api/sql/user
  //musaprod.azurewebsites.net/api/sql/user
  //post to API CosmosDB Azure-Musa
  // Estructura cliente
  if (
    courseIn != "bienvenida" &&
    courseIn != "" &&
    courseIn !== "Menu Principal - Modulos" &&
    event.order_course !== "NaN" &&
    event.order_course !== "null"
  ) {
    await axios
      .post("https://musaqa.azurewebsites.net/api/sql/user", {
        document: event,
      })
      .then((res) => {
        if (res.status === 200) {
          console.log(res);
          console.log(
            `se ha cargado interaccion usuario correctamente a la base de datos`
          );
        }
      })
      .catch((error) => {
        console.log(
          `hubo un error al cargar interaccion usuario a la base de datos ${error}`
        );
      });
  }

  // CARGA DE DATA DEL FLUJO DE BIENVENIDA USER

  if (courseIn === "bienvenida") {
    await axios
      .post("https://musaqa.azurewebsites.net/api/sql/userPreview", {
        document: {
          id: event.id,
          channel: "whatsapp",
          sender: event.messageobj.from,
          receiver: "56947582733",
          message: event.message,
          order: "0",
          start: "0",
          end: endUser,
          customer: "Falabella",
          learning: "0",
          entity: entityUser,
          menu: menuPrevio,
          botname: event.botname,
          displayname: event.senderobj.display,
          typeResponse: typeResponseUser,
          typeInteraction: "user",
        },
      })
      .then((res) => {
        if (res.message === 200) {
          console.log(res);
          console.log(
            `se ha cargado flujo previo exitosamente ${JSON.stringify(res)}`
          );
        }
      })
      .catch((error) => {
        console.log(`hubo un error al cargar el flujo de previo ${error}`);
      });
  }

  //PARA RECONOCER CUANDO DE UNA PREGUNTA ABIERTA O CERRADA

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

  // if (variableName.includes("nombre")) {
  //   switchName = true;
  // }

  // GENERACION DE CERTIFICADO EN CASO DE QUE HAYA CULMINADO EL CURSO
  // if (botresponses[0].text.includes("100%")) {
  //   await axios
  //     .post("https://musaprod.azurewebsites.net/api/generate/certificate", {
  //       name_user: userName,
  //       course_name: courseIn,
  //       resource: courseIn,
  //       phone: sender,
  //     })
  //     .then((res) => {
  //       if (res.status === 200) {
  //         console.log(`se ha generado correctamente un certificado`);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(`ha ocurrido un error al generar certificado ${error}`);
  //     });
  // }
  console.log("TEST DE BASE DE DATOS");
  // https://musaprod.azurewebsites.net/api/cosmos/upload
  // https://musaprod.azurewebsites.net/api/sql/bot
  // Estructura de bot
  if (courseIn != "bienvenida") {
    for (let i = 0; i < botresponses.length; i++) {
      // await axios
      //   .post("https://musaprod.azurewebsites.net/api/cosmos/upload", {
      //     document: botresponses[i],
      //   })
      //   .then((res) => {
      //     if (res.status === 200) {
      //       console.log(
      //         `se ha cargado correctamente interaccion bot a SQL ${JSON.stringify(
      //           res
      //         )}`
      //       );
      //     }
      //   })
      //   .catch((error) => {
      //     console.log(
      //       `hubo un error al cargar interaccion usuario a la base de datos ${error}`
      //     );
      //   });
      await axios
        .post("https://musaqa.azurewebsites.net/api/sql/bot", {
          document: botresponses[i],
        })
        .then((res) => {
          if (res.status === 200) {
            console.log(`se ha cargado correctamente interaccion bot a SQL`);
          }
        })
        .catch((error) => {
          console.log(
            `hubo un error al cargar interaccion bot a la base de datos ${error}`
          );
        });
    }
  }

  // CARGAR FLUJO PREVIO DE LA INTERACCION DEL BOT
  if (courseIn === "bienvenida") {
    for (let i = 0; i < botresponses.length; i++) {
      let startBot;
      let endBot;

      if (botresponses[i].speak.includes("start")) {
        startBot = "1";
      } else {
        startBot = "0";
      }

      if (botresponses[i].speak.includes("end")) {
        endBot = "1";
      } else {
        endBot = "0";
      }

      if (botresponses[i].speak.includes("entity")) {
        let global;
        let globalJson;
        global = botresponses[i].speak;
        console.log(global);
        globalJson = JSON.parse(global);
        entityBot = globalJson.entity;
      } else {
        entityBot = "0";
      }

      if (botresponses[i].speak.includes("typeResponse")) {
        let global;
        let globalJson;
        global = botresponses[i].speak;
        console.log(global);
        globalJson = JSON.parse(global);
        typeResponseBot = globalJson.typeResponse;
      } else {
        typeResponseBot = "read";
      }

      await axios
        .post("https://musaqa.azurewebsites.net/api/sql/botPreview", {
          document: {
            id: botresponses[i].id,
            channel: "whatsapp",
            sender: "56947582733",
            receiver: event.messageobj.from,
            message: botresponses[i].text,
            order: "0",
            start: startBot,
            end: endBot === "1" ? "0" : endBot,
            customer: "Falabella",
            learning: "0",
            entity: entityBot,
            menu: menuPrevio,
            botname: event.botname,
            displayname: "",
            typeResponse: typeResponseBot,
            typeInteraction: "bot",
          },
        })
        .then((res) => {
          if (res.status === 200) {
            console.log(`se ha cargado correctamente interaccion bot a SQL`);
          }
        })
        .catch((error) => {
          console.log(
            `hubo un error al cargar interaccion bot a la base de datos ${error}`
          );
        });
    }
  }

  //SE COLOCA EL CODEVALUATION LUEGO DEL POST YA QUE EN ESTA INTERACCION NO ESTA LA RESPUESTA DEL USUARIO QUE DEBE LLEVAR
  //EL CAMPO DE EVALUACION, PARA LA SIGUIENTE RESPUESTA DEL USUARIO SI LLEVARA EL CODEVALUATION PORQUE ESTARA RESPONDIENDO
  //A LA PREGUNTA QUE SE VA A EVALUAR
  for (let i = 0; i < botresponses.length; i++) {
    if (botresponses[i].speak.includes("codEvaluation")) {
      context.simpledb.roomleveldata.eventCodEvaluation =
        botresponses[botresponses.length - 1].codEvaluation;
    } else {
      context.simpledb.roomleveldata.eventCodEvaluation = "";
    }

    if (botresponses[i].speak.includes("survey")) {
      context.simpledb.roomleveldata.eventSurvey = true;
    } else {
      context.simpledb.roomleveldata.eventSurvey = false;
    }

    if (botresponses[i].speak.includes("end")) {
      endUser = "1";
    } else {
      endUser = "0";
    }

    if (botresponses[i].speak.includes("entity")) {
      let global;
      let globalJson;
      global = botresponses[i].speak;
      console.log(global);
      globalJson = JSON.parse(global);
      entityUser = globalJson.entity;
    } else {
      entityUser = "0";
    }

    if (botresponses[i].speak.includes("typeResponse")) {
      let global;
      let globalJson;
      global = botresponses[i].speak;
      console.log(global);
      globalJson = JSON.parse(global);
      typeResponseUser = globalJson.typeResponse;
    } else {
      typeResponseUser = "read";
    }

    // if (botresponses[i].text.includes("100%")) {
    //   timerPermission = false;
    // }
  }

  /////////////////////////////////////////////////////////
  console.log(`ESTA ES LA RESPUSETA DEL USUARIO ${JSON.stringify(event)}`);
  console.log(`ESTA ES LA INTERACCION DEL BOT ${JSON.stringify(botresponses)}`);

  //SE UTILIZA ESTA FUNCION COMO TIMER QUE SOLO RESPONDE TEXTO YA QUE SI sendResponse ESTA DETRO DEL TIMER NO ENVIA EL MSG AL USUARIO (AUN NO SE USA, FUNCIONA
  //EN LOCAL PERO NO EN PRODUCCION)

  // let texto = [{ text: "texto 1" }, { text: "texto 2" }];

  // const responseTimer = () => {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       context.sendResponse(response);
  //     }, 800);
  //   });
  // };

  console.log(`ESTE ES EL RESPONSE ${response}`);

  let timeout = 1000;
  var userConfig = { apikey: "64lynois5mtrptmp0dyydysdk9ac78on" };

  if (response.length > 1) {
    if (response.length === 2) {
      context.sendMessage(userConfig, event.contextobj, response[0], (res) => {
        setTimeout(() => {
          context.sendResponse(response[1]);
        }, 3000);
      });
    }

    if (response.length === 3) {
      context.sendMessage(userConfig, event.contextobj, response[0], (res) => {
        setTimeout(() => {
          context.sendMessage(
            userConfig,
            event.contextobj,
            response[1],
            (res) => {
              setTimeout(() => {
                context.sendResponse(response[2]);
              }, 3000);
            }
          );
        }, 3000);
      });
    }
    if (response.length === 4) {
      context.sendMessage(userConfig, event.contextobj, response[0], (res) => {
        setTimeout(() => {
          context.sendMessage(
            userConfig,
            event.contextobj,
            response[1],
            (res) => {
              setTimeout(() => {
                context.sendMessage(
                  userConfig,
                  event.contextobj,
                  response[2],
                  (res) => {
                    setTimeout(() => {
                      context.sendResponse(response[3]);
                    }, 3000);
                  }
                );
              }, 3000);
            }
          );
        }, 3000);
      });
    }
  } else {
    context.sendResponse(response);
  }
}

// for (let i = 0; i < response.length; i++) {
//   setTimeout(() => {
//     context.sendResponse(response[i]);
//   }, 300);
// }

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
