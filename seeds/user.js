const { User } = require("../models");

const userdata = [
	{
		username: "Andrew",
		email: "andrew@something.com",
		password: "andrew1234",
	},
	{
		username: "Dan",
		email: "dan@something.com",
		password: "dan1234",
	},
	{
		username: "Brian",
		email: "brian@cancer.com",
		password: "brian1234",
	},
	{
		username: "Allen",
		email: "allen@something.com",
		password: "allen1234",
	},
];

const seedUser = () => User.bulkCreate(userdata);

module.exports = seedUser;