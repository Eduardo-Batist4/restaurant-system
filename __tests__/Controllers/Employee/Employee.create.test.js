const { createEmployee } = require('../../../controllers/EmployeeController');
const { hashPassword } = require('../../../utils/bcrypt');
const Employee = require('../../../models/Employee');

jest.mock('../../../models/Employee');
jest.mock('../../../utils/bcrypt');

describe('Create Employee', () => {
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

    it('Should return (201) if the Employee was created successfully', async () => {
        req.body = { name: 'Marcelo Coldzera', email: 'cold@teste.com', password: 'cold123', confirmPassword: 'cold123', position: 'garçom' };

        Employee.findOne
            .mockResolvedValueOnce(false)
            .mockResolvedValueOnce(false)

        const hashedPassword = 'hashedPassword123';
        hashPassword.mockResolvedValue(hashedPassword);

        Employee.create.mockResolvedValueOnce({ name: 'Marcelo Coldzera', email: 'cold@teste.com', password: hashedPassword, position: 'garçom' })

        await createEmployee(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ name: 'Marcelo Coldzera', email: 'cold@teste.com', password: hashedPassword, position: 'garçom' });
    });
});

