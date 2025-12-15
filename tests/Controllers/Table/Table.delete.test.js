const { deleteTable } = require('../../../controllers/TableController');
const { Table } = require('../../../models/Association');

jest.mock('../../../models/Association');

describe('GET Tables', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { id: '1' }, 
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

    it('Should return (200) if the Table is deleted', async () => {
        Table.findByPk.mockResolvedValue(true);
        Table.destroy.mockResolvedValue(true);

        await deleteTable(req, res);

        expect(Table.destroy).toHaveBeenCalledWith({ where: { id: '1' } });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Success!' });
    });

    it('Should return (400) if ID is not provied', async () => {
        req.params = { id: null };

        await deleteTable(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'ID is required!' });
    });
    
    it("Should return (404) if Table doesn't exist", async () => {
        Table.findByPk.mockResolvedValue(false);

        await deleteTable(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Table doesn't exist!" });
    });

    it("Should handle internal server erros", async () => {
        Table.findByPk.mockRejectedValue(new Error('Database Error'));

        await deleteTable(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error." });
    });
});