const richResponses = {
  image: (url) => {
    return `{"type":"image","originalUrl":"${url}","previewUrl":"${url}"}`;
  },
  audio: (url) => {
    return `{ "type": "audio", "url": "${url}" }`;
  },
  video: (url) => {
    return `{ "type": "video", "url": "${url}" }`;
  },
  file: (url) => {
    return `{ "type": "file", "url": "${url}" }`;
  },
  text: (text) => {
    return `{ "type":"text", "text":"${text}" }`;
  },
  quickReplyImg: (qr, header, url) => {
    return `{ "type": "quick_reply", "msgid": "quickreply", "content": { "type": "image", "text": ".", "url":"${url}", "caption": "" }, "options": [${qr}] }`;
  },
  quickReply: (qr, header, text) => {
    return `{ "type": "quick_reply", "msgid": "quickreply", "content": { "type": "text", "header": "${header}", "text": "${text}", "caption": "" }, "options": [${qr}] }`;
  },
  list: (options, title, body, optionsTitle) => {
    return `{ "type": "list", "title": "${title}", "body": "${body}", "msgid": "list", "globalButtons": [ { "type": "text", "title": "${optionsTitle}" } ], "items": [ { "title": "${optionsTitle}", "subtitle": "first Subtitle", "options": [ ${options} ] } ] }`;
  },
};

module.exports = {
  richResponses,
};
