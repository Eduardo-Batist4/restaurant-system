const { deleteOrder } = require('../../../controllers/OrderController');
const { Order } = require('../../../models/Association');

jest.mock('../../../models/Association');

describe('Delete Orders', () => {
    let req, res;

    beforeEach(() => {
        req = { 
            params: { id: '1' },
            body: {} 
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should return (200) if the Order is deleted', async () => {
        Order.destroy.mockResolvedValue(true);

        await deleteOrder(req, res);

        expect(Order.destroy).toHaveBeenCalledWith({ where: { id: '1' } });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Success!' });
    });

    it('Should return (400) if ID is not provied', async () => {
           req.params = {};
        
           await deleteOrder(req, res);

           expect(res.status).toHaveBeenCalledWith(400);
           expect(res.json).toHaveBeenCalledWith({ error: 'ID is required!' });
    });

    it('Should handle internal server erros', async () => {
        Order.destroy.mockRejectedValue(new Error('Database Error'));

        await deleteOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error.' });
    });  
});