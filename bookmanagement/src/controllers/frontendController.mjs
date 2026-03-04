import mongoose from "mongoose";
import frontendModel from "../models/frontendModel.mjs";
import uploadFile from "../aws/uploadFile.mjs";

const uploadImage = async(req, res)=>{
    try {
        let files = req.files;
        if(!files || files.length===0){
            return res.status(400).send({message: "failed", error: "Image is required"});
        }
        const image= await uploadFile(files[0]);
        if(!image){
            return res.status(500).send({message: "failed", error: "failed to upload image"})
        }
        await frontendModel.create({imageURL: image})
        return res.status(201).send({status: true, data: image})
    } catch (error) {
        if(error.message.includes("validation")){
            return res.status(400).send({message: "failed", err: error.message});
        }
        else if(error.message.includes("duplicate")){
            return res.status(400).send({message: "failed", err: error.message});
        }
        else{
            return res.status(500).send({message: "failed", err: error.message});
        }
    }
}

export {uploadImage};