import { getAvailableService, deploy } from 'libs/k8';
import { DatabaseStatus, Pod } from '@prisma/client';
import { mongoManager, mysqlManager, postgresManager } from 'databases';
import { DBMS } from 'libs/types';
import { client } from 'prisma/client';
import { BeError } from 'libs/BeError';
import { ErrorCodes } from 'libs/constants';

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
  console.log('availableService', availableService);
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

export const checkIfUserCanCreateDb = async (userId: string, type: DBMS) => {
  const databases = await client.database.findMany({
    where: {
      userId,
      type,
      status: {
        not: DatabaseStatus.Deleted,
      },
    },
  });

  if (!databases?.length) {
    // user doesn't exist in the db yet, so we need to create it
    return {
      shouldCreateUser: true,
    };
  }

  throw new BeError(`You already have a ${type} database. `, ErrorCodes.Forbidden);
};
