class OrderController {
    #orderService;
    constructor(orderService) {
        this.#orderService = orderService;

        this.getOrdersHandler = this.getOrdersHandler.bind(this);
        this.getAddOrderHandler = this.getAddOrderHandler.bind(this);
        this.postOrderHandler = this.postOrderHandler.bind(this);
        this.getDetailOrderHandler = this.getDetailOrderHandler.bind(this);
        this.getAllOrdersByDateHandler = this.getAllOrdersByDateHandler.bind(this);
        this.deleteOrderHandler = this.deleteOrderHandler.bind(this);
        this.updateOrderHandler = this.updateOrderHandler.bind(this);
        this.getAllOrdersByKeywordHandler = this.getAllOrdersByKeywordHandler.bind(this);
        this.getInvoice = this.getInvoice.bind(this);
        this.getTotalPaidInWeekHandler = this.getTotalPaidInWeekHandler.bind(this);
        this.getTotalSalesInWeekHandler = this.getTotalSalesInWeekHandler.bind(this);
    }

    async getOrdersHandler(req,res,next){
        try {
            const orders = await this.#orderService.getAllOrders();
            res.render('order/orders.pug',{title: 'Orders',orders})
        }catch (e) {
            next(e);
        }
    }

    async getAddOrderHandler(req,res,next){
        try {
            const row = this.#orderService.getAddOrder(req.query);
            const products = await this.#orderService.getAllProducts();
            const customers = await this.#orderService.getAllCustomers();

            res.render('order/add-order.pug',{title: 'Add Order',row, products, customers});
        }catch (e) {
            // res.send(e.message);
            res.redirect('/orders');
        }
    }

    async postOrderHandler(req,res,next){
        try{
            await this.#orderService.addOrder(req.body);

            const orders = await this.#orderService.getAllOrders();
            res.render('order/orders.pug',{title: 'Orders',orders, message:'order add successfully', status: 'success'})
        }catch (e){
            const orders = await this.#orderService.getAllOrders();
            res.render('order/orders.pug',{title: 'Orders',orders, message:e.message, status: 'danger'})
        }
    }

    async getDetailOrderHandler(req,res){
        try{
            const {id = ''} = req.params;
            const {order, detailOrder} = await this.#orderService.getDetailOrderById(id);

            res.render('order/detail-order.pug',{title: 'Order detail',order, detailOrder});
        }catch (e) {
            res.redirect('/orders');
        }
    }

    async getAllOrdersByDateHandler(req,res){
        try {
            const orders = await this.#orderService.getOrdersByDate(req.query);
            res.render('order/orders.pug',{title: 'Orders',orders})
        }catch (e) {
            res.redirect('/orders');
        }
    }

    async getAllOrdersByKeywordHandler(req,res,next){
        try {
            const orders = await this.#orderService.getOrdersByKeyword(req.query);

            res.send(orders);
        }catch (e) {
            res.send(e.message);
        }
    }

    async deleteOrderHandler(req,res,next){
        try {
            const {id = ''} = req.params;
            await this.#orderService.deleteOrder(id);
            const orders = await this.#orderService.getAllOrders();

            res.render('order/orders.pug',{title: 'Orders',orders, message:'order deleted successfully', status: 'success'})
        }catch (e) {
            const orders = await this.#orderService.getAllOrders();
            res.render('order/orders.pug',{title: 'Orders',orders, message: e.message, status: 'danger'})
        }
    }

    async updateOrderHandler(req,res,next){
        try {

            const {id = ''} = req.params;
            await this.#orderService.updateOrderById(id,req.body);

            const orders = await this.#orderService.getAllOrders();

            res.render('order/orders.pug',{title: 'Orders',orders, message:'order update successfully', status: 'success'})
        }catch (e) {
            const orders = await this.#orderService.getAllOrders();
            res.render('order/orders.pug',{title: 'Orders',orders, message: e.message, status: 'danger'})
        }
    }

    async getInvoice(req,res){
        try {
            const {id = ''} = req.params;
            const {order, detailOrder} = await this.#orderService.getDetailOrderById(id);

            res.render('order/invoice.pug',{title: 'Invoice',order, detailOrder});
        }catch (e) {
            res.redirect('/orders');
        }
    }

    async getTotalPaidInWeekHandler(req,res){
        try {
            const totalPaidDates = await this.#orderService. getTotalPaidOrdersInWeek();
            res.send(totalPaidDates);
        }catch (e) {
            res.send(e);
        }
    }

    async getTotalSalesInWeekHandler(req,res){
        try {
            const totalSales = await this.#orderService.getTotalSalesInWeek();

            res.send(totalSales);
        }catch (e) {
            res.send(e);
        }
    }
}

export default OrderController;