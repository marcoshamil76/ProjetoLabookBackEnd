import jwt from 'jsonwebtoken'
import dotenv from 'dotenv' 
import { TokenPayload } from '../types'


dotenv.config()

export class TokenManager {

    // cria o token em string a partir de um payload (objeto JSON)
    public createToken = (payload: TokenPayload): string => {
        const token = jwt.sign(
            payload,
            process.env.JWT_KEY as string,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        )

        return token
    }

    // valida e converte o token em string para o payload em objeto JSON
    public getPayload = (token: string): TokenPayload | null => {
        try {
            const payload = jwt.verify(
                token,
                process.env.JWT_KEY as string
            )
            return payload as TokenPayload
            // se a validação falhar, um erro é disparado pelo jsonwebtoken
            // o erro é capturado aqui e retorna null para a Business informando que falhou
        } catch (error) {
            return null
        }
    }
    
}