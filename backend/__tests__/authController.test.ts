import { register } from '../controllers/authController';

jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));
const { validationResult } = require('express-validator');
import { Request, Response } from 'express';

describe('Auth Controller', () => {
  it('should return 400 if validation errors exist during registration', async () => {
    const req = {
      body: {},
    } as Request;

    const json = jest.fn();
    const status = jest.fn(() => ({ json }));

    const res = {
      status,
    } as unknown as Response;

    // Mock validationResult to simulate errors
    (validationResult as jest.Mock).mockReturnValueOnce({
      isEmpty: () => false,
      array: () => [{ msg: 'Validation error' }],
    });

    await register(req, res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: expect.any(Array),
      })
    );
  });
});