const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const {Post} = require("../models/Post");
const { auth } = require("../middleware/auth");

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
        cart:req.user.cart,
    });
});

router.post("/register", (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});
router.get('/addCartItem',auth,(req,res)=>{
    

    User.findOne({_id:req.user._id},
        (err,userInfo)=>{
            let isExist = false;
            userInfo.cart.forEach(cartItem =>{
                if(cartItem.id === req.query.postId)
                 isExist =true;
            })
            
            if(isExist){
                User.findOneAndUpdate(
                    {_id:req.user._id,'cart.id':req.query.postId},
                    {$inc:{'cart.$.quantity':1}},
                    {new:true},
                    ()=>{
                        if(err) res.status(400).json({success:false,err})
                        res.status(200).json(userInfo.cart);
                    }
                )
            }
            else{
                User.findOneAndUpdate(
                    {_id:req.user._id},
                    {$push:{
                        cart:{
                            id:req.query.postId,
                            quantity:1,
                            date:Date.now(),
                        }
                    }},
                    {new:true},
                    (err,userInfo)=>{
                        if(err) res.status(400).json({success:false,err})
                        res.status(200).json(userInfo.cart)
                    }
                )
            }
        }
        )

})
router.get('/removeCartItem',auth,(req,res)=>{
    User.findOneAndUpdate(
        {_id:req.user._id},
        {$pull:{
            cart:{
                id:req.query.postId
            }
        }},
        {new:true},
        (err,userInfo)=>{
            let cart = userInfo.cart;
            let postIds = cart.map(item=>item.id);

            Post.find({_id:{$in:postIds}})
            .populate('writer')
            .exec((err,cartDetail)=>{
                if(err) res.status(400).json({success:false,err})
                res.status(200).json({
                    cart,cartDetail
                })
            })
        }
    )
})
module.exports = router;