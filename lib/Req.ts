import axios from 'axios';
import * as Signup from 'pages/api/auth/signup';
import * as NewDb from 'pages/api/db/create';
import * as Databases from 'pages/api/db';
import * as DeleteDb from 'pages/api/db/[id]/delete';

class Requestor {
  signup(data: Signup.ReqPayload['body']) {
    return this.post<Signup.Result>('/api/signup', data);
  }

  confirmOtp(otp: string) {
    return this.post('/api/confirm-otp', { otp });
  }

  async getDatabases() {
    const d = await this.get<Databases.Result>('/api/db');
    return d.data;
  }

  createNewDb(body: NewDb.ReqPayload['body']) {
    return this.post<NewDb.Result>(`/api/db/create`, body);
  }

  deleteDb = (id: string) => {
    return this.delete<DeleteDb.Result>(`/api/db/${id}/delete`);
  };

  private async post<T>(...args: Parameters<typeof axios.post>): Promise<T> {
    try {
      const res = await axios.post(...args);
      return res.data;
    } catch (e: any) {
      console.error(`An error occurred while making a GET request to ${args[0]}`, e);
      if (e.response?.data?.message) {
        // overwrite the error message, to display the one from the server
        e['message'] = e.response.data.message;
      }
      throw e;
    }
  }

  private async delete<T>(...args: Parameters<typeof axios.delete>): Promise<T> {
    try {
      const res = await axios.delete(...args);
      return res.data;
    } catch (e: any) {
      console.error(`An error occurred while making a DELETE request to ${args[0]}`, e);
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
    } catch (e: any) {
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
