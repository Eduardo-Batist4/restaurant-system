const { updateOrder } = require('../../../controllers/OrderController');
const { Menu, Order, Table, Customer } = require('../../../models/Association');

jest.mock('../../../models/Association');

describe('Updated Orders', () => {
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

    it('Should return (200) if the Order is updated', async () => {
        req.body = {
            menuId: '30',
            tableId: '40',
            status: 'recebido'
        };

        Menu.findOne.mockResolvedValueOnce({ id: '30', price: 80, available: true });
        Table.findOne.mockResolvedValueOnce({ id: '1', number: 40 });
        Order.update.mockResolvedValueOnce([1]);

        await updateOrder(req, res);

        expect(Menu.findOne).toHaveBeenCalledWith({ where: { id: '30' } });
        expect(Table.findOne).toHaveBeenCalledWith({ where: { id: '40' } });
        expect(Order.update).toHaveBeenCalledWith({ menuId: '30', tableId: '40', status: 'recebido', total: 80 }, { where: { id: '1' } });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Success!' });
    });

    it('Should return (400) if ID is not provied', async () => {
        req.params = { id: null }

        await updateOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'ID is required!' });
    });

    it('Should return (400) if all Fields are Empty', async () => {
        req.body = {};

        await updateOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'All fields are required!' });
    });

    it('Should return (404) if Menu item is not found', async () => {
        req.body = {
            menuId: '5',
            tableId: '10',
            status: 'entregue'
        };

        Menu.findOne.mockResolvedValueOnce(null);
        Table.findOne.mockResolvedValueOnce({ id: '20' });

        await updateOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Not Found!' });
    });

    it('Should return (404) if Table is not exist', async () => {
        req.body = {
            menuId: '10',
            tableId: '20',
            status: 'recebido'
        };

        Menu.findOne.mockResolvedValueOnce({ id: '10', price: 50 });
        Table.findOne.mockResolvedValueOnce(null);

        await updateOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Not Found!' });
    });

    it('Should handle internal server erros', async () => {
        req.body = {
            menuId: '10',
            tableId: '20',
            status: 'recebido'
        };

        Menu.findOne.mockRejectedValue(new Error('Database Error'));

        await updateOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error.' });
    });

});