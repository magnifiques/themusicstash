const Album = require('../models/album');
const mongoose = require('mongoose')
const User = require('../models/users')
const fs = require('fs')


exports.createAlbum = async (req, res) => {

    const { title, artist, description, year, creator } = req.body

    //for image 
    const { path } = req.file
    
  
    try {
       
        Album.findOne({title: title}, async (error, result) => {
            if(error) {
                res.status(400).json({
                    error: error.message,
                    status: false
                })
            }

            if(result === null) {

                let existingUser;
                try {
                    existingUser = await User.findById(creator)
                }
                catch(error) {
                    if(error) {
                        return res.status(500).json({
                            message: error.message,
                            status: false
                        })
                    }
                }
      
                
                if(!existingUser) {
                    return res.status(404).json({
                        message: 'Id corresponding to User does not exist!',
                        status: false
                    })
                }

                const album = new Album({
                    _id: new mongoose.Types.ObjectId(),
                    title: title,
                    artist: artist,
                    description: description,
                    year: year,
                    creator: creator,
                    image: path
                    
                })
            
                const sess = await mongoose.startSession();

                sess.startTransaction()
                await album.save({ session: sess });
                existingUser.albums.push(album);
                await existingUser.save();
                await sess.commitTransaction();

                res.status(200).json({
                    message: "Album has been registered!",
                    status: true
                });
            }
            else{
                return res.status(400).json({
                    message: 'Title already exists!',
                    status: false
                })
            }
            
        })
       
    }
    
    catch(error) {
        if(error) {
            res.status(500).json({
                error: error.message,
                status: false
            })
        }
    }
}

exports.getAlbums = async (req, res) => {

    Album.find({}, async (error, result) => {
        if(error) {
            console.log(error.message)
            res.status(500).json({
                error: error.message,
                status: false
            })
        }
        else{
            res.status(200).json({
                message: "This is GET way to access Albums!",
                content: result,
                status: true
            })
        }
    })
    
}

exports.getAlbumById = async (req, res) => {

    albumId = req.params.albumId;

        Album.findById(albumId, async (error, result) => {
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

exports.getAlbumByCreator = async (req, res) => {

    userId = req.params.userId;
 

    let usersWithId;

    try {
        usersWithId = await User.findById(userId).populate('albums')
    }
    catch(error) {
        if(error) {
            return res.status(500).json({
                message: error.message,
                status: false
            })
        }
    }
    
    if(usersWithId) {
        res.status(200).json({
            content: usersWithId.toObject({ getters: true }),
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

exports.updateAlbum = async (req, res) => {
    
    const albumId = req.params.albumId

    const { title, artist, description, year, creator } = req.body;

    let updatingAlbum 

    try{
        updatingAlbum = await Album.findById(albumId)
    }

    catch(error) {
        return res.status(500).json({
            message: error.message,
            status: false
        })
    }

    if(updatingAlbum.creator.toString() !== req.userData.userId) {
        return res.status(401).json({
            message: 'You are not allowed to update',
            status: false
        })
    }

    Album.updateMany({ id: albumId }, 
        { "$set": { title: title, 
                 artist: artist, 
                 description: description, 
                 year: year }}, async (error, result) => {
            if(error) {
                res.status(400).json({
                    error: error.message,
                    status: false
                })
            }
            else{
                res.status(200).json({
                    message: "Album's credentials have been updated",
                    status: true
                })
            }
    })
}

exports.deleteAlbums = async (req, res) => {
    
    const albumId = req.params.albumId
    
    let removeAlbum
    
    try {
        removeAlbum = await Album.findById(albumId).populate('creator')
        console.log(removeAlbum)
    }

    catch(error) {
        res.status(500). json({
            message: error.message,
            status: false
        })
    }

    if(!removeAlbum) {
        return res.status(404).json({
            message: 'Could Not Found user!',
            status: false
        })
    }
    
    if (removeAlbum.creator.id !== req.userData.userId) {
        return res.status(403).json({
           message: 'You are not allowed to delete this!',
           status: false})
      }

    const imagePath = removeAlbum.image

    try {
        const sess = await mongoose.startSession();

        console.log(removeAlbum)

        sess.startTransaction()
        
        await removeAlbum.remove({ session: sess });

        removeAlbum.creator.albums.pull(removeAlbum);

        await removeAlbum.creator.save({ session: sess })

        await sess.commitTransaction();
        
        fs.unlink(imagePath, err => {
            console.log(err);
          });

        res.status(200).json({
            message: 'Album Has Been Deleted!',
            status: true
        })
    }

    catch(error) {
        res.status(500). json({
            message: error.message,
            status: false
        })
    }
}