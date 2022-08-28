const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

// create associations
User.hasMany(Post, {
    foreignKey: 'user_id',
});

// When User is deleted, I want all Posts for that User to be deleted
Post.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

User.hasMany(Comment, {
    foreignKey: 'user_id',
});

// When User is deleted, I want all Coments for that User to be deleted
Comment.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

Post.hasMany(Comment, {
    foreignKey: 'post_id',
});

// When Post is deleted, I want all Comments for that Post to be deleted
Comment.belongsTo(Post, {
    foreignKey: 'post_id',
    onDelete: 'CASCADE',
});

module.exports = { User, Post, Comment };