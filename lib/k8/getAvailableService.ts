import { DBMS } from '@prisma/client';
import { filterServicesByAvailableStorage } from './filterServicesByAvailableStorage';
import { client } from 'prisma/client';
import { MAX_DATABASES_PER_POD } from 'libs/constants';
import { getServicePublicIp } from './getServicePublicIp';
import { getServiceInternalAddress } from './getServiceInternalAddress';

export const getAvailableService = async (db: DBMS) => {
  const services = await filterServicesByAvailableStorage(db, 1);

  if (!services.length) {
    return null;
  }

  for (const service of services) {
    const pod = await client.pod.findUnique({
      where: {
        serviceName: service.serviceName,
      },
      include: {
        _count: {
          select: {
            databases: true,
          },
        },
      },
    });
    if (!pod) {
      continue;
    }

    if (!pod.publicIp) {
      const publicIp = await getServicePublicIp(service.serviceName);
      if (publicIp) {
        pod.publicIp = publicIp;
        await client.pod.update({
          where: {
            id: pod.id,
          },
          data: {
            publicIp,
          },
        });
      } else {
        continue;
      }
    }

    if (!pod._count.databases || pod._count.databases < MAX_DATABASES_PER_POD) {
      return {
        deploymentName: service.deploymentName,
        publicIpAddress: pod.publicIp,
        internalAddress: getServiceInternalAddress(service.serviceName),
      };
    }
  }

  return null;
};
