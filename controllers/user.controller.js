const User = require('../models/user.model');
const Image = require('../models/image.model');
const { successHandler } = require('../server/handle');
const appError = require('../server/appError');
const bcryptjs = require('bcryptjs');
const request = require('request-promise');
const jwt = require('jsonwebtoken');

// create and save a new post
exports.register = async (req, res, next) => {
  try {
    const { account, password } = req.body;
    const userRepeat = await User.findOne({ account });
    if (userRepeat) {
      return next(appError(401, '帳號重複', next));
    }
    const token = jwt.sign({ account: account }, process.env.JWT_SECRET);

    const user = await User.create({
      account: account,
      password: bcryptjs.hashSync(password, 12),
      token: token,
      uesrName: '',
      birth: '',
      phone: '',
      addres: '',
      mail: '',
      photo: '',
      city: '',
      town: '',
      coupon: '',
    });

    successHandler(res, 'success', user);
  } catch (err) {
    return next(appError(401, err, next));
  }
};

exports.login = async (req, res, next) => {
  try {
    const { account, password } = req.body;
    const user = await User.findOne({ account }).select('+password');
    if (!['', null, undefined].includes(user)) {
      const correct = await bcryptjs.compare(password, user.password);
      if (!user || !correct) {
        return next(appError(400, '密碼錯誤', next));
      }
      successHandler(res, 'success', { user });
    } else {
      return next(appError(400, '無此帳號', next));
    }
  } catch (err) {
    return next(appError(401, err, next));
  }
};

exports.handPassWord = async (req, res, next) => {
  const { oldPassWord, newPassWord, newPassWordAgain, token } = req.body;
  const data = { oldPassWord, newPassWord, newPassWordAgain, token };

  const user = await User.findOne({ token }).select('+password');
  const oldPassWordCorrect = await bcryptjs.compare(
    data.oldPassWord,
    user.password
  );
  const newPassWordCorrect = await bcryptjs.compare(
    data.newPassWord,
    user.password
  );

  const updateNewPassWord = bcryptjs.hashSync(data.newPassWord, 12);

  if (!oldPassWordCorrect) {
    return next(appError(400, '舊密碼錯誤', next));
  }
  if (newPassWordCorrect) {
    return next(appError(400, '新舊密碼不能相同', next));
  }
  const editPassWord = await User.findByIdAndUpdate(user._id, {
    password: updateNewPassWord,
  });
  successHandler(res, 'success', editPassWord);
};

exports.userinfo = async (req, res, next) => {
  const { token } = req.body;
  const userId = await User.find({ token });
  if (userId) {
    successHandler(res, 'success', userId);
  } else {
    return next(appError(400, '無此帳號', next));
  }
};

exports.uploadUser = async (req, res, next) => {
  const { uesrName, birth, phone, addres, mail, photo, token, city, town } =
    req.body;
  const userId = await User.find({ token });

  const editUser = await User.findByIdAndUpdate(userId[0]._id, {
    uesrName: uesrName,
    birth: birth,
    phone: phone,
    addres: addres,
    mail: mail,
    photo: photo,
    token: token,
    city: city,
    town: town,
  });

  successHandler(res, 'success', editUser);
};

exports.uploadUserImage = async (req, res) => {
  const encode_image = req.file.buffer.toString('base64');
  var imgData = {};
  let options = {
    method: 'POST',
    url: 'https://api.imgur.com/3/image',
    headers: {
      Authorization: 'Client-ID 65c720efa8c8d95',
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
  successHandler(res, 'success', imgData);
};
