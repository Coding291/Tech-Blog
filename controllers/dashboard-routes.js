const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const { withAuth } = require('../utils/auth');

// Get all posts for current logged in user, for the dashboard
router.get('/', withAuth, (req, res) => {
    Post.findAll({
        where: {
            // use the ID from the session
            user_id: req.session.user_id,
        },
        attributes: ['post_id', 'post_title', 'post_text', 'created_at'],
        include: [
            {
                model: Comment,
                attributes: [
                    'comment_id',
                    'comment_text',
                    'post_id',
                    'user_id',
                    'created_at',
                ],
                include: {
                    model: User,
                    attributes: ['username'],
                },
            },
            {
                model: User,
                attributes: ['username'],
            },
        ],
    })
        .then((dbPostData) => {
            // serlialize data before passing to template
            const posts = dbPostData.map((post) => post.get({ plain: true }));
            res.render('dashboard', { posts, loggedIn: true });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Edit one post
router.get('/edit/:id', withAuth, (req, res) => {
    Post.findOne({
        where: {
            post_id: req.params.id,
        },
        attributes: ['post_id', 'post_title', 'post_text', 'created_at'],
        include: [
            {
                model: Comment,
                attributes: [
                    'comment_id',
                    'comment_text',
                    'post_id',
                    'user_id',
                    'created_at',
                ],
                include: {
                    model: User,
                    attributes: ['username'],
                },
            },
            {
                model: User,
                attributes: ['username'],
            },
        ],
    })
        .then((dbPostData) => {
            // serlialize data before passing to template
            const post = dbPostData.get({ plain: true });
            res.render('edit-post', { post, loggedIn: true });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Delete one post
router.get('/delete/:id', withAuth, (req, res) => {
    Post.destroy({
        where: { post_id: req.params.id },
    })
        .then(() => {
            res.redirect('/dashboard');
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;