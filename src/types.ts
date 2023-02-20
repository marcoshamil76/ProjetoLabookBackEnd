export enum USER_ROLES {
    USER = "USER",
    ADMIN = "ADMIN"
}

export enum LIKED_OR_DISLIKED {
    LIKED = "Already liked",
    DISLIKED = "Already disliked"
}

export interface TokenPayload {
    id: string,
    name: string,
    role: USER_ROLES
}

export interface PostModel {
    id: string,
    content: string,
    likes: number,
    dislikes: number,
    createdAt: string,
    updatedAt: string,
    creator: {
            id: string,
            name: string
    }
}

export interface PostDB {
    id: string,
    creator_id: string,
    content: string,
    likes: number,
    dislikes: number,
    created_at: string,
    updated_at: string

}

export interface PostWithCreatorDB extends PostDB{
    
    creator_name: string
}


export interface UserDB {
    id: string,
    name : string,
    email: string,
    password: string,
    role: USER_ROLES,
    created_at: string,
}

export interface UserModel {
    id: string,
    name : string,
    email: string,
    password: string,
    role: string,
    createdAt: string,
}

export interface LikeDislikeDB{
    user_id: string,
    post_id: string,
    like: number
}