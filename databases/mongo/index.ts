import { connect } from './connect';
import { createDbAndUser } from './createDbAndUser';
import { deleteUser } from './deleteUser';
import { deleteDatabase } from './deleteDatabase';
import { MongoClient } from 'mongodb';
import { DBManager, ConnectionDetails, UserDetails, InternalConnectionDetails } from '../DBManager';
import { getWholeDbSize } from './getWholeDbSize';
import { lockDatabase } from './lockDatabase';

class MongoManager implements DBManager<MongoClient> {
  connect(connectionDetails: ConnectionDetails | InternalConnectionDetails) {
    return connect(connectionDetails);
  }

  async createDbAndUser(userDetails: UserDetails, connectionDetails: InternalConnectionDetails) {
    const client = await this.connect(connectionDetails);
    return createDbAndUser(client, userDetails);
  }

  async deleteUser(username: string, connectionDetails: InternalConnectionDetails) {
    const client = await this.connect({ host: connectionDetails.host });
    await deleteUser(client, username, connectionDetails.database as string);
  }

  async deleteDatabase(db: string, connectionDetails: InternalConnectionDetails) {
    const client = await this.connect(connectionDetails);
    await deleteDatabase(client, db);
  }

  async deleteDbAndUser(
    username: string,
    database: string,
    connectionDetails: InternalConnectionDetails
  ) {
    const client = await this.connect(connectionDetails);
    await deleteUser(client, username, database);
    await deleteDatabase(client, database);
  }

  async checkUserCreation(connectionDetails: ConnectionDetails) {
    console.log('checking user creation', connectionDetails);
    try {
      await this.connect(connectionDetails);
      return true;
    } catch (e) {
      console.log('checkUserCreation error', e);
      return false;
    }
  }

  async getWholeDbSize(connectionDetails: ConnectionDetails) {
    const db = await this.connect(connectionDetails);
    return getWholeDbSize(db);
  }

  async lockDatabase(
    username: string,
    database: string,
    connectionDetails: InternalConnectionDetails
  ) {
    const db = await this.connect(connectionDetails);
    return lockDatabase(db, username, database);
  }
}

export const mongoManager = new MongoManager();
