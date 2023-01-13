const { richResponses } = require("../richResponses");

const parseResponse = (botMessages, context) => {
  //qr{ "type": "text", "title": "dfg" }
  //list{ "type": "text", "title": "title", "description": "", "postbackText": "d" }
  let messages = [];
  console.log("mensajes", botMessages);
  for (const botMsg of botMessages) {
    let msg;
    if (botMsg.inputHint) {
      context.inputHint = botMsg.inputHint;
    } else {
      context.inputHint = null;
    }
    if (botMsg.suggestedActions) {
      msg = parseButtons(botMsg.suggestedActions.actions, botMsg.text);
      messages = [...messages, ...msg];
    } else if (botMsg.text) {
      msg = botMsg.text;
      messages = [...messages, richResponses.text(msg)];
    } else if (botMsg.attachments[0].content.buttons) {
      msg = parseButtonsImg(
        botMsg.attachments[0].content.buttons,
        botMsg.attachments[0].content.images[0].url
      );
      messages = [...messages, ...msg];
    } else if (botMsg.attachments) {
      msg = parseAttachments(botMsg.attachments);
      messages = [...messages, ...msg];
    }
  }

  return messages;
};

const parseAttachments = (attachments) => {
  let imgArray = [];
  for (const attachment of attachments) {
    let images = attachment.content.images;
    for (const img of images) {
      imgArray = [...imgArray, richResponses.image(img.url)];
    }
  }

  return imgArray;
};

const parseButtons = (buttons, title) => {
  let buttonArray = [];
  let len = buttons.length;
  if (len <= 3) {
    let qr = "";
    for (const button of buttons) {
      qr += `{ "type":"text", "title":"${button.title}", "postbackText": "${button.title}" },`;
    }
    qr = qr.slice(0, -1);
    buttonArray = [...buttonArray, richResponses.quickReply(qr, "", title)];
  } else if (len <= 10) {
    let options = "";
    for (const button of buttons) {
      options += `{ "type":"text", "title":"${button.title}", "description":"", "postbackText":"${button.title}" },`;
    }
    options = options.slice(0, -1);
    buttonArray = [...buttonArray, richResponses.list(options, "", title)];
  } else {
    buttonArray = [...buttonArray, richResponses.text(title)];
  }

  return buttonArray;
};

const parseButtonsImg = (buttons, url) => {
  let buttonArray = [];
  let len = buttons.length;
  if (len <= 3) {
    let qr = "";
    for (const button of buttons) {
      qr += `{ "type":"text", "title":"${button.title}", "postbackText": "${button.title}" },`;
    }
    qr = qr.slice(0, -1);
    buttonArray = [...buttonArray, richResponses.quickReplyImg(qr, "", url)];
  } else if (len <= 10) {
    let options = "";
    for (const button of buttons) {
      options += `{ "type":"text", "title":"${button.title}", "description":"", "postbackText":"${button.title}" },`;
    }
    options = options.slice(0, -1);
    buttonArray = [...buttonArray, richResponses.list(options, "", title)];
  } else {
    buttonArray = [...buttonArray, richResponses.text(title)];
  }

  return buttonArray;
};

module.exports = {
  parseResponse,
};
