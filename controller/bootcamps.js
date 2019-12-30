const Bootcamp = require('../models/bootcamp');
const ErrorResponse = require('../utils/errorResponse')
const path = require('path');

// @ desc Get  all botcamps 
// @ routes  Get /api/v1/ bootscamp/ 
// @ access Public 
exports.Getbootcamps = async (req, res, next) => {
    try {
        res.status(200).json(res.advancedResults)
    }
    catch(err) {
        next(err);
    }
}


// @ desc Get  all botcamps 
// @ routes  Get /api/v1/ bootscamp/:id/
// @ access Public 
exports.Getbootcamp = async (req, res, next) =>{
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp){
             return next(
                new ErrorResponse(`Bootcamp Not Found With ID ${req.params.id}`, 404)
            );
        }
        res.status(201).json({ 
            success:true, 
            data: bootcamp
        });
    }
    catch(err) {
        next(
            new ErrorResponse(`Bootcamp Not Found With ID ${req.params.id}`, 404)
        );
   }
}


// @ desc Bet by id  botcamp
// @ routes  GET /api/v1/ bootscamp/:id
// @ access Public 
exports.UpdateBootcamp = async (req, res, next) =>{
    try{
        let bootcamp = await Bootcamp.findById (req.params.id);
        
        if(!bootcamp){
            return next(
                new ErrorResponse(`Bootcamp Not Found With ID ${req.params.id}`, 404)
            );
        }

        //Make sure user is Bootcamp owner
        if(bootcamp.user.toString() !==  req.user.id && req.user.role !== 'admin'){
            return next(
                new ErrorResponse (`User ${req.params.id} is not authorize to update this bootcamp `), 401
            )
        }

        bootcamp =  await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success:true, data: bootcamp});
        
    }
    catch(err){
        next(err);
    }

}


// @ desc Delete  botcamps 
// @ routes  Delete /api/v1/ bootscamp/:id 
// @ access Public 
exports.DeleteBootcamp = async (req, res, next) =>{
    try{
        let bootcamp = await Bootcamp.findById (req.params.id);
        
        if(!bootcamp){
            return next(
                new ErrorResponse(`Bootcamp Not Found With ID To Delete  ${req.params.id}`, 404)
            );
        }

        //Make sure user is Bootcamp owner
        if(bootcamp.user.toString() !==  req.user.id && req.user.role !== 'admin'){
            return next(
                new ErrorResponse (`User ${req.params.id} is not authorize to Delete this bootcamp `)
                , 401
            )
        }

        bootcamp.remove();
            
        res.status(200).json({ success:true, data:{}});
        
    }
    catch(err){
        next(err);
    }
}

// @ desc Create  bootcamps 
// @ routes  Post /api/v1/ bootscamp/
// @ access Public 
exports.Createbootcamps = async (req, res, next) => {
    try {
        //Add user  to req, body
        req.body.user = req.user.id;
        
        //Check For publishedBootscamp 
        const publishedBootscamp = await Bootcamp.findOne({
            user: req.user.id
        });

        //if the user is not an admin , they can only add one bootcamp
        if(publishedBootscamp && req.user.role != 'admin') {
            return next(
                new ErrorResponse( 
                        `The user with ID ${req.user.id} has already a bootcamp`,
                       400
                )
            )
        }

        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({ 
            success:true, 
            data: bootcamp
        });
    }
    catch(err) {
        next(err);
    }
}

// @ desc upload Photo for Bootcamp 
// @ routes  Post /api/v1/bootscamp/:id/photo
// @ access Private
exports.bootcampPhotoUplaod = async (req, res, next) => {
   const bootcamp = await Bootcamp.findById(req.params.id);

        if(!bootcamp) {
            return next( new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404));
        }
        
        if(!req.files) {
            return next( new ErrorResponse(`Please upload a photo`, 404));
        }

        const file = req.files.file;
        
        //Make sure the image  is a photo
        if(!file.mimetype.startsWith('image')) {
            return next( new ErrorResponse(`Please upload an image File`, 400));
        }

        //Check Filesize
        if(file.size > process.env.MAX_FILE_UPLOAD) {
            return next( new ErrorResponse(`please uplaod an image less than ${process.env.MAX_FILE_UPLOAD}, 400`));
        }

        //Create custom filename
        file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
        
        file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
            if(err) {
                console.error(err);
                return next (new ErrorResponse (`Problem with file uplaod `, 500));                  
            }
            
            await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
            
            res.status(200).json({
                 success:true,
                 data: file.name
            })
        })
        
   }



