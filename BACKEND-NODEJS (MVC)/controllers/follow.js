const prueba_follow = (req, res) => {
    return res.status(200).send({ message: "mensaje enviado desde prueba: controllers/follow.js" })
}

const Follow = require("../models/Follow");
const User = require("../models/User");

const followService = require("../services/followUserIds");

const mongoosePaginate = require("mongoose-pagination");


const save = (req, res) => {
    const params = req.body;

    const identity = req.user;

    let userToFollow = new Follow({
        user: identity.id,
        followed: params.followed
    });



    userToFollow.save((error, FollowStored) => {

        if (error || !FollowStored) {
            return res.status(404).json({
                status: "error",
                message: "no se ha podido seguir al usuario",
            })
        }

        return res.status(200).json({
            status: "success",
            message: "metodo dar follow",
            identity: req.user,
            follow: FollowStored
        })
    })



}

const unfollow = (req, res) => {
    const userId = req.user.id;

    const followedId = req.params.id;

    Follow.find({
        "user": userId,
        "followed": followedId
    })
        .remove((error, followDeleted) => {
            if (error || !followDeleted) {
                return res.status(500).json({
                    status: "success",
                    message: "no has dejado de seguir a nadie",
                })
            }
            return res.status(200).json({
                status: "success",
                message: "follow eliminado correctamente",
                identity: req.user,
                followDeleted
            })
        })



}


const following = (req, res) => {
    let userId = req.user.id;

    if (req.params.id) {
        userId = req.params.id;
    }

    let page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    const itemsPerPage = 5;

    Follow.find({user: userId})
        .populate("user followed", "-password -role -__v -email")
        .paginate(page, itemsPerPage, async (error, follows, total) => {

            let followUserids = await followService.followUserIds(req.user.id);

            return res.status(200).json({
                status: "success",
                message: "listado de usuarios que estoy siguiendo",
                follows,
                total,
                pages: Math.ceil(total / itemsPerPage),
                following_and_followers: followUserids
            })
        })



}



const followers = (req, res) => {
    let userId = req.user.id;

    if (req.params.id) {
        userId = req.params.id;
    }

    let page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    const itemsPerPage = 5;



    Follow.find({followed: userId})
        .populate("user followed", "-password -role -__v -email")
        .paginate(page, itemsPerPage, async (error, follows, total) => {
            let followUserids = await followService.followUserIds(req.user.id);

            return res.status(200).json({
                status: "success",
                message: "listado de usuarios que me siguen",
                follows,
                total,
                pages: Math.ceil(total / itemsPerPage),
                following_and_followers: followUserids
            })
        })

}


module.exports = {
    prueba_follow,
    save,
    unfollow,
    following,
    followers
}