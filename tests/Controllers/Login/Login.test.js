const { login, logout, verifyToken } = require('../../../controllers/LoginController')
const Employee = require('../../../models/Employee');
const { verifyPassword } = require('../../../utils/bcrypt')
const jwt = require('jsonwebtoken');

jest.mock('../../../models/Employee');
jest.mock('../../../utils/bcrypt');
jest.mock('jsonwebtoken');

describe('Login Controller', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {
            email: 'fallen@teste.com',
            password: 'fallen123'
        } };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should return (200) and a token if login is successful', async () => {
        const mockEmployee = {
            id: 1,
            email: 'taco@teste.com',
            name: 'Taco',
            password: 'taco123'
        };

        Employee.findOne.mockResolvedValueOnce(mockEmployee);
        verifyPassword.mockResolvedValueOnce(true);

        const mockToken = 'token12345';
        jwt.sign.mockReturnValue(mockToken);

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Login successful', token: mockToken });
    });

    it("Should return (404) if email doesn't exist", async () => {
        Employee.findOne.mockResolvedValue(false);

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Employee not found!' });
    });
    
    it("Should return (401) if password is incorrect ", async () => {
        Employee.findOne.mockResolvedValue(true);
        verifyPassword.mockResolvedValue(false);

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Wrong Email or Password!' });
    });

    it('Should handle internal server errors', async () => {
        Employee.findOne.mockRejectedValue(new Error('Database Error'));

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error.' });
    });
});

