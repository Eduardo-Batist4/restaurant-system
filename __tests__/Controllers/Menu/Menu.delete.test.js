const { deleteMenu } = require('../../../controllers/MenuController');
const { Menu } = require('../../../models/Association');

jest.mock('../../../models/Association');

describe('Delete Menu item', () => {
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

    it('Should return (200) if the Menu item is deleted', async () => {
        Menu.destroy.mockResolvedValue(true)

        await deleteMenu(req, res);

        expect(Menu.destroy).toHaveBeenCalledWith({ where: { id: '1' } });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Success!' });
    });

    it('Should return (400) if the ID are Empty', async () => {
        req.params = {}

        await deleteMenu(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'ID is required!' });
    });

    it('Should handle internal server errors', async () => {
        Menu.destroy.mockRejectedValue(new Error('Database Error'));

        await deleteMenu(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error.' });
    });
});