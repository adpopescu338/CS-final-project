import { DBMS } from '@prisma/client';
import { coreApi } from './k8';
import { writeFileSync } from 'fs';

export const filterServicesByAvailableStorage = async (
  db: DBMS,
  minimumAvailableStorage: number
): Promise<
  {
    deploymentName: string;
    serviceName: string;
  }[]
> => {
  try {
    const {
      body: { items },
    } = await coreApi.listNamespacedPersistentVolumeClaim('default');

    writeFileSync('pvc.json', JSON.stringify(items, null, 2));

    return items
      .filter((pvc) => {
        if (!pvc.metadata?.name?.startsWith(db)) return false;
        if (!pvc.spec?.resources?.requests?.storage) return false;
        const storageAvailable = Number(pvc.spec.resources.requests.storage.replace('Gi', ''));
        console.log({
          storageAvailable,
          minimumAvailableStorage,
        });
        return storageAvailable >= minimumAvailableStorage;
      })
      .map((pvc) => ({
        deploymentName: pvc.metadata!.labels!.deploymentName,
        serviceName: pvc.metadata!.labels!.serviceName,
      }));
  } catch (error) {
    return [];
  }
};
