const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("../helpers/mailing");
const {
  validateEmail,
  validateLength,
  validatePasswordLength,
} = require("../helpers/validation");
const { generateToken } = require("../helpers/tokens");
const { decrypt, encrypt } = require("../helpers/crptojs");

//@desc get all users
//@route GET /users
//@access private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find() /*.populate("like")*/
    .select("-password")
    .lean();
  if (!users?.length) {
    return res.status(400).json({
      message: "No users found",
    });
  }
  res.json(users);
});

//@desc create a new user
//@route POST /users
//@access private
const createNewUser = asyncHandler(async (req, res) => {
  try {
    const { data } = req.body;

    const userData = await decrypt(data);
    const { ad, soyad, email, password } = userData;

    if (!validateEmail(email)) {
      return res.status(409).json({
        message: "email adresi geçerli değillll",
      });
    }
    //chack for duplicate
    const duplicate = await User.findOne({ email }).lean().exec();
    if (duplicate) {
      return res.status(409).json({ message: "Bu mail adresi kullanımda" });
    }

    if (!validateLength(ad, 3, 30)) {
      return res.status(409).json({
        message: "İsminiz enaz 3 enfazla 30 karakter olabilir",
      });
    }

    if (!validateLength(soyad, 2, 30)) {
      return res.status(409).json({
        message: "Soyadınız enaz 2 enfazla 30 karakter olabilir",
      });
    }

    if (!validatePasswordLength(password, 6, 40)) {
      return res.status(409).json({
        message: "Şifreniz enaz 6 enfazla 40 karakter olabilir",
      });
    }
    //hash password
    const passwordHash = await bcrypt.hash(password, 12);

    const userObject = {
      ad,
      soyad,
      email,
      password: passwordHash,
    };

    //create new user
    const newUser = await new User(userObject).save();
    const emailVerificationToken = await generateToken(
      { id: newUser._id.toString() },
      "30m"
    );
    const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;
    const name = `${newUser.ad} ${newUser.soyad}`;
    const mail = await sendVerificationEmail(newUser.email, name, url);
    const token = await generateToken(
      { id: newUser._id.toString() },
      "31557600000"
    );
    const user = {
      id: newUser._id,
      ad: newUser.ad,
      soyad: newUser.soyad,
      email: newUser.email,
      resim: newUser.resim,
      telefon: newUser.telefon,
      token,
      onayli: newUser.onayli,
      rol: newUser.rol,
      active: newUser.active,
      like: newUser.like,
    };

    const dataCypto = await encrypt(user);

    res.status(201).json({
      data: dataCypto,
      message: "Kayıt Başarılı! lütfen e-postanızı etkinleştirin",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//@desc update a user
//@route PATCH /users
//@access private
const updateUser = asyncHandler(async (req, res) => {
  const {
    id,
    adi,
    soyad,
    email,
    password,
    telefon,
    role,
    active,
    resim,
    like,
  } = req.body;

  if (!id || !adi || !soyad || !email) {
    return res
      .status(400)
      .json({ message: "Lütfen zorunlu alanları doldurun" });
  }

  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({
      message: "Kullanıcı Bulunamadı",
    });
  }

  //chack for duplicate
  const duplicate = await User.findOne({ email }).lean().exec();
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Bu mail adresi kullanımda" });
  }

  user.adi = adi;
  user.soyad = soyad;
  user.email = email;

  //hash password
  if (password) {
    user.password = await bcrypt.hash(password, 12);
  }

  if (typeof active === "boolean") {
    user.active = active;
  }

  if (telefon) {
    user.telefon = telefon;
  }

  if (role) {
    user.role = role;
  }

  if (resim) {
    user.resim = resim;
  }

  const updateUser = await user.save();
  res.json({
    message: `${updateUser.adi} ${updateUser.soyad} kullanıcısı güncellendi`,
  });
});

//@desc delete a user
//@route DELETE /users
//@access private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "kullanıcı ID zorunludur" });
  }

  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: "kullanıcı bulunamadı" });
  }

  const deleteUser = await user.deleteOne();
  const messages = `${deleteUser.adi} ${deleteUser.soyad} ait ${deleteUser._id} ID numaralı kullanıcı silindi`;
  res.json({ message: messages });
});

//@desc activate a user
//@route POST /activate
//@access private
const activateUser = asyncHandler(async (req, res) => {
  const { token } = req.body;
  const userId = jwt.verify(token, process.env.TOKEN_SECRET);
  const user = await User.findById(userId.id).exec();
  if (user.onayli == true) {
    return res.status(400).json({ message: "e-posta adresiniz onaylı" });
  }

  user.onayli = true;
  await user.save();
  res.status(200).json({ message: "e-posta adresiniz onaylandı" });
});

//@desc login a user
//@route POST /login
//@access private
const loginUser = asyncHandler(async (req, res) => {
  const { data } = req.body;
  const userData = await decrypt(data);
  const { email, password } = userData;
  const user = await User.findOne({ email }).exec();
  try {
    if (!user) {
      return res.status(400).json({ message: "Email adresi bulunamadı" });
    }
    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      return res
        .status(400)
        .json({ message: "Şifreniz yanlış lütfen kontrol ediniz" });
    }

    const token = await generateToken(
      { id: user._id.toString() },
      "31557600000"
    );

    const cryptData = await encrypt({
      id: user._id,
      ad: user.ad,
      soyad: user.soyad,
      email: user.email,
      resim: user.resim,
      telefon: user.telefon,
      token,
      onayli: user.onayli,
      rol: user.rol,
      active: user.active,
      like: user.like,
    });

    res.status(200).json({
      data: cryptData,
      message: `Hoşgeldin ${user.ad} ${user.soyad}`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
  activateUser,
  loginUser,
};
