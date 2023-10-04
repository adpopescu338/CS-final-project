import axios from 'axios';
import * as Signin from 'routes/auth/signin/schemas';
import * as Me from 'routes/auth/me/schemas';
import * as Signup from 'routes/auth/signup/schemas';
import * as NewDb from 'routes/db/newdb/schemas';

class Requestor {
  private refreshToken = '';

  test() {
    return this.get('/api/hello');
  }

  signup(data: Signup.ReqPayload['body']) {
    return this.post<Signup.Result>('/api/signup', data);
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

    window.location.href = '/dashboard';
  }

  async me() {
    return this.get<Me.Result>('/api/me');
  }

  async logout() {
    await this.get('/api/logout');
    window.location.reload();
  }

  createNewDb(body: NewDb.ReqPayload['body'], { type }: NewDb.ReqPayload['params']) {
    return this.post<NewDb.Result>(`/api/newdb/${type}`, body);
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
      console.error(`An error occurred while making a GET request to ${args[0]}`, e);
      if (e.response?.data?.message) {
        // overwrite the error message, to display the one from the server
        e['message'] = e.response.data.message;
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
      console.error(`An error occurred while making a GET request to ${args[0]}`, e);
      if (e.response?.data?.message) {
        // overwrite the error message, to display the one from the server
        e['message'] = e.response.data.message;
      }
      throw e;
    }
  }
}

export const req = new Requestor();
