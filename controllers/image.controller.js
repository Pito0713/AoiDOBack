const { successHandler, errorHandler } = require("../server/handle");
const Image = require("../models/image.model");
const request = require("request-promise");

exports.allImage = async (req, res) => {
  try {
    const allImage = await Image.find();
    successHandler(res, "success", allImage);
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.uploadImage = async (req, res) => {
  const encode_image = req.file.buffer.toString("base64");
  var imgData = {};
  let options = {
    method: "POST",
    url: "https://api.imgur.com/3/image",
    headers: {
      Authorization: "Client-ID 65c720efa8c8d95",
    },
    formData: {
      image: encode_image,
    },
  };
  await request(options, function (error, response) {
    if (error) throw new Error(error);
    imgurRes = JSON.parse(response.body);
    imgData = {
      imageName: req.file.originalname,
      imageUrl: imgurRes.data.link,
    };
  });
  const newImage = await Image.create(imgData);
  successHandler(res, "success", imgData);
};
