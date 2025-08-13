import { AuthService } from '../src/services/auth.service';
import { PrismaDb } from '../src/db/prisma.client';

describe('AuthService', () => {
  beforeAll(async () => {
    await PrismaDb.client.$connect();
  });
  afterAll(async () => {
    await PrismaDb.client.$disconnect();
  });

  it('registers a new user', async () => {
    const service = new AuthService();
    const result = await service.register({ email: 'testuser@example.com', password: 'Password123!' });
    expect(result.user.email).toBe('testuser@example.com');
    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
  });

  it('logs in an existing user', async () => {
    const service = new AuthService();
    const result = await service.login({ email: 'testuser@example.com', password: 'Password123!' });
    expect(result.user.email).toBe('testuser@example.com');
    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
  });

  it('finds or creates OAuth user', async () => {
    const service = new AuthService();
    const user = await service.findOrCreateOAuthUser('oauthuser@example.com', 'OAuth User');
    expect(user.email).toBe('oauthuser@example.com');
    expect(user.verified).toBe(true);
  });
});
