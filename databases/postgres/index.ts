import { connect } from './connect';
import { createDbAndUser } from './createDbAndUser';
import { deleteUser } from './deleteUser';
import { deleteDatabase } from './deleteDatabase';
import { Client } from 'pg';
import { DBManager, ConnectionDetails, UserDetails, InternalConnectionDetails } from '../DBManager';
import { getWholeDbSize } from './getWholeDbSize';
import { lockDatabase } from './lockDatabase';

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

  async getWholeDbSize(connectionDetails: InternalConnectionDetails) {
    const db = await this.connect(connectionDetails);
    return getWholeDbSize(db);
  }

  async lockDatabase(
    username: string,
    database: string,
    connectionDetails: InternalConnectionDetails
  ) {
    const db = await this.connect(connectionDetails);
    return lockDatabase(db, database);
  }
}

export const postgresManager = new PostgresManager();
