const router = require("express").Router();
const { Comment } = require("../../models");
const withAuth = require("../../utils/auth");

// the user should be able to comment on posts
router.post("/", withAuth, async (req, res) => {
	try {
		const createComments = await Comment.create({
			contents: req.body.contents,
			user_id: req.session.user_id,
			post_id: req.body.post_id,
		});

		res.status(200).json(createComments);
	} catch (err) {
		res.status(400).json(err);
	}
});

module.exports = router;




// const router = require('express').Router();
// const { Comment } = require('../../models');

// router.get('/', (req, res) => {
//   Comment.findAll()
//     .then(dbCommentData => res.json(dbCommentData))
//     .catch(err => {
//       console.log(err);
//       res.status(500).json(err);
//     });
// });

// router.post('/', (req, res) => {
//   Comment.create({
//     comment_text: req.body.comment_text,
//     user_id: req.body.user_id,
//     post_id: req.body.post_id
//   })
//     .then(dbCommentData => res.json(dbCommentData))
//     .catch(err => {
//       console.log(err);
//       res.status(400).json(err);
//     });
// });

// router.delete('/:id', (req, res) => {
//   Comment.destroy({
//     where: {
//       id: req.params.id
//     }
//   })
//     .then(dbCommentData => {
//       if (!dbCommentData) {
//         res.status(404).json({ message: 'No comment found with this id!' });
//         return;
//       }
//       res.json(dbCommentData);
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json(err);
//     });
// });

// module.exports = router;