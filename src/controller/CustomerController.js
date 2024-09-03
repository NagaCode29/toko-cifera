class CustomerController {
    #customerService;
    constructor(customerService) {
        this.#customerService = customerService;

        this.getCustomersHandler = this.getCustomersHandler.bind(this);
        this.postCustomerHandler = this.postCustomerHandler.bind(this);

        this.putCustomerHandler = this.putCustomerHandler.bind(this);
        this.deleteCustomerHandler = this.deleteCustomerHandler.bind(this);
        this.searchCustomersByDateHandler = this.searchCustomersByDateHandler.bind(this);
        this.searchCustomersByKeywordHandler = this.searchCustomersByKeywordHandler.bind(this);
        this.getOrdersCustomerHandler = this.getOrdersCustomerHandler.bind(this);
        this.getOrdersCustomerByDateHandler = this.getOrdersCustomerByDateHandler.bind(this);
    }

    async getCustomersHandler(req,res,next){
        try {
            const customers = await this.#customerService.getAllCustomers();
            res.render('customer/customers',{title: 'Customers',customers});
        }catch (e) {
            next(e);
        }
    }

    async getAddCustomerHandler(req,res,next){
        res.redirect('/customers');
    }

    async postCustomerHandler(req,res,next){
        try{
            await this.#customerService.addCustomer(req.body);
            const customers = await this.#customerService.getAllCustomers();
            res.render('customer/customers.pug',{title:'Customers', message:'customer added', status: 'success', customers});
        }catch (e) {
            const customers = await this.#customerService.getAllCustomers();

            res.render('customer/customers.pug',{title:'Customers', message:e.message, status: 'danger', customers});
        }
    }

    async getUpdateCustomerHandler(req,res,next){
        res.redirect('/customers');
    }

    async putCustomerHandler(req,res,next){
        try {
            const {id = ''} = req.params

            await this.#customerService.updateCustomer(id,req.body);
            const customers = await this.#customerService.getAllCustomers();
            res.render('customer/customers.pug',{title:'Update Customer', message: 'customer update successfully', status: 'success', customers});
        }catch (e) {
            const customers = await this.#customerService.getAllCustomers();

            res.render('customer/customers.pug',{title:'Update Customer', message: e.message, status: 'danger',customers});
        }
    }

    async deleteCustomerHandler(req,res,next){
        try{
            const {id = ''} = req.params;

            await this.#customerService.deleteCustomer(id);
            const customers = await this.#customerService.getAllCustomers();

            res.render('customer/customers',{title: 'Customers', customers, message: 'customer delete successfully', status: 'success'});
        }catch (e) {
            const customers = await this.#customerService.getAllCustomers();

            res.render('customer/customers',{title: 'Customers', customers, message: e.message, status: 'danger'});
        }
    }

    async searchCustomersByDateHandler(req,res,next){
        try{
            const customers = await this.#customerService.searchCustomersByDate(req.query);

            res.render('customer/customers',{title: 'Customers', customers});
        }catch (e) {
            res.redirect('/customers');
        }
    }

    async searchCustomersByKeywordHandler(req,res,next){
        try{
            const customers = await this.#customerService.searchCustomersByKeyword(req.query);

            res.send(customers);
        }catch (e) {
            res.send(e.message);
            // res.redirect('/customers');
        }
    }

    async getOrdersCustomerHandler(req,res,next){
        try {
            const {id = ''} = req.params;

            const {orders, customer} = await this.#customerService.getOrdersCustomersById(id);

            res.render('customer/customer-orders.pug',{title:'Orders Customer', orders, customer})
        }catch (e) {
            const customers = await this.#customerService.getAllCustomers();
            res.render('customer/customers',{title: 'Customers',customers, message: e.message, status: 'danger'});
        }
    }

    async getOrdersCustomerByDateHandler(req,res,next){
        try {
            const {id = ''} = req.params;

            const {orders, customer} = await this.#customerService.getOrdersCustomerByDate(id, req.query);

            res.render('customer/customer-orders.pug',{title:'Orders Customer', orders, customer})
        }catch (e) {
            const customers = await this.#customerService.getAllCustomers();
            res.render('customer/customers',{title: 'Customers',customers, message: e.message, status: 'danger'});
        }
    }
}

export default CustomerController;
