import { DBMS } from '@prisma/client';
import { coreApi } from './k8';

export const filterServicesByAvailableStorage = async (
  db: DBMS,
  minimumAvailableStorage: number
): Promise<
  {
    deploymentName: string;
    serviceName: string;
  }[]
> => {
  const pvcs = await coreApi.listNamespacedPersistentVolumeClaim('default');

  return pvcs.body.items
    .filter(
      (pvc) =>
        pvc.metadata &&
        pvc.metadata?.name?.startsWith(db) &&
        pvc.metadata.labels &&
        pvc.spec?.resources?.requests?.storage &&
        parseInt(pvc.spec.resources.requests.storage.replace('Gi', ''), 10) >=
          minimumAvailableStorage
    )
    .map((pvc) => ({
      deploymentName: pvc.metadata!.labels!.deploymentName,
      serviceName: pvc.metadata!.labels!.serviceName,
    }));
};
