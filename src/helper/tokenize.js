import jwt from 'jsonwebtoken';
import UserRepository from "../repository/UserRepository.js";

const userRepository = new UserRepository();

export function createToken(payload){
    return jwt.sign(payload,process.env.PRIVATE_KEY, {expiresIn: '24h'});
}

export function verifyToken(token){
    return jwt.verify(token,process.env.PRIVATE_KEY);
}

export async function getDecodedToken(token){
    if(!token){
        return null;
    }
    try {
        const decoded = verifyToken(token);
        const result = await userRepository.getById(decoded.id);

        if (result.length === 0) return null;

        return result[0];
    }catch (e) {
        return null;
    }
}
