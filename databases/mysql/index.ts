import { connect } from './connect';
import { createDbAndUser } from './createDbAndUser';
import { deleteUser } from './deleteUser';
import { deleteDatabase } from './deleteDatabase';
import { Connection } from 'mysql2';
import { DBManager, ConnectionDetails, UserDetails } from '../DBManager';

class MysqlManager implements DBManager<Connection> {
  connect(connectionDetails?: ConnectionDetails) {
    return connect(connectionDetails);
  }

  async createDbAndUser(userDetails: UserDetails) {
    const client = await this.connect();
    return createDbAndUser(client, userDetails);
  }

  async deleteUser(username: string) {
    const client = await this.connect();
    await deleteUser(client, username);
  }

  async deleteDatabase(db: string) {
    const client = await this.connect();
    await deleteDatabase(client, db);
  }

  async checkUserCreation(connectionDetails: ConnectionDetails) {
    try {
      await this.connect(connectionDetails);
      return true;
    } catch (e) {
      return false;
    }
  }
}

export const mysqlManager = new MysqlManager();
