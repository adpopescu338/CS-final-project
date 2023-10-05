import { getAvailableService, deploy } from 'libs/k8';
import { Pod } from '@prisma/client';
import { mongoManager, mysqlManager, postgresManager } from 'databases';
import { DBMS } from 'libs/types';
import { client } from 'prisma/client';
import { BeError } from 'libs/BeError';
import { ErrorCodes, MAX_DATABASES_ACC_SIZE, MAX_DATABASES_PER_USER } from 'libs/constants';

export const revert = async (
  dbManager: typeof mongoManager | typeof mysqlManager | typeof postgresManager,
  username: string,
  database: string,
  host: string
) => {
  await Promise.all([
    dbManager.deleteUser(username, { host }),
    dbManager.deleteDatabase(database, { host }),
  ]);
};

export const getPodDetails = async (
  dbType: DBMS
): Promise<{
  pod: Pod;
  isNew: boolean;
}> => {
  const availableService = await getAvailableService(dbType);

  if (availableService) {
    const podDetails = await client.pod.findUnique({
      where: {
        deploymentName: availableService.deploymentName,
      },
    });

    if (!podDetails) throw new BeError('Pod not found', ErrorCodes.InternalServerError);
    console.log('available service found, using it');
    return {
      pod: podDetails,
      isNew: false,
    };
  }
  console.log('no available service found, deploying new one');
  const newDeploymentDetails = await deploy(dbType);

  return {
    pod: newDeploymentDetails,
    isNew: true,
  };
};

export const checkIfUserCanCreateDb = async (userId: string) => {
  const databases = await client.database.findMany({
    where: {
      userId,
    },
  });

  if (!databases?.length) {
    // user doesn't exist in the db yet, so we need to create it
    return {
      shouldCreateUser: true,
    };
  }
  if (databases.length > MAX_DATABASES_PER_USER)
    throw new BeError('You have reached the maximum number of databases', ErrorCodes.Forbidden);

  const accumulatedSize = databases.reduce((acc, curr) => acc + curr.size, 0);

  if (accumulatedSize >= MAX_DATABASES_ACC_SIZE)
    throw new BeError(
      `You have reached the maximum size of ${MAX_DATABASES_ACC_SIZE} MB`,
      ErrorCodes.Forbidden
    );

  return {
    shouldCreateUser: false,
  };
};
