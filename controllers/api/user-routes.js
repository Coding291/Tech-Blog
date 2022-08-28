const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const { apiAuth } = require('../../utils/auth');

// Get all users GET api/users
router.get('/', apiAuth, (req, res) => {
    User.findAll({
        attributes: {
            exclude: ['password'],
        },
    })
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// get one user GET api/users/1
router.get('/:id', apiAuth, (req, res) => {
    User.findOne({
        where: { user_id: req.params.id },
        attributes: { exclude: ['password'] },
        include: [
            {
                model: Post,
                attributes: [
                    'post_id',
                    'post_title',
                    'post_text',
                    'created_at',
                ],
            },
            {
                model: Comment,
                attributes: ['comment_id', 'comment_text', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['post_title'],
                },
            },
        ],
    })
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// POST /api/users Create new user
router.post('/', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    })
        .then((dbUserData) => {
            // save uses a callback function
            req.session.save(() => {
                // Set session data
                req.session.user_id = dbUserData.user_id;
                req.session.username = dbUserData.username;
                req.session.loggedIn = true;
                // Respond with user data
                res.json(dbUserData);
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// POST login
router.post('/login', (req, res) => {
    // expects {email: 'lernantino@gmail.com', password: 'password1234'}
    User.findOne({
        where: {
            email: req.body.email,
        },
    }).then((dbUserData) => {
        if (!dbUserData) {
            res.status(400).json({
                message: 'No user with that email address!',
            });
            return;
        }
        const validPassword = dbUserData.checkPassword(req.body.password);
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password!' });
            return;
        }

        req.session.save(() => {
            // declare session variables
            req.session.user_id = dbUserData.user_id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json({ user: dbUserData, message: 'You are now logged in!' });
        });
    });
});

// POST logout
router.post('/logout', apiAuth, (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

// change user info - PUT /api/users/1
router.put('/:id', apiAuth, (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}

    // Check if user editing own info, if not return 401 unauthorized
    if (req.session.user_id !== parseInt(req.params.id)) {
        res.status(401).json({ message: 'Not authorized to this user id' });
        return;
    }

    // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
    User.update(req.body, {
        individualHooks: true,
        where: {
            user_id: req.params.id,
        },
    })
        .then((dbUserData) => {
            if (!dbUserData[0]) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// DELETE /api/users/1
router.delete('/:id', apiAuth, (req, res) => {
    // Allow user to delete only their own user_id
    if (req.session.user_id !== parseInt(req.params.id)) {
        res.status(401).json({ message: 'Not authorized to this user id' });
        return;
    }

    User.destroy({
        where: {
            user_id: req.params.id,
        },
    })
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            // Destroy session if successful in deleting user
            req.session.destroy(() => {
                res.status(204).end();
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;