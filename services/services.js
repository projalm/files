const { default: axios } = require("axios");

// const SECRET = `vpNLlsG-Bf0.UvBv030PpoCW0Rs9yofd8Z-naRs8jk85GbwS-pjAEWI`; key del primer bot
// const SECRET = `nUrCwT-0yQE.KGNpBnsQeG80VhbQZkaTeo5K9iqvMS_96d6GdSV_64s`; Bot Bienestar
const SECRET = `1SCyxsJ6PZ0.w9hBMOnpkBKf7TDmR4CTtu0Yh6ovK-WZBk-osiGohf4`; //BOT BIENESTAR AZURE FUNTIONS
const baseUrl = "https://directline.botframework.com/v3/directline";
//
const config = {
  "Content-Type": "application/json",
};
const USERNAME = "";
const PASS = "";

const getToken = async () => {
  return axios
    .post(
      `${baseUrl}/tokens/generate`,
      {},
      {
        headers: {
          Authorization: `Bearer ${SECRET}`,
          ...config,
        },
      }
    )
    .then((res) => {
      console.log("Getingo token");
      return { error: null, data: res.data };
    })
    .catch((err) => {
      console.error(err);
      return { error: err };
    });
};

const gettingToken = async () => {
  const { error, data } = await getToken();

  if (error) {
    return false;
  }

  if (data.token) {
    return data;
  }
};

const getConvId = async (token) => {
  // const token = await gettingToken();

  // if (!token) {
  //     return false;
  // }

  return axios
    .post(
      `${baseUrl}/conversations`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          ...config,
        },
      }
    )
    .then((res) => {
      console.log("Getting conversation");
      return { error: null, data: res.data };
    })
    .catch((err) => {
      console.error(err);
      return { error: err };
    });
};

const startConv = async (convId, user, msg, context, token) => {
  // const token = await gettingToken();

  // if (!token) {
  //     return false;
  // }

  const body = {
    locale: "en-EN",
    type: "message",
    from: {
      id: user,
    },
    text: msg,
  };

  if (context) body["inputHint"] = context;

  console.log(body);
  return axios
    .post(`${baseUrl}/conversations/${convId}/activities`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...config,
      },
    })
    .then((res) => {
      //console.log(res.data);
      return { error: null, data: res.data };
    })
    .catch((err) => {
      console.error(err);
      return { error: err };
    });
};

const getResponse = async (convId, actId, token) => {
  // const token = await gettingToken();

  // if (!token) {
  //     return false;
  // }

  return await axios
    .get(`${baseUrl}/conversations/${convId}/activities?watermark=${actId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      //console.log(res.data);
      return { error: null, data: res.data };
    })
    .catch((err) => {
      console.error(err);
      return { error: err };
    });
};

module.exports = {
  gettingToken,
  getConvId,
  startConv,
  getResponse,
};
