var mongoose = require('mongoose'),
    Post = mongoose.model('Post'),
    User = mongoose.model('User'),
    Group = mongoose.model('Group');

exports.all_database = (req, res)=>{
    User.find({}, (err, users)=>{
        Post.find({}, (err, posts)=>{
            Group.find({}, (err, groups)=>{
                res.send({'users':users,'posts':posts,'groups':groups})
            });
        });
    });
};

exports.stat = (req, res)=>{
    User.find({}).populate('friends').populate('posts').exec((err, users)=>{
        Post.find({}, (err, posts)=>{
            Group.find({}, (err, groups)=>{
                users_friends=[];
                users_names=[];
                users_likes=[];
                users_posts=[];
                groups_names=[];
                groups_users=[];
                groups.forEach((group)=>{
                    groups_users.push(group.users.length);
                    groups_names.push(group.name);
                });
                users.forEach((user)=>{
                    users_friends.push(user.friends.length);
                    users_names.push(user.name);
                    users_posts.push(user.posts.length)
                    likes=0;                
                    user.posts.forEach((post)=>{
                        likes+=post.likes.length;
                    });
                    users_likes.push(likes);
                    
                });
                
                res.render('stat',{'users_names':users_names,'users_friends':users_friends,'users_likes':users_likes,'users_posts':users_posts,'groups_names':groups_names,'groups_users':groups_users})
            });
        });
    });

};
