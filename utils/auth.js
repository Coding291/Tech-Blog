const withAuth = (req, res, next) => {
	if (!req.session.loggedIn) {
		res.redirect("/login");
	} else {
		next();
	}
};

const apiAuth = (req, res, next) => {
    if (!req.session.user_id) {
        res.status(401).json({ message: 'please log in!' });
    } else {
        next();
    }
};

module.exports = { withAuth, apiAuth };