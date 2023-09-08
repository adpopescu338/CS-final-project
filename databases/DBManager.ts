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
  host?: string;
  user: string;
  password: string;
  port?: number;
  database?: string;
};

export interface DBManager<Client> {
  /**
   * Connect to the database
   * @param connectionDetails optional connection details. If not provided, will connect as admin
   * @returns a promise that resolves to the client
   */
  connect(connectionDetails?: ConnectionDetails): Promise<Client>;

  /**
   * @description Create a database and user with all privileges on that database
   * @param userDetails.username the username of the user to create
   * @param userDetails.password the password of the user to create
   * @param userDetails.database the database to create the user for
   * @returns a promise that resolves to the user details and the connection url
   */
  createDbAndUser(userDetails: UserDetails): Promise<UserCreatedDetails>;

  /**
   * @description Delete a user from the database
   * @param username the username of the user to delete
   */
  deleteUser(username: string): Promise<void>;

  /**
   * @description Delete a database
   * @param databaseName the name of the database to delete
   */
  deleteDatabase(databaseName: string): Promise<void>;

  /**
   * @description Check if a user was created successfully
   * @param connectionDetails the connection details of the user to check
   * @returns a promise that resolves to true if the user was created successfully and false otherwise
   */
  checkUserCreation(connectionDetails: ConnectionDetails): Promise<boolean>;
}
