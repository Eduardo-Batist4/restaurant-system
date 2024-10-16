const { getTables } = require('../../../controllers/TableController');
const { Table, Customer } = require('../../../models/Association');

jest.mock('../../../models/Association');

describe('GET Tables', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {} },
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
    });

    afterEach(() => {
        jest.clearAllMocks()
    });

    it('Should return (200) and all tables', async () => {
        const mockTables = [
            {
                id: 1,
                number: 25,
                clientId: 2,
                Customer: [
                    {
                        name: 'Gabriel Fallen'
                    }
                ]
            },
            {
                id: 2,
                number: 18,
                clientId: 3,
                Customer: [
                    {
                        name: 'FerGod'
                    }
                ]
            }
        ];

        Table.findAll.mockResolvedValue(mockTables);

        await getTables(req, res);

        expect(Table.findAll).toHaveBeenCalledWith({
            include: [{
                model: Customer,
                attributes: { exclude: ['id', 'email', 'createdAt', 'updatedAt'] },
            }],
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockTables);
    });

    it('Should handle internal server errors', async () => {
        Table.findAll.mockRejectedValue(new Error('Database Error'));
        
        await getTables(req, res);

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error.' })
    });
});