const Follow = require("../models/Follow");

const followUserIds = async(IdentityuserId) => {
                                //todos los que user tenga identityuserid
    let following = await Follow.find({"user": IdentityuserId})
                                .select({"followed": 1, "_id": 0})
                                .exec();
    
    let followers = await Follow.find({"followed": IdentityuserId})
                                .select({"user": 1, "_id": 0})
                                .exec();

    let followingClean = [];
    following.forEach(follow => {
        followingClean.push(follow.followed);
    })

    let followersClean = [];
    followers.forEach(follow => {
        followersClean.push(follow.user);
    })




    return {
        following: followingClean,
        followers: followersClean
    }

}

const followThisUser = async(IdentityuserId, profileUserId) => {
    let following = await Follow.findOne({"user": IdentityuserId, "followed": profileUserId});
    
    let followers = await Follow.findOne({"user": profileUserId ,"followed": IdentityuserId});

    return {
        following,
        followers
    }

}

module.exports = {
    followUserIds,
    followThisUser
}