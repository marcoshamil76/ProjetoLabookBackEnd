import { PostDatabase } from "../database/PostDatabase";
import { GetPostInputDTO, GetPostOutputDTO } from "../dtos/userDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { Post } from "../models/Post";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { postWithCreatorDB } from "../types";

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

        const postsWithCreatorsDB: postWithCreatorDB [] = await this.postDatabase.getPostsWithCreators()

        const posts = postsWithCreatorsDB.map((postWithCreatorDB)=>{
            const post = new Post (
                postWithCreatorDB.id,
                postWithCreatorDB.name,
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
}