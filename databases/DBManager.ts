export type UserDetails = {
  username: string;
  password: string;
  database: string;
};

export type UserCreatedDetails = UserDetails & {
  connectionUrl: string;
  host: string;
  port: number;
};

export type ConnectionDetails = {
  host: string;
  user: string;
  password: string;
  port?: number;
  database?: string;
};

export type InternalConnectionDetails = Partial<ConnectionDetails> & {
  host: string;
};

export interface DBManager<Client> {
  /**
   * Connect to the database
   * @param connectionDetails optional connection details. If not provided, will connect as admin
   * @returns a promise that resolves to the client
   */
  connect(connectionDetails: ConnectionDetails | InternalConnectionDetails): Promise<Client>;

  /**
   * @description Create a database and user with all privileges on that database
   * @param userDetails.username the username of the user to create
   * @param userDetails.password the password of the user to create
   * @param userDetails.database the database to create the user for
   * @returns a promise that resolves to the user details and the connection url
   */
  createDbAndUser(
    userDetails: UserDetails,
    connectionDetails: InternalConnectionDetails
  ): Promise<UserCreatedDetails>;

  /**
   * @description Delete a user from the database
   * @param username the username of the user to delete
   */
  deleteUser(username: string, connectionDetails: InternalConnectionDetails): Promise<void>;

  /**
   * @description Delete a database
   * @param databaseName the name of the database to delete
   */
  deleteDatabase(databaseName: string, connectionDetails: InternalConnectionDetails): Promise<void>;

  /**
   * @description Check if a user was created successfully
   * @param connectionDetails the connection details of the user to check
   * @returns a promise that resolves to true if the user was created successfully and false otherwise
   */
  checkUserCreation(connectionDetails: ConnectionDetails): Promise<boolean>;

  /**
   * @deprecated Returns the of the entire database in megabytes
   * The connection details are going to be the same for all databases (the admin user), but the host can be different
   */
  getWholeDbSize(connectionDetails: InternalConnectionDetails): Promise<number>;

  /**
   * @description Lock a database (prevent writes)
   * @param username the username of the user to lock
   * @param databaseName the name of the database to lock
   * @param connectionDetails the internal connection details
   */
  lockDatabase(
    username: string,
    databaseName: string,
    connectionDetails: InternalConnectionDetails
  ): Promise<void>;
}
