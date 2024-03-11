const secret_get = (req, res) => {
    res.render('./secret/index.ejs', { title: 'secret' });
}

module.exports = secret_get;