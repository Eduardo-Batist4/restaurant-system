const { createMenu } = require('../../../controllers/MenuController');
const { Menu } = require('../../../models/Association');

jest.mock('../../../models/Association');

describe('Create Menu', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should return 201 if the menu item is created successfully', async () => {
        req.body = {
            name: 'Pizza',
            description: 'Tomato, Cheese',
            price: 20,
            available: true
        };
    
        Menu.findOne.mockResolvedValueOnce(false);
        Menu.create.mockResolvedValue({ 
            name: 'Pizza',
            description: 'Tomato, Cheese',
            price: 20,
            available: true
        });

        await createMenu(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ name: 'Pizza', description: 'Tomato, Cheese', price: 20, available: true });
    });

    it('Should return (400) if all Fields are Empty', async () => {
        req.body = {};

        await createMenu(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'All fields are required!' });
    });

    it('Should return (409) if the Menu already exists', async () => {
        req.body = {
            name: 'Pizza',
            description: 'Tomato, Calabrese, Cheese',
            price: 20,
            available: true
        };

        Menu.findOne.mockResolvedValue(true);

        await createMenu(req, res);

        expect(Menu.findOne).toHaveBeenCalledWith({ where: { name: 'Pizza' } });
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ error: 'The food already exists!' });
    });

    it('Should handle internal server erros', async () => {
        req.body = {
            name: 'Pizza',
            description: 'Tomato, Cheese',
            price: 20,
            available: true
        };

        Menu.findOne.mockResolvedValue(false);
        Menu.create.mockRejectedValue(new Error('Database Error'));

        await createMenu(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error.' });
    });
});