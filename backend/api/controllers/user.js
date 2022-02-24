const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const User = require('../models/users')
const Album = require('../models/album')
const jwt = require('jsonwebtoken')
const salt = 12;
const fs = require('fs')

exports.getUsersById = async (req, res, next) => {

    userId = req.params.userId

    User.findById(userId, async (error, result) => {
        if(error) {
            res.status(500).json({
                error: error.message,
                status: false
            })
        }
        else{
            if(result) {
                res.status(200).json({
                    content: result.toObject({ getters: true }),
                    status: true
                })
            }
            else{
                res.status(404).json({
                    message: 'Not A Valid Id',
                    status: false
                })
            }
        
        }
    });    
}

exports.getUsers = async (req, res, next) => {
    User.find({}, async (error, result) => {
        if(error) {
            
            res.status(500).json({
                error: error.message,
                status: false
            })
        }
        else{
            res.status(200).json({
                message: "This is GET way to access Users!",
                content: result.map(user => user.toObject({ getters: true })),
                status: true
            })
        }
    })
}

exports.signUp = async (req, res, next) => {

    const { email, password, name } = req.body;

    const { path } = req.file

    try {

        User.findOne({email: email}, async (error, result) => {
            
            if(error) {
                return res.status(500).json({
                    message: error,
                    status: false
                })
            }

            if(result === null) {

            let hashedPassword;
            
            try {
        
                hashedPassword = await bcrypt.hash(password, salt)

                const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: email,
                        password: hashedPassword,
                        name: name,
                        image: path,
                        albums: []
                    })
                    
                    await user.save();

                    let token;
                    try {
                        token = jwt.sign({  userId: user.id, email: user.email }, 
                            process.env.JWT_KEY,{ expiresIn: '1h' })
                    }
                    catch(error) {
                        return res.status(500).json({
                            message: 'token not working (signUp)',
                            status: false
                        })
                    }
                
                       
                    res.status(201).json({
                        message: "Registered!",
                        content: {id: user.id, email: user.email},
                        token: token,
                        status: true
                    });
            }

            catch(error) {
                res.status(500).json({
                message: error.message,
                status: false
                })
            }
            
            }
            else {
                return res.status(500).json({
                    message: 'Sign Up Failed! (email already exists!)',
                    status: false
                }) 
            }
        })
        
    }
    catch(error) {
        if(error) {
            res.status(500).json({
                message: error.message,
                status: false
            })
        }
    }
    
}

exports.logIn = async (req, res) => {

    const { email, password: upcomingPassword } = req.body;

        try {

        User.findOne({ email: email }, async (error, result) => {
            if(error) {
                return res.status(500).json({
                    message: error.message,
                    status: false
                })
            }
            
            if(!result) {
                return res.status(500).json({
                    message: 'invalid credentials',
                    status: false
                })
            }
            
            let isValidPassword = false
            try{
                isValidPassword = await bcrypt.compare(upcomingPassword, result.password)
            }

            catch(error) {
                return res.status(500).json({
                    message: 'token not working (login)',
                    status: false
                })
            }

            if(!isValidPassword) {
                return res.status(500).json({
                    message: 'invalid credentials',
                    status: false
                })
            }

            let token;
                    try {
                        token = jwt.sign({  userId: result.id, email: result.email }, 
                            process.env.JWT_KEY,{ expiresIn: '1h' })
                    }
                    catch(error) {
                        return res.status(500).json({
                            message: error.message,
                            status: false
                        })
                    }

            res.status(200).json({
                message: 'Logged In!',
                content: { id: result.id, email: result.email },
                token: token,
                status: true
            })
            
        });
         
  }

  catch(error) {
    if(error) {
        return res.status(500).json({
            message: error.message,
            status: false
        })
    }
  }
}

exports.deleteUser = async (req, res, next) => {

    const userId = req.params.userId

    let removeUser

    try {
        removeUser = await User.findById(userId).populate('albums')
        console.log(removeUser)
    }
    catch(error) {
        return res.status(500).json({
            message: error.message,
            status: false
        })
    }

    if(!removeUser) {
        return res.status(404).json({
            message: 'Could Not Found User!',
            status: false
        })
    }

    if (removeUser.id !== req.userData.userId) {
        return res.status(403).json({
           message: 'You are not allowed to delete this!',
           status: false})
      }

    try {
        
        const albums = removeUser.albums
        

        const userImage = removeUser.image
    
        fs.unlink(userImage, err => {
            console.log(err);
          });
        
        if(albums.length > 0) {
        const creator = albums[0].creator

        
        albums.forEach(album => {
                    fs.unlink(album.image, err => {
                    console.log(err);
                  });
                })

        await Album.deleteMany({creator})

        }

        await removeUser.remove({});
        
    }
    catch(error) {
        return res.status(500). json({
            message: error.message,
            status: false
        })
    }
    return res.status(200).json({
        message: 'Album Has Been Deleted!',
        status: true
    })
}
