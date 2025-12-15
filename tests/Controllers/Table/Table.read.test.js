const { getTables, getTable } = require('../../../controllers/TableController');
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

describe('GET Tables', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { id: 1 }, 
            body: {} 
        },
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
    });

    afterEach(() => {
        jest.clearAllMocks()
    });

    it('Should return (200) if Table is found by ID', async () => {
        const mockTable = [
            {
                id: 3,
                number: 8,
                clientId: 6,
                Customer: {
                    name: 'Coldzera'
                }
            }
        ];

        Customer.findOne.mockResolvedValueOnce(true);
        Table.findByPk.mockResolvedValueOnce(mockTable);

        await getTable(req, res);

        expect(Customer.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
        expect(Table.findByPk).toHaveBeenCalledWith(1, {
            include: [{
                model: Customer,
                attributes: { exclude: ['id', 'email', 'createdAt', 'updatedAt'] },
            }],
        });
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(mockTable);
    });

    it("Should return (404) if Customer doesn't exist", async () => {
        Customer.findOne.mockResolvedValue(false);
        
        await getTable(req, res);

        expect(Customer.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Not Found!' });
    });

    it('Should return (400) if ID is not provied', async () => {
        req.params = { id: null };
        
        await getTable(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'ID is required!' });
    });

    it('Should handle internal server errors', async () => {
        Customer.findOne.mockRejectedValue(new Error('Database Error'));
        
        await getTable(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error.' });
    });
});