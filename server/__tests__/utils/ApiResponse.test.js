const ApiResponse = require('../../utils/ApiResponse');

describe('ApiResponse', () => {
  describe('success()', () => {
    it('returns success:true and the given data, with no message/metadata keys by default', () => {
      const data = { id: 1 };
      const response = ApiResponse.success(data);

      expect(response).toEqual({ success: true, data });
      expect(response).not.toHaveProperty('message');
      expect(response).not.toHaveProperty('metadata');
    });

    it('includes message when provided', () => {
      const response = ApiResponse.success({ id: 1 }, 'Fetched successfully');
      expect(response.message).toBe('Fetched successfully');
    });

    it('includes metadata when provided', () => {
      const metadata = { pagination: { total: 5 } };
      const response = ApiResponse.success([1, 2, 3], '', metadata);
      expect(response.metadata).toEqual(metadata);
    });

    it('omits message when it is an empty string', () => {
      const response = ApiResponse.success({ id: 1 }, '');
      expect(response).not.toHaveProperty('message');
    });
  });

  describe('paginated()', () => {
    it('wraps data with metadata.pagination', () => {
      const data = [{ id: 1 }, { id: 2 }];
      const pagination = { total: 2, page: 1, limit: 10, totalPages: 1 };

      const response = ApiResponse.paginated(data, pagination, 'Pizzas fetched');

      expect(response).toEqual({
        success: true,
        data,
        message: 'Pizzas fetched',
        metadata: { pagination },
      });
    });
  });

  describe('created()', () => {
    it('defaults message to "Resource created successfully"', () => {
      const data = { id: 1 };
      const response = ApiResponse.created(data);

      expect(response).toEqual({
        success: true,
        data,
        message: 'Resource created successfully',
      });
    });

    it('honors a custom message', () => {
      const response = ApiResponse.created({ id: 1 }, 'Pizza created');
      expect(response.message).toBe('Pizza created');
    });
  });

  describe('noContent()', () => {
    it('returns success:true and a message but no data key', () => {
      const response = ApiResponse.noContent();
      expect(response).toEqual({
        success: true,
        message: 'Operation completed successfully',
      });
      expect(response).not.toHaveProperty('data');
    });

    it('honors a custom message', () => {
      const response = ApiResponse.noContent('Custom message');
      expect(response.message).toBe('Custom message');
    });
  });

  describe('loginSuccess()', () => {
    it('wraps the user with a login success message', () => {
      const user = { _id: '1', email: 'a@b.com' };
      const response = ApiResponse.loginSuccess(user);
      expect(response).toEqual({
        success: true,
        data: user,
        message: 'Login successful',
      });
    });
  });

  describe('logoutSuccess()', () => {
    it('returns a no-content style logout response', () => {
      const response = ApiResponse.logoutSuccess();
      expect(response).toEqual({
        success: true,
        message: 'Logout successful',
      });
    });
  });

  describe('updated()', () => {
    it('defaults message to "Resource updated successfully"', () => {
      const data = { id: 1, name: 'x' };
      const response = ApiResponse.updated(data);
      expect(response).toEqual({
        success: true,
        data,
        message: 'Resource updated successfully',
      });
    });
  });

  describe('deleted()', () => {
    it('defaults message to "Resource deleted successfully" and has no data key', () => {
      const response = ApiResponse.deleted();
      expect(response).toEqual({
        success: true,
        message: 'Resource deleted successfully',
      });
      expect(response).not.toHaveProperty('data');
    });
  });
});
