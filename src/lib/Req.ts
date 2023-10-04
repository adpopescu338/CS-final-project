import axios from 'axios';
import * as Signin from 'routes/auth/signin/schemas';
import * as Me from 'routes/auth/me/schemas';
import { ClientSession } from 'src/types';

class Requestor {
  private refreshToken = '';

  test() {
    return this.get('/api/hello');
  }

  signup(data: { email: string; password: string }) {
    return this.post('/api/signup', data);
  }

  confirmOtp(otp: string) {
    return this.post('/api/confirm-otp', { otp });
  }

  /**
   * Authenticates, and stores the refresh token in memory.
   */
  async signin(data: Signin.ReqPayload['body']): Promise<void> {
    const res = await this.post<Signin.Result>('/api/signin', data);
    this.refreshToken = res.data.refreshToken;
    console.log('Signed in as', res.data.user);

    // const { expiresAt } = res.data;
    // const now = new Date();
    const diff = 1000; //new Date(expiresAt).getTime() - now.getTime();

    setTimeout(this.refreshAccessToken.bind(this), diff);
    this.setSession({
      status: 'authenticated',
      user: res.data.user,
    });
  }

  async me() {
    const result = await this.get<Me.Result>('/api/me');
    if (result.status === 'authenticated') {
      this.setSession({
        status: 'authenticated',
        user: result.data,
      });
    } else {
      this.setSession({
        status: 'unauthenticated',
        user: null,
      });
    }
  }

  private async refreshAccessToken() {
    const res = await axios.post<Signin.Result>('/api/refresh-token', {
      refreshToken: this.refreshToken,
    });
    this.refreshToken = res.data.data.refreshToken;
  }

  private async post<T>(...args: Parameters<typeof axios.post>): Promise<T> {
    try {
      const res = await axios.post(...args);
      return res.data;
    } catch (e) {
      if (e.response?.status === 401) {
        await this.refreshAccessToken();
        const res = await axios.post(...args);
        return res.data;
      }
      throw e;
    }
  }

  private async get<T>(...args: Parameters<typeof axios.get>): Promise<T> {
    try {
      const res = await axios.get(...args);
      return res.data;
    } catch (e) {
      if (e.response?.status === 401) {
        await this.refreshAccessToken();
        const res = await axios.post(...args);
        return res.data;
      }
      throw e;
    }
  }

  setSession(session: ClientSession) {
    throw new Error('Method is not overridden');
  }
}

export const req = new Requestor();
