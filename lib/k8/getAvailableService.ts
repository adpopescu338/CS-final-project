import { DBMS } from '@prisma/client';
import { client } from 'prisma/client';
import { MAX_DATABASES_PER_POD, MAX_SIZE_PER_DATABASE, POD_STORAGE_GIGA } from 'libs/constants';
import { getServiceInternalAddress } from './getServiceInternalAddress';
import { getDbManager } from 'libs/utils';

export const getAvailableService = async (db: DBMS) => {
  const pods = await client.pod.findMany({
    where: {
      deploymentName: {
        startsWith: db,
      },
    },
    include: {
      _count: {
        select: {
          databases: true,
        },
      },
    },
  });

  if (!pods.length) {
    return null;
  }

  for (const pod of pods) {
    if (pod._count?.databases >= MAX_DATABASES_PER_POD) {
      continue;
    }
    const dbManager = getDbManager(db);
    const usedSpaceInMegabytes = await dbManager.getWholeDbSize({
      host: pod.internalAddress,
    });
    const usedSpaceInGigabytes = usedSpaceInMegabytes / 1000;
    const availableSpaceInGigabytes = POD_STORAGE_GIGA - usedSpaceInGigabytes;
    if (availableSpaceInGigabytes < MAX_SIZE_PER_DATABASE) {
      continue;
    }

    return {
      deploymentName: pod.deploymentName,
      publicIpAddress: pod.publicIp,
      internalAddress: getServiceInternalAddress(pod.serviceName),
    };
  }

  return null;
};
