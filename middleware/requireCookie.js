const jwt = require('jsonwebtoken');

const requireCookie = (req, res, next) => {
    const token = req.cookies?.jwt;

    if (token) {
        jwt.verify(token, "shhh it's secret", (err, payload) => {
            if (!err) {
                console.log(payload);
                next();
            } else {
                console.log(err.message);
                redirect('/');
            }
        });
    } else {
        res.status(401).redirect('/');
    }
}

module.exports = requireCookie;