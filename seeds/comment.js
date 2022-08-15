const { Comment } = require("../models");

const commentdata = [
	{
		contents: "RTX 3070ti overpriced",
		user_id: "2",
		post_id: "1",
	},
	{
		contents: "AMD better",
		user_id: "3",
		post_id: "2",
	},
	{
		contents: "Smadge",
		user_id: "1",
		post_id: "4",
	},
	{
		contents: "KEKW",
		user_id: "2",
		post_id: "4",
	},
];

const seedComment = () => Comment.bulkCreate(commentdata);

module.exports = seedComment;