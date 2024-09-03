class UserController {
    #userService;
    constructor(userService) {
        this.#userService = userService;

        this.postUserHandler = this.postUserHandler.bind(this);
        this.postUserLoginHandler = this.postUserLoginHandler.bind(this);
    }

    async getRegisterUserHandler(req,res){
        res.render('user/register',{title:'Register'});
    }

    async postUserHandler(req,res){
        try {
            await this.#userService.addUser(req.body);

            res.render('user/login',{message: 'Register successfully',status:'success',title:'Login'});
        }catch (e) {
            res.render('user/register',{message: e.message, status:'danger',title:'Register'});
        }
    }

    async getUserLoginHandler(req,res){
        res.render('user/login',{title:'Login'});
    }

    async postUserLoginHandler(req,res,next){
        try {
            const token = await this.#userService.login(req.body);

            res.cookie('access-token',token,{httpOnly: true, expires: new Date(Date.now() + 24 * 3600000)});
            res.redirect('/users/dashboard')
        }catch (e) {
            res.render('user/login',{message: e.message, status:'danger',title:'Login'});
        }
    }

    async getUserLogoutHandler(req,res){
        res.clearCookie('access-token');
        res.redirect('/users/login');
    }

    async getUserHomeHandler(req,res,next){
        try{
            const user = req.user;

            return res.render('index',{title: 'Dashboard',user})
        }catch (e) {
            res.redirect('/users/login')
        }
    }
}

export default UserController;
