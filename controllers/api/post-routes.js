const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const { apiAuth } = require('../../utils/auth');

// Get all posts, no authentication
router.get('/', (req, res) => {
    Post.findAll({
        order: [['created_at', 'DESC']],
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
        .then((dbPostData) => res.json(dbPostData))
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Get one post by id (post_id), no authentication required
router.get('/:id', (req, res) => {
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
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Create new post
router.post('/', apiAuth, (req, res) => {
    // expects {post_title: 'Tech Blog is the best!', post_text: 'Tech Blog debut', user_id: 1}
    Post.create({
        post_title: req.body.post_title,
        post_text: req.body.post_text,
        user_id: req.session.user_id,
    })
        .then((dbPostData) => res.json(dbPostData))
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Change post, only if posted by current user
router.put('/:id', apiAuth, (req, res) => {
    Post.update(
        {
            post_title: req.body.post_title,
            post_text: req.body.post_text,
        },
        {
            where: {
                post_id: req.params.id,
                user_id: req.session.user_id,
            },
        }
    )
        .then((dbPostData) => {
            if (!dbPostData) {
                res.status(404).json({
                    message: 'No post found with this id for this user',
                });
                return;
            }
            res.json(dbPostData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Delete post, only if posted by current user
router.delete('/:id', apiAuth, (req, res) => {
    Post.destroy({
        where: {
            post_id: req.params.id,
            user_id: req.session.user_id,
        },
    })
        .then((dbPostData) => {
            if (!dbPostData) {
                res.status(404).json({
                    message: 'No post found with this id for this user',
                });
                return;
            }
            res.json(dbPostData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;