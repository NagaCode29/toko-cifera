import {getDecodedToken} from "../helper/index.js";

class AuthenticationMiddleware{

    async mustLogin(req, res, next){
        const token = req.cookies && req.cookies['access-token'];
        const decoded = await getDecodedToken(token);

        if (!decoded){
            res.render('user/login',{title:'Login',message:'Please login',status:'danger'});
        }else {
            req.user = decoded;
            next()
        }

    }

    async notLogin(req, res, next){
        const token = req.cookies && req.cookies['access-token'];
        const decoded = await getDecodedToken(token)

        if (!decoded){
            next()
        }else {
            res.redirect('/users/dashboard');
        }
    }

}

export default AuthenticationMiddleware;
