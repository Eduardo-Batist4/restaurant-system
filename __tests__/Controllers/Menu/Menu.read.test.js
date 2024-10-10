const { getMenus } = require('../../../controllers/MenuController');
const { Menu } = require('../../../models/Association');

jest.mock('../../../models/Association');

describe('GET Menu items', () => {
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

    it('Should return (200) and all menu items', async () => {
        const menuItems = [
            {
                name: 'Pizza',
                description: 'Tomato, Cheese',
                price: 20,
                available: true
            },
            {
                name: 'Hamburger',
                description: 'Bread, Lettuce, Tomato, Cheese',
                price: 20,
                available: true
            },
        ]

        Menu.findAll.mockResolvedValue(menuItems);

        await getMenus(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(menuItems);
    });

    it('Should handle internal server erros', async () => {
        Menu.findAll.mockRejectedValue(new Error('Database Error'));

        await getMenus(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error.'});
    });
});