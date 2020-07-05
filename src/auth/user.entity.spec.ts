import { UserEntity } from './user.entity';
import * as bcrypt from 'bcrypt';

describe('UserEntity Entity', () => {
  let user: UserEntity;

  beforeEach(() => {
    user = new UserEntity();
    user.salt = 'testSalt';
    user.password = 'testPassword';
    bcrypt.hash = jest.fn();
  });

  describe('validateCredentials', () => {
    it('returns true as password is valid', async () => {
      bcrypt.hash.mockResolvedValue('testPassword');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await user.validatePassword('testPassword');
      expect(bcrypt.hash).toHaveBeenCalledWith('testPassword', 'testSalt');
      expect(result).toEqual(true);
    });

    it('returns false as password is invalid', async () => {
      bcrypt.hash.mockResolvedValue('some wrong password');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await user.validatePassword('testPassword');
      expect(bcrypt.hash).toHaveBeenCalledWith('testPassword', 'testSalt');
      expect(result).not.toEqual(true);
    });
  });
});
