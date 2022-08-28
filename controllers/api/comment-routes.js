const router = require('express').Router();
const { User, Comment } = require('../../models');
const { apiAuth } = require('../../utils/auth');

// Get all comments
router.get('/', (req, res) => {
    Comment.findAll({
        include: [
            {
                model: User,
                attributes: ['username'],
            },
        ],
    })
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Create new comment
router.post('/', apiAuth, (req, res) => {
    Comment.create({
        comment_text: req.body.comment_text,
        post_id: req.body.post_id,
        // use the id from the session
        user_id: req.session.user_id,
    })
        .then((dbCommentData) => res.json(dbCommentData))
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
});

// Delete by id only if current user is author of comment
router.delete('/:id', apiAuth, (req, res) => {
    Comment.destroy({
        where: {
            comment_id: req.params.id,
            user_id: req.session.user_id,
        },
    })
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({
                    message: 'No comment with this id for this user',
                });
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;




