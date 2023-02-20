import { PostDatabase } from "../database/PostDatabase";
import { CreatePostInputDTO, DeletePostInputDTO, EditPostInputDTO, GetPostInputDTO, GetPostOutputDTO, LikeOrDislikePostInputDTO } from "../dtos/userDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { Post } from "../models/Post";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { LikeDislikeDB, LIKED_OR_DISLIKED, PostDB, PostWithCreatorDB, USER_ROLES } from "../types";

export class PostBusiness{
    constructor (
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ){}

    public getPosts = async (input: GetPostInputDTO): Promise<GetPostOutputDTO> => {
        const {token} = input

        if(!token){
            throw new BadRequestError("'token' ausente")
        }
        const payload = this.tokenManager.getPayload(token)

        if(payload === null){
            throw new BadRequestError("token inválido")
        }

        const postsWithCreatorsDB:PostWithCreatorDB[] = await this.postDatabase.getPostsWithCreators()

        const posts = postsWithCreatorsDB.map((postWithCreatorDB)=>{
            const post = new Post (
                postWithCreatorDB.id,
                postWithCreatorDB.content,
                postWithCreatorDB.likes,
                postWithCreatorDB.dislikes,
                postWithCreatorDB.created_at,
                postWithCreatorDB.updated_at,
                postWithCreatorDB.creator_id,
                postWithCreatorDB.creator_name

            )
            return post.toBusinessModel()
        })
        const output: GetPostOutputDTO = posts
        return posts
    }
    public createPost = async (input: CreatePostInputDTO): Promise<void> =>{
        const {token, content} = input

        if(!token){
            throw new BadRequestError("'token' ausente")
        }
        const payload = this.tokenManager.getPayload(token)

        if(payload === null){
            throw new BadRequestError("token inválido")
        }
        if(typeof content !== "string"){
            throw new BadRequestError("'content' dever ser string")
        }
        const id = this.idGenerator.generate()
        const createdAt = new Date().toISOString()
        const updatedAt = new Date().toISOString()
        const creatorId = payload.id
        const creatorName = payload.name

        const post = new Post(
            id,
            content,
            0,
            0,
            createdAt,
            updatedAt,
            creatorId,
            creatorName
        )
        const postDB = post.toDBModel()
        await this.postDatabase.insert(postDB)
    }

    public editPost = async (input: EditPostInputDTO): Promise<void> =>{
        const {idToEdit, token, content} = input

        if(!token){
            throw new BadRequestError("'token' ausente")
        }
        const payload = this.tokenManager.getPayload(token)

        if(payload === null){
            throw new BadRequestError("token inválido")
        }
        if(typeof content !== "string"){
            throw new BadRequestError("'content' dever ser string")
        }

        const postDB = await this.postDatabase.findById(idToEdit)

        if(!postDB){
            throw new NotFoundError("'id' não localizado")
        }
        const creatorId = payload.id

        if(postDB.creator_id !== payload.id){
            throw new BadRequestError("Somente o autor do post pode editá-lo")
        }

        const creatorName = payload.name

        const post = new Post(
            postDB.id,
            postDB.content,
            postDB.likes,
            postDB.dislikes,
            postDB.created_at,
            postDB.updated_at,
            creatorId,
            creatorName
        )

        post.setContent(content)
        post.setUpdatedAt(new Date().toISOString())

        const updatedPostDB = post.toDBModel()
        await this.postDatabase.update(idToEdit, updatedPostDB)
      
    }

    public deletePost = async (input: DeletePostInputDTO): Promise<void> =>{
        const {idToDelete, token} = input

        if(!token){
            throw new BadRequestError("'token' ausente")
        }
        const payload = this.tokenManager.getPayload(token)

        if(payload === null){
            throw new BadRequestError("token inválido")
        }
       

        const postDB = await this.postDatabase.findById(idToDelete)

        if(!postDB){
            throw new NotFoundError("'id' não localizado")
        }
        const creatorId = payload.id

        if(payload.role !== USER_ROLES.ADMIN && postDB.creator_id !== payload.id){
            throw new BadRequestError("Somente Admins ou o Autor pode deletar o Post")
        }


        
        await this.postDatabase.deleteById(idToDelete)
      
    }

    public likeOrDislikePost = async (input: LikeOrDislikePostInputDTO): Promise<void> =>{
        const {idToLikeOrDislike, token, like} = input

        if(!token){
            throw new BadRequestError("'token' ausente")
        }
        const payload = this.tokenManager.getPayload(token)

        if(payload === null){
            throw new BadRequestError("token inválido")
        }
       
        if(typeof like !== "boolean"){
            throw new BadRequestError("'like' precisa ser true ou false")
        }

        const postWithCreatorDB = await this.postDatabase.findPostWithCreatorById(idToLikeOrDislike)

        if(!postWithCreatorDB){
            throw new NotFoundError("'id' não localizado")
        }
        const creatorId = payload.id
        const likeToDB = like? 1 : 0

        const likeDislikeDB: LikeDislikeDB = {
            user_id: creatorId,
            post_id: postWithCreatorDB.id,
            like: likeToDB
        }
        const post = new Post(
            postWithCreatorDB.id,
            postWithCreatorDB.content,
            postWithCreatorDB.likes,
            postWithCreatorDB.dislikes,
            postWithCreatorDB.created_at,
            postWithCreatorDB.updated_at,
            postWithCreatorDB.creator_id,
            postWithCreatorDB.creator_name
        )

        const likeDislikeExists = await this.postDatabase.findLikeDislikesExists(likeDislikeDB)

        if (likeDislikeExists === LIKED_OR_DISLIKED.LIKED){
            if(like){
                await this.postDatabase.removeLikeDislike(likeDislikeDB)
                post.removeLikes()
            }else{
                await this.postDatabase.updateLikeDislike(likeDislikeDB)
                post.removeLikes()
                post.addLikes()

            }
        }else if(likeDislikeExists === LIKED_OR_DISLIKED.DISLIKED){
            if(like){

                await this.postDatabase.updateLikeDislike(likeDislikeDB)
                post.removeDislikes()
                post.addLikes()
            }else{
                await this.postDatabase.removeLikeDislike(likeDislikeDB)
                post.removeDislikes()
            }
        }else{
            await this.postDatabase.likeOrDislikePost(likeDislikeDB)
            like ? post.addLikes() : post.addDislikes()
        }
          
            const updatedPost = post.toDBModel()
            await this.postDatabase.update(idToLikeOrDislike,updatedPost)
        }

        
}