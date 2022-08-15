const router = require("express").Router();
const { Post } = require("../../models");
const withAuth = require("../../utils/auth");

// posts can be created, updated, or deleted
// route to create post
router.post("/", withAuth, async (req, res) => {
	try {
		const newPost = await Post.create({
			title: req.body.title,
			contents: req.body.contents,
			user_id: req.session.user_id,
		});

		console.log(newPost);

		res.status(200).json(newPost);
	} catch (err) {
		res.status(400).json(err);
	}
});

// route to update the user's post
router.put("/:id", withAuth, async (req, res) => {
	try {
		const updatePost = await Post.update(req.body, {
			where: {
				id: req.params.id,
			},
		});

		// in case the post cannot be found
		if (!updatePost) {
			res.status(404).json({ message: "Cannot find post." });
		}

		res.status(200).json(updatePost);
	} catch (err) {
		res.status(400).json(err);
	}
});

// route to delete the user's post
router.delete("/:id", withAuth, async (req, res) => {
	try {
		const deletePost = await Post.destroy({
			where: {
				id: req.params.id,
			},
		});

		if (!deletePost) {
			res.status(404).json({ message: "Cannot find post." });
		}

		res.status(200).json(deletePost);
	} catch (err) {
		res.status(400).json(err);
	}
});

module.exports = router;



// const router = require('express').Router();
// const sequelize = require('../../config/connection');
// const { Post, User, Comment } = require('../../models');

// // get all users
// router.get('/', (req, res) => {
//   console.log('======================');
//   Post.findAll({
//     attributes: [
//       'id',
//       'post_url',
//       'title',
//       'created_at',
      
//     ],
//     order: [['created_at', 'DESC']],
//     include: [
//       {
//         model: Comment,
//         attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
//         include: {
//           model: User,
//           attributes: ['username']
//         }
//       },
//       {
//         model: User,
//         attributes: ['username']
//       }
//     ]
//   })
//     .then(dbPostData => res.json(dbPostData))
//     .catch(err => {
//       console.log(err);
//       res.status(500).json(err);
//     });
// });

// router.get('/:id', (req, res) => {
//   Post.findOne({
//     where: {
//       id: req.params.id
//     },
//     attributes: [
//       'id',
//       'post_url',
//       'title',
//       'created_at',
      
//     ],
//     include: [
//       {
//         model: Comment,
//         attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
//         include: {
//           model: User,
//           attributes: ['username']
//         }
//       },
//       {
//         model: User,
//         attributes: ['username']
//       }
//     ]
//   })
//     .then(dbPostData => {
//       if (!dbPostData) {
//         res.status(404).json({ message: 'No post found with this id' });
//         return;
//       }
//       res.json(dbPostData);
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json(err);
//     });
// });

// router.post('/', (req, res) => {
 
//   Post.create({
//     title: req.body.title,
//     post_url: req.body.post_url,
//     user_id: req.body.user_id
//   })
//     .then(dbPostData => res.json(dbPostData))
//     .catch(err => {
//       console.log(err);
//       res.status(500).json(err);
//     });
// });

// router.put('/upvote', (req, res) => {
//   // custom static method created in models/Post.js
//   Post.upvote(req.body, { Vote, Comment, User })
//     .then(updatedVoteData => res.json(updatedVoteData))
//     .catch(err => {
//       console.log(err);
//       res.status(500).json(err);
//     });
// });

// router.put('/:id', (req, res) => {
//   Post.update(
//     {
//       title: req.body.title
//     },
//     {
//       where: {
//         id: req.params.id
//       }
//     }
//   )
//     .then(dbPostData => {
//       if (!dbPostData) {
//         res.status(404).json({ message: 'No post found with this id' });
//         return;
//       }
//       res.json(dbPostData);
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json(err);
//     });
// });

// router.delete('/:id', (req, res) => {
//   Post.destroy({
//     where: {
//       id: req.params.id
//     }
//   })
//     .then(dbPostData => {
//       if (!dbPostData) {
//         res.status(404).json({ message: 'No post found with this id' });
//         return;
//       }
//       res.json(dbPostData);
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json(err);
//     });
// });

// module.exports = router;