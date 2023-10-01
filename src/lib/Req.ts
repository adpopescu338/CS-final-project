import axios from 'axios';

class Requestor {
  test() {
    return this.get('/api/hello');
  }

  signup(data: { email: string; password: string }) {
    return this.post('/api/signup', data);
  }

  async post(...args: Parameters<typeof axios.post>) {
    try {
      const res = await axios.post(...args);
      return res.data;
    } catch (e) {
      throw e;
    }
  }

  async put(...args: Parameters<typeof axios.put>) {
    try {
      const res = await axios.put(...args);
      return res.data;
    } catch (e) {
      throw e;
    }
  }

  async get(...args: Parameters<typeof axios.get>) {
    try {
      const res = await axios.get(...args);
      return res.data;
    } catch (e) {
      throw e;
    }
  }
}

export const req = new Requestor();
