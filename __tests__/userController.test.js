const { ObjectId } = require('mongodb');
const userModel = require('../models/user');
const { getAll, getSingle } = require('../controllers/user');

// Mock the userModel methods
jest.mock('../models/user');

describe('User Controller', () => {
  // Silence console.error output during tests
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = { params: {} };
    mockRes = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all users with 200', async () => {
      const mockUsers = [
        {
          _id: '68956f18a49977c9f965ef4a',
          userName: 'hasdfha',
          email: 'hasdfhas@gmail.com',
          role: 'client',
        },
        {
          _id: '689614ed1ad8b4186929ae3e',
          userName: 'any',
          email: 'hasd324fhas@gmail.com',
          role: 'client',
        },
        {
          _id: '6896ee4cf5c4940d2156b50e',
          userName: 'any2',
          email: 'hasd324fhas@gmail.com',
          role: 'cashier',
        },
        {
          _id: '68998ebd77d1e6d62329cc8b',
          userName: 'kathy',
          email: 'kc_telyn@yahoo.com',
          role: 'admin',
        },
      ];

      userModel.getAll.mockResolvedValue(mockUsers);

      await getAll(mockReq, mockRes);

      expect(userModel.getAll).toHaveBeenCalled();
      expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should handle errors and return 500', async () => {
      userModel.getAll.mockRejectedValue(new Error('DB Error'));

      await getAll(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });

  describe('getSingle', () => {
    it('should return a single user with 200', async () => {
      const userId = new ObjectId();
      const mockUser = {
        _id: userId.toHexString(),
        userName: 'kathy',
        email: 'kc_telyn@yahoo.com',
        role: 'admin',
      };
      mockReq.params.id = userId.toHexString();

      // Note: the controller converts string ID to ObjectId internally,
      // so we expect getById to be called with an ObjectId instance.
      userModel.getById.mockResolvedValue(mockUser);

      await getSingle(mockReq, mockRes);

      expect(userModel.getById).toHaveBeenCalledWith(userId);
      expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return 404 if user not found', async () => {
      const userId = new ObjectId();
      mockReq.params.id = userId.toHexString();
      userModel.getById.mockResolvedValue(null);

      await getSingle(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should handle errors and return 500', async () => {
      mockReq.params.id = 'invalid-id';
      userModel.getById.mockRejectedValue(new Error('Invalid ID'));

      await getSingle(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });
});
