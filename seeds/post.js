const { Post } = require("../models");

const postdata = [
	{
		title: "GPU",
		contents: "Nvidia pog",
		user_id: "4",
	},
	{
		title: "RSI",
		contents: "RIP Wrist bedge",
		user_id: "2",
	},
	{
		title: "I mis-diagnosed patients lol",
		contents: "Opps",
		user_id: "3",
	},
	{
		title: "Copium",
		contents: "group 5 project 2",
		user_id: "1",
	},
];

const seedPost = () => Post.bulkCreate(postdata);

module.exports = seedPost;