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
            Group.find({}).exec((err, groups)=>{
                users_friends=[];
                users_names=[];
                users_likes=[];
                users_posts=[];
                groups_names=[];
                groups_users=[];
                groups_ids_posts=[];
                groups_posts=[];
                groups_likes=[];
                groups.forEach((group)=>{
                    groups_users.push(group.users.length);
                    groups_names.push(group.name);
                    groups_ids_posts.push({'id':group._id,'posts':0,'likes':0});
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
                posts.forEach((post)=>{
                    groups_ids_posts.forEach((gp)=>{
                        if (String(post.group)===String(gp['id'])){
                            gp['posts']+=1;
                            gp['likes']+=post.likes.length;
                        }
                    });
                });
                groups_ids_posts.forEach((gp_post)=>{
                    groups_posts.push(gp_post['posts']);
                    groups_likes.push(gp_post['likes']);
                });
                console.log(groups_likes)
                
                res.render('stat',{'users_names':users_names,'users_friends':users_friends,'users_likes':users_likes,'users_posts':users_posts,'groups_names':groups_names,'groups_users':groups_users,'groups_posts':groups_posts,'groups_likes':groups_likes})
            });
        });
    });

};
