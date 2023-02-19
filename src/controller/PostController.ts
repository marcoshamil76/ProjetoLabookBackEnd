import { Request, Response } from "express";
import { PostBusiness } from "../business/PostBusiness";
import { CreatePostInputDTO, EditPostInputDTO, GetPostInputDTO } from "../dtos/userDTO";
import { BaseError } from "../errors/BaseError";

export class PostController{
    constructor(
        private postBusiness: PostBusiness
    ){}


    public getPosts = async (req: Request, res: Response)=>{
        try {
            const input: GetPostInputDTO = {
                token: req.headers.authorization
            }
            const output = await this.postBusiness.getPosts(input)
            res.status(200).send(output)
            
        } catch (error) {
            console.log(error)
            if(error instanceof BaseError){
                res.status(error.statusCode).send(error.message)
            }else{
                res.status(500).send("Erro Inesperado")
            }
            
        }
}
    public createPosts = async (req: Request, res: Response)=>{
        try {
           const input: CreatePostInputDTO = {
                token: req.headers.authorization,
                content: req.body.content
           }
            await this.postBusiness.createPost(input)
            res.status(201).end()

        } catch (error) {
            console.log(error)
            if(error instanceof BaseError){
                res.status(error.statusCode).send(error.message)
            }else{
                res.status(500).send("Erro Inesperado")
            }
            
        }
}

    public editPosts = async (req: Request, res: Response)=>{
        try {
            const input: EditPostInputDTO = {
                idToEdit: req.params.id,
                content: req.body.content,
                token: req.headers.authorization
            }

            await this.postBusiness.editPost(input)
            res.status(200).end()
            
        } catch (error) {
            console.log(error)
            if(error instanceof BaseError){
                res.status(error.statusCode).send(error.message)
            }else{
                res.status(500).send("Erro Inesperado")
            }
            
        }
    }
}