const prueba_publication = (req, res) => {
    return res.status(200).send({ message: "mensaje enviado desde prueba: controllers/publication.js" })
}

const Publication = require("../models/Publication");
const fs = require("fs");
const path = require("path");
const followService = require("../services/followUserIds");



const save = (req, res) => {
    let params = req.body;


    if (!params.text) {
        return res.status(404).send({
            status: "error",
            message: "debes llenar el objeto"
        })
    }

    let newPublication = new Publication(params);
    newPublication.user = req.user.id;

    newPublication.save((error, publicationStored) => {
        if (error || !publicationStored) {
            return res.status(404).send({
                status: "error",
                message: "no se ha guardardo"
            })
        }

        return res.status(200).send({
            status: "success",
            message: "se guardo la publicacion",
            publicationStored
        })


    })


}

const detail = (req, res) => {
    const publicationId = req.params.id;

    Publication.findById(publicationId, (error, publicationStored) => {
        if (error || !publicationStored) {
            return res.status(404).send({
                status: "error",
                message: "no se ha encontrado la publicacion"
            })
        }

        return res.status(200).send({
            status: "success",
            message: "se encontro la publicacion",
            publicationStored
        })
    })


}

const remove = (req, res) => {
    const publicationId = req.params.id;

    Publication.find({ "user": req.user.id, "_id": publicationId }).remove((error, deleteDocument) => {
        if (error) {
            return res.status(404).send({
                status: "error",
                message: "no se ha encontrado la publicacion"
            })
        }

        return res.status(200).send({
            status: "success",
            message: "eliminar publicacion",
            publicationId
        })

    })


}

const listado = (req, res) => {
    let userID = req.params.id;

    let page = 1;
    if (req.params.page) page = req.params.page;
    const itemsPerPage = 5;

    Publication.find({ "user": userID })
        .populate("user", "-password -__v -role")
        .sort("-created_at")
        .paginate(page, itemsPerPage, (error, publications, total) => {
            if (error || !publications || publications.length <= 0) {
                return res.status(404).send({
                    status: "error",
                    message: "no se ha encontrado las publicaciones"
                })
            }

            return res.status(200).send({
                status: "success",
                message: "listar publicacion",
                user: req.user,
                publications,
                page,
                total: Math.ceil(total/itemsPerPage)
            })
        })



}

const upload = (req,res) =>{
    const publicationId = req.params.id;
    if(!req.file){
        return res.status(404).json({
            status: "error",
            message: "peticion no incluye imagen" 
        });
    }
   
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

    
    Publication.findByIdAndUpdate({"user":req.user.id, "_id": publicationId}, {file: req.file.filename}, {new: true}, (error, PublicationUpdate)=>{

        if(error || !PublicationUpdate){
            return res.status(500).json({
                status: "error",
                message: "no se pudo subir archivo" 
            });
        }



        return res.status(200).json({
            status: "success", 
            publication: PublicationUpdate,
            file: req.file
        });
    })

    
}

const media = (req,res) => {

    const file = req.params.file;

    const filePath = "./uploads/publications/"+file;

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


const feed = async (req,res) => {
    let page = 1;


    if(req.params.page) page = req.params.page;

    let itemsPerPage = 5;

    try {
        const myFollows = await followService.followUserIds(req.user.id);
        Publication.find({
            
            "user": myFollows.following
            
        }).populate("user", "-password -role -__v -email")
          .sort("-created_at")
          .paginate(page, itemsPerPage, (error, publications, total)=>{

            if(error && !publications && publications.length <= 0){
                return res.status(404).json({
                    status: "error",
                    message: "No hay publicaciones que mostrar",    
                });

            }

            return res.status(200).json({
                status: "success",
                message: "feed de publicaciones",
                following: myFollows.following,
                publications,
                total,
                page,
                pages: Math.ceil(total/itemsPerPage)

            });

        });

        
    
    } catch (error) {
        
        return res.status(500).json({
            status: "error",
            message: "hubo un error"
        });

    }
    








}
 



module.exports = {
    prueba_publication,
    save,
    detail,
    remove,
    listado,
    upload,
    media,
    feed
}