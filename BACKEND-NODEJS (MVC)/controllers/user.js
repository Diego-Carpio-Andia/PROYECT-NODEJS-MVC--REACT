const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("../services/jwt");
const mongoosePaginate = require("mongoose-pagination");
const fs = require("fs");
const path = require("path");
const followService = require("../services/followUserIds");
const Publication = require("../models/Publication");
const Follow = require("../models/Follow");

const validacion = require("../helpers/validate");

const prueba_user = (req,res) => {
    return res.status(200).send({message: "mensaje enviado desde prueba: controllers/user.js", /*usuario decodificado del pwt, donde se envia como user en el metodo login*/  usuario: req.user})
}

const register = (req,res) =>{

    const params = req.body;

    if(!params.name || !params.email || !params.password || !params.nick){
        return res.status(500).json({
            status: "error",
            message: "Faltan datos por enviar",
        });    

    }


    try {
        validacion.validate(params);
    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: "Validacion no superadaaa",
        }); 
    }



    let user_to_save = new User(params);


    User.find({
        $or:[
            {email: user_to_save.email.toLowerCase()},
            {nick: user_to_save.nick.toLowerCase()}
        ]
    }).exec((error,usuarios)=>{

        if(error){
            return res.status(500).json({
                status: "error",
                message: "Error en la consulta",
            });  
        }

        if(usuarios && usuarios.length >= 1){
            return res.status(200).json({
                status: "success",
                message: "El usuario ya existe",
            });

        }else{

            bcrypt.hash(user_to_save.password, 10, (error_hash, passoword_to_save)=> {
                user_to_save.password = passoword_to_save;
            
            
                user_to_save.save((error, userStored)=>{
                    if(error){
                        return res.status(500).json({
                            status: "error",
                            message: "error al guardar el usuario",
                            params
                        });
                    
                    }


                    if(userStored){
                        return res.status(200).json({
                            status: "success",
                            message: "Se guardo el usuario correctamente",
                            user: userStored
                        });


                    }else{
                        return res.status(500).json({
                            status: "error",
                            message: "hubo error al guardar el usuario",
                            params
                        });
                    }


                });
                             

            })        


        }



    })
    
   

    
    
}


const login = (req,res)=>{
    const params = req.body;

    if(!params.email || !params.password){
        return res.status(400).json({
            status: "error",
            message: "faltan datos"
        });
    }

    
    User.findOne({email: params.email})
        .exec((error, user) =>{
        if(error || !user){
            return res.status(404).json({
                status: "error",
                message: "no existe el usuario"
            });
        }

        let pwd = bcrypt.compareSync(params.password, user.password)

        if(!pwd){
            return res.status(404).json({
                status: "error",
                message: "no te has identificado correctamente"
            });  
        }

        
        const token = jwt.createToken(user);


        return res.status(200).json({
            status: "success",
            message: "te has identificado correctamente",
            user: {
                id: user._id,
                name: user.name,
                nick: user.nick
            },
            token
        });




    });


   
}

const profile = (req, res) =>{
    const id = req.params.id;

    User.findById(id)
    .select({password:0, role: 0})
    .exec(async (error, user_profile) =>{
        if(error || !user_profile){
            return res.status(404).json({
                status: "error",
                message: "el usuario no existe"
            });
        }

      
        const followInfo = await followService.followThisUser(req.user.id, id);
        
        return res.status(200).json({
            status: "success",
            user: user_profile,
            following: followInfo.following,
            followers: followInfo.followers
        });

    })


}


const list = (req,res) => {
    let page = 1;
    if(req.params.page){
        page = req.params.page;     
    }

    page = parseInt(page);

    let itemsPerPage = 5;


    User.find().select("-password -email -role -__v").sort('_id').paginate(page, itemsPerPage, async (error, users, total)=>{

        if(error || !users){
            return res.status(404).json({
                status: "error",
                message: "error en la consulta, no hay usuarios"
            });
        }


        const followInfo = await followService.followUserIds(req.user.id);
        

        return res.status(200).json({
            status: "success",
            users,
            page,
            itemsPerPage,
            total,
            pages: Math.ceil(total/itemsPerPage),
            followInfo
        });


    });


    
}

const update = (req,res) => {
    let userToUpdate = req.body;
    let userIdentity = req.user;
    delete userToUpdate.iat;
    delete userToUpdate.exp;
    delete userToUpdate.role;
    delete userToUpdate.image;

    if(!req.body){

    }
    User.find({
        $or:[
            {email: userToUpdate.email.toLowerCase()},
            {nick: userToUpdate.nick.toLowerCase()}
        ]
    }).exec(async (error,usuarios)=>{

        if(error){
            return res.status(500).json({
                status: "error",
                message: "Error en la consulta",
            });  
        }

        let userIsset = false;
        usuarios.forEach(user => {
            if(user && user._id != userIdentity.id) userIsset = true;

        });

        if(userIsset){
            return res.status(200).json({
                status: "success",
                message: "El usuario ya existe",
            });

        }



        if(userToUpdate.password){
            let pwd = await bcrypt.hash(req.body.password, 10);
            userToUpdate.password = pwd;
        }else{
            delete userToUpdate.password;
        }

        

        
        User.findByIdAndUpdate({_id:userIdentity.id}, userToUpdate, {new: true}, (error, userUpdate)=>{

            if(error || !userUpdate){
                return res.status(500).json({
                    status: "error",
                    message: "Error en al actualizar usuario",
                });
            }



            return res.status(200).json({
                status: "success",
                message: "usuario actualizado correctamente",
                user: userUpdate,
                pinga: req.pinga,
                    
                    
            });


        })

        


    })


   
}

const upload = (req,res) =>{
   
    let image = req.file.originalname;

    const imagesplit = image.split("\.");
    const extension = imagesplit[1];

    if(extension != "png" &&
       extension != "jpg" &&
       extension != "jpeg" &&
       extension != "gif"){

        const filePath = req.file.path;
        const fileDeleted = fs.unlinkSync(filePath);
        return res.status(400).json({
            status: "error",
            message: "extension no valida" 
        });
    }

    
    User.findByIdAndUpdate({_id:req.user.id}, {image: req.file.filename}, {new: true}, (error, userUpdate)=>{

        if(error || !userUpdate){
            return res.status(500).json({
                status: "error",
                message: "no se pudo subir archivo" 
            });
        }



        return res.status(200).json({
            status: "success", 
            user: userUpdate,
            file: req.file
        });
    })

    
}

const avatar = (req,res) => {

    const file = req.params.file;

    const filePath = "./uploads/avatars/"+file;

    fs.stat(filePath, (error, exists)=>{
        if(!exists){
            return res.status(404).json({
                status: "error",
                message: "no existe la imagen"
            });
        }

        return res.sendFile(path.resolve(filePath));
        


    })

}

const counters = async (req,res) => {
    let userId = req.user.id;

    if(req.params.id){
        userId = req.params.id;
    }


    try {
        const following = await Follow.count({"user": userId});
        const followed = await Follow.count({"followed": userId});
        const publications = await Publication.count({"user": userId});

        return res.status(200).json({
            status: "success", 
            following,
            followed,
            publications
        });

    } catch (error) {
        return res.status(404).json({
            status: "error", 
            message: "error en la consulta"
        });
    }

}


module.exports = {
    prueba_user,
    register,
    login,
    profile,
    list,
    update,
    upload,
    avatar,
    counters
}