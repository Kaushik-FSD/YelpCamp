//***************
//COMMENTS ROUTE
//***************

var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");
const { route } = require("./campgrounds");
const e = require("express");
var middleWare = require("../middleware");


router.get("/new", middleWare.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: campground });
        }
    })
})

router.post("/", middleWare.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err)
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    req.flash("error", "OOPS!, Something went wrong")
                    console.log(err)
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save the comment
                    comment.save();
                    campground.comments.push(comment._id);
                    campground.save();
                    req.flash("success", "Successfully added comment")
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
})

//EDIT route
router.get("/:comment_id/edit", middleWare.checkCommentOwnership, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", { campground_id: req.params.id, comment: foundComment });
        }
    })
})

router.put("/:comment_id", middleWare.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

//DESTROY route
router.delete("/:comment_id", middleWare.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment Deleted")
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

module.exports = router;