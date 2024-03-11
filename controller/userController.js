const User = require("../model/User");
const jwt = require("jsonwebtoken");

// Error Handler
const handleErrors = (err) => {
  let errMsgs = { email: "", password: "", retypePw: "" }; // ****

  if (err.code === 11000) {
    errMsgs.email = "This email already has signed up an account";
    return errMsgs;
  }

  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      console.log(err.errors);
      errMsgs[properties.path] = properties.message;
    });
  }

  if (err.message.includes('User')) {
    errMsgs.email = err.message;
  }
  
  if (err.message.includes('is incorrect')) {
    errMsgs.password = err.message;
  }

  return errMsgs;
};

const createToken = (id) => {
  const expiresIn = 60 * 60 * 12;
  const secret = "shhh it's secret";
  const token = jwt.sign({ id }, secret, { expiresIn });

  return token;
};

const login = (res, id) => {
  const token = createToken(id);
  res.cookie("jwt", token, {
    httpOnly: true,
  });
};

const login_get = (req, res) => {
  res.render("./user/login", { title: 'login' });
};

const login_post = async (req, res) => {

  try {
    const { email, password } = req.body;
    const user = await User.login(email, password);

    login(res, user._id);
    res.status(200).json({ user });
    
  } catch (err) {
    const errMsgs = handleErrors(err);
    console.log(errMsgs);
    res.status(400).json({ errMsgs });
  }
};

const signup_get = (req, res) => {
  res.render("./user/signup", { title: 'signup' });
};

const signup_post = (req, res) => {
  console.log(req.body);
  const { email, password, retypePw } = req.body;

  const user = new User({ email, password, retypePw });
  user
    .save()
    .then((result) => {
      login(res, result._id);
      res.status(201).json({ user: result._id });
    })
    .catch((err) => {
      const errMsgs = handleErrors(err);
      res.status(400).json({ errMsgs });
    });
};

const logout_get = (req, res) => {
  res.cookie('jwt', '', { expires: new Date(Date.now() - 1000) });
  res.redirect('/');
}

module.exports = {
  login_get,
  login_post,
  signup_get,
  signup_post,
  logout_get
};
