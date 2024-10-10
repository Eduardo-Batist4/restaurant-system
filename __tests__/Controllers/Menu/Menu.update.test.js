const { updateMenu } = require('../../../controllers/MenuController');
const { Menu } = require('../../../models/Association');

jest.mock('../../../models/Association');

describe('Update Menu', () => {
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

    it('Should return (200) if the Menu Item is updated', async () => {
        req.body = {
            name: 'Pizza',
            description: 'Tomato, Cheese',
            price: 20,
            available: true
        };

        Menu.findOne.mockResolvedValueOnce(true);
        Menu.update.mockResolvedValueOnce([1]);

        await updateMenu(req, res);
        
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Success!' });
    });

    it("Should return (404) if the Menu Item doesn't exist", async () => {
        req.body = {
            name: 'Pizza',
            description: 'Tomato, Cheese',
            price: 20,
            available: true
        };

        Menu.findOne.mockResolvedValue(false);

        await updateMenu(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Not Found!' });
    });

    it('Should return (400) if the ID are Empty', async () => {
        req.params = { id: '' }

        await updateMenu(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'ID is required!' });
    })

    it('Should return (400) if all Fields are Empty', async () => {
        await updateMenu(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'All fields are required!' });
    });

    it('Should handle internal server erros', async () => {
        req.body = {
            name: 'Pizza',
            description: 'Tomato, Cheese',
            price: 20,
            available: true
        };

        Menu.findOne.mockResolvedValueOnce(true);
        Menu.update.mockRejectedValueOnce(new Error('Database Error'));

        await updateMenu(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error.' });
    });
});