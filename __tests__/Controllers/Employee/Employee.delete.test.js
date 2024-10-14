const { deleteEmployee } = require('../../../controllers/EmployeeController');
const Employee = require('../../../models/Employee');

jest.mock('../../../models/Employee');

describe('Delete Employee', () => {
    let req, res;

    beforeEach(() => {
        req = { 
            params: { id: '1' },
            body: {}, 
        },
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should return (200) if the Employee is deleted', async () => {
        Employee.findByPk.mockResolvedValue(true);
        Employee.destroy.mockResolvedValue(true)

        await deleteEmployee(req, res);

        expect(Employee.findByPk).toHaveBeenCalledWith(req.params.id);
        expect(Employee.destroy).toHaveBeenCalledWith({ where: { id: '1'} });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith('Success!');
    });

    it('Should return (400) if ID is not provied', async () => {
        req.params = {};

        await deleteEmployee(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'ID is required!' });
    });

    it('Should return (404) if the Employee is not found', async () => {
        Employee.findByPk.mockResolvedValue(false);

        await deleteEmployee(req, res);

        expect(Employee.findByPk).toHaveBeenCalledWith('1');
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Not Found!'});
    });

    it('Should handle internal server erros', async () => {
        Employee.findByPk.mockRejectedValue(new Error('Database Error'));

        await deleteEmployee(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error.' });
    });
});