import {comparePassword, createToken, createUniqueId, hashPassword, validate} from '../helper/index.js';
import InvariantError from "../exception/InvariantError.js";
import User from "../model/User.js";
import userSchema from '../validator/schema/user-schema.js';

class UserService {
    #userRepository;
    constructor(userRepository) {
        this.#userRepository = userRepository;
    }

    async addUser(request) {
        const data = validate(userSchema.addUserSchema,request);

        const {email, password, name} = data;

        const userCheck = await this.#userRepository.getByEmail(email);

        if (userCheck.length > 0) {
            throw new InvariantError('user already exists');
        }

        const id = createUniqueId();
        const hashPw = hashPassword(password);
        const user = new User(id,email,hashPw,name);

        await this.#userRepository.save(user);
        return id;
    }

    async login(request){
        const data = validate(userSchema.loginUserSchema,request);
        const {email, password} = data;

        const result = await this.#userRepository.getByEmail(email);

        if (result.length === 0) {
            throw new InvariantError('email or password is wrong');
        }
        const hashPassword = result[0].password;
        const checkPw = comparePassword(password, hashPassword);

        if (!checkPw) {
            throw new InvariantError('email or password is wrong');
        }

        return createToken({id: result[0].id});
    }

}

export default UserService;
