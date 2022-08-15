const router = require("express").Router();
const { User, Post, Comment } = require("../models");
const withAuth = require("../utils/auth");

// to get all of the posts and render them
router.get("/", async (req, res) => {
	try {
		const postData = await Post.findAll({
			include: [{ model: User, attributes: { exclude: ["password"] } }],
			// I want to order in descending orderr
			order: [["id", "DESC"]],
		});

		const posts = postData.map((post) => post.get({ plain: true }));

		res.render("homepage", {
			posts,
			loggedIn: req.session.loggedIn,
		});
	} catch (err) {
		res.status(500).json(err);
	}
});

// to get one single post by the post id
router.get("/posts/:id", async (req, res) => {
	try {
		const postData = await Post.findByPk(req.params.id, {
			include: [
				{
					model: User,
					attributes: { exclude: ["password"] },
				},
				{
					model: Comment,
					include: [{ model: User, attributes: { exclude: ["password"] } }],
				},
			
			],
		});

		const singlePost = postData.get({ plain: true });

		res.render("postpage", {
			singlePost,
			loggedIn: req.session.loggedIn,
		});
	} catch (err) {
		res.status(500).json(err);
	}
});

// the other page to render is the dashbaord page
router.get("/dashboard", withAuth, async (req, res) => {
	try {
		const postData = await Post.findAll({
			where: {
				user_id: req.session.user_id,
			},
			order: [["id", "DESC"]],
		});

		const dashboard = postData.map((post) => post.get({ plain: true }));

		res.render("dashboard", {
			dashboard,
			loggedIn: req.session.loggedIn,
		});
	} catch (err) {
		res.status(500).json(err);
	}
});

// while on the dashbaord page, I want to create a post
router.get("/dashboard/newpost", withAuth, async (req, res) => {
	try {
		const avengerData = await Hero.findAll({
			where: {
				category: "avengers",
			},
		});
		const justiceData = await Hero.findAll({
			where: {
				category: "justiceLeague",
			},
		});

		const avengers = avengerData.map((avenger) => avenger.get({ plain: true }));
		const justiceLeague = justiceData.map((justice) =>
			justice.get({ plain: true })
		);

		res.render("newpost", {
			avengers,
			justiceLeague,
			loggedIn: req.session.loggedIn,
		});
	} catch (err) {
		res.status(500).json(err);
	}
});

// also have the option to edit my posts
router.get("/dashboard/editpost/:id", withAuth, async (req, res) => {
	try {
		const editData = await Post.findByPk(req.params.id);

		const editPost = editData.get({ plain: true });

		res.render("editPost", {
			editPost,
			loggedIn: req.session.loggedIn,
		});
	} catch (err) {
		res.status(500).json(err);
	}
});


// able to log in anywhere
router.get("/login", (req, res) => {
	if (req.session.loggedIn) {
		res.redirect("/");
		return;
	}

	res.render("login");
});
// able to log out anywhere
router.get("/signup", (req, res) => {
	if (req.session.loggedIn) {
		res.redirect("/");
		return;
	}
	res.render("signup");
});

module.exports = router;




// const router = require('express').Router();
// const sequelize = require('../config/connection');
// const { Post, User, Comment, Vote } = require('../models');

// // get all posts for homepage
// router.get('/', (req, res) => {
//   console.log('======================');
//   Post.findAll({
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
//       const posts = dbPostData.map(post => post.get({ plain: true }));

//       res.render('homepage', {
//         posts,
//         loggedIn: req.session.loggedIn
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json(err);
//     });
// });

// // get single post
// router.get('/post/:id', (req, res) => {
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

//       const post = dbPostData.get({ plain: true });

//       res.render('single-post', {
//         post,
//         loggedIn: req.session.loggedIn
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json(err);
//     });
// });

// router.get('/login', (req, res) => {
//   if (req.session.loggedIn) {
//     res.redirect('/');
//     return;
//   }

//   res.render('login');
// });

// module.exports = router;