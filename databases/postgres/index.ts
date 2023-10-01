import { connect } from './connect';
import { createDbAndUser } from './createDbAndUser';
import { deleteUser } from './deleteUser';
import { deleteDatabase } from './deleteDatabase';
import { Client } from 'pg';
import { DBManager, ConnectionDetails, UserDetails, InternalConnectionDetails } from '../DBManager';

class PostgresManager implements DBManager<Client> {
  connect(connectionDetails: ConnectionDetails | InternalConnectionDetails) {
    return connect(connectionDetails);
  }

  async createDbAndUser(userDetails: UserDetails, connectionDetails: InternalConnectionDetails) {
    const client = await this.connect(connectionDetails);
    return createDbAndUser(client, userDetails);
  }

  async deleteUser(username: string, connectionDetails: InternalConnectionDetails) {
    const client = await this.connect(connectionDetails);
    await deleteUser(client, username);
  }

  async deleteDatabase(db: string, connectionDetails: InternalConnectionDetails) {
    const client = await this.connect(connectionDetails);
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

export const postgresManager = new PostgresManager();
