import { DBMS } from 'libs/types';
import { getDeploymentData } from './getDeploymentData';
import { appsV1Api, coreApi } from './k8';
import { client } from 'prisma/client';
import { waitFor } from 'libs/utils';
import { getServiceInternalAddress } from './getServiceInternalAddress';

const isPodReady = async (podName: string, retries = 0) => {
  const pod = await coreApi.readNamespacedPod(podName, 'default');
  if (pod.body.status?.phase === 'Running') {
    return true;
  }

  if (retries > 30) {
    return false;
  }

  await waitFor(4000);

  return isPodReady(podName);
};

const revertDeployment = async (deploymentName: string, serviceName: string, pvcName: string) => {
  await appsV1Api.deleteNamespacedDeployment(deploymentName, 'default');
  await coreApi.deleteNamespacedService(serviceName, 'default');
  await coreApi.deleteNamespacedPersistentVolumeClaim(pvcName, 'default');
};

/**
 * Deploy a new database instance to the cluster
 * @returns The ID of the newly created pod entry in the database
 */
export const deploy = async (db: DBMS) => {
  const identifier = Date.now().toString();
  const { deployment, service, pvc } = getDeploymentData(db, identifier);

  const name = `${db}-${identifier}`;
  try {
    // Deploy PVC
    await coreApi.createNamespacedPersistentVolumeClaim('default', pvc);
    console.log(`PVC for ${name} created`);

    // Deploy Deployment
    await appsV1Api.createNamespacedDeployment('default', deployment);
    console.log(`Deployment for ${name} created`);

    // Deploy Service
    await coreApi.createNamespacedService('default', service);
    console.log(`Service for ${name} created`);

    await waitFor(10000);

    const podIsReady = await isPodReady(deployment.metadata.name);

    if (!podIsReady) {
      await revertDeployment(deployment.metadata.name, service.metadata.name, pvc.metadata.name);
    }

    const deplymentDetails = await client.pod.create({
      data: {
        deploymentName: deployment.metadata.name,
        serviceName: service.metadata.name,
        pvcName: pvc.metadata.name,
        internalAddress: getServiceInternalAddress(service.metadata.name),
      },
    });

    console.log(`Pod for ${name} created`);

    return deplymentDetails;
  } catch (error) {
    console.error('Error deploying resources:', error);
    throw error;
  }
};
