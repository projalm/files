const { conversationId } = require("../services/middleware");
const { gettingToken } = require("../services/services");

const renewToken = async (context) => {
  let token;
  let expires;
  const tokenDetails = await gettingToken();
  if (tokenDetails) {
    token = tokenDetails.token;
    expires = new moment();
    expires = expires.add(tokenDetails.expires_in, "seconds");
  }

  let convId = await conversationId(token);
  if (!convId) {
    return false;
  }
  context.token = token;
  context.convId = convId;
  context.expires = expires;

  return { t: token, c: convId, e: expires };
};

const timerPerDay = () => {
  if (setTimer.getDate() === timerTomorrow) {
    let time = new Date();
    let todayday = time.getDate();
    timerToday = todayday.getDate() + 1;
    timerPermission = true;
  }
};

const generateCertificate = async () => {
  if (botresponses[0].text.includes("100%")) {
    await axios
      .post("https://musaprod.azurewebsites.net/api/generate/certificate", {
        name_user: userName,
        course_name: courseIn,
        resource: courseIn,
        phone: sender,
      })
      .then((res) => {
        if (res.status === 200) {
          console.log(`se ha generado correctamente un certificado`);
        }
      })
      .catch((error) => {
        console.log(`ha ocurrido un error al generar certificado ${error}`);
      });
  }
};

module.exports = {
  renewToken,
};
