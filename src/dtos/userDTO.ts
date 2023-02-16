import { PostModel } from "../types"

export interface SignupInputDTO{
    name: unknown,
    email: unknown,
    password: unknown
}

export interface SignupOutputDTO{
    token: string
}

export interface LoginInputDTO{
    email: unknown,
    password: unknown
}

export interface LoginOutputDTO{
    token: string
}

export interface GetPostInputDTO{
    token: string | undefined
}

export type GetPosOutputDTO = PostModel[]

export interface CreatePostInputDTO {
    token: string | undefined
}

export interface EditPostInputDTO{
    idToEdit: string,
    token: string | undefined,
    name: unknown
}

export interface DeletePostInputDTO{
    idToDelete: string,
    token: string | undefined
}

export interface LikeOrDislikePostInputDTO{
    idToLikeOrDislike: string,
    token: string | undefined,
    like: unknown
}


