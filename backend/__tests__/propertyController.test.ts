const propertyService = require('../services/propertyService');
const propertyController = require('../controllers/propertyController');
import { Request, Response } from 'express';

jest.mock('../services/propertyService');

describe('Property Controller', () => {
  const mockReq = {
    body: {},
    params: { id: '123' },
  } as unknown as Request;

  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  const next = jest.fn();

  const mockRes = {
    status,
  } as unknown as Response;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a property and return 201', async () => {
    (propertyService.createProperty as jest.Mock).mockResolvedValue({ success: true });

    await propertyController.createProperty(mockReq, mockRes, next);

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith({ success: true });
  });

  it('should update a property and return 200', async () => {
    (propertyService.updateProperty as jest.Mock).mockResolvedValue({ success: true });

    await propertyController.updateProperty(mockReq, mockRes, next);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ success: true });
  });
});