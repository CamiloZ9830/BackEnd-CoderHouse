const ticketModel = require('../modelsMongo/ticket.model');


class MongoTicketDao {
    constructor () {
        this.model = ticketModel;
    }

    saveTicketPurchase = async (newTicket) => {
        try{
            const saveTicket = await this.model.create(newTicket);
            return saveTicket;
        } catch(e) {
            throw new Error(e.message);
        }
    };


};

module.exports = MongoTicketDao;