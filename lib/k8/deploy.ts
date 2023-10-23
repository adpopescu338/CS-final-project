import { DBMS } from 'libs/types';
import { getDeploymentData } from './getDeploymentData';
import { appsV1Api, coreApi, customObjectsApi } from './k8';
import { client } from 'prisma/client';
import { waitFor } from 'libs/utils';
import { getServiceInternalAddress } from './getServiceInternalAddress';

const MAX_RETRIES = 200;
const isPodReady = async (deploymentName: string, retries = 0) => {
  try {
    const {
      body: { items },
    } = await coreApi.listNamespacedPod(
      'default',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    );

    // https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase
    const itemsForDeployment = items?.filter((i) => {
      return i?.metadata?.generateName?.startsWith(deploymentName);
    });
    const itemRunning = itemsForDeployment?.some((i) => i?.status?.phase === 'Running');
    if (itemRunning) {
      console.log(`pod for ${deploymentName} is ready`);
      return true;
    }

    if (retries > MAX_RETRIES) {
      return false;
    }
  } catch (error) {
    console.log(`pod for ${deploymentName} not found`, error.message);
  }
  console.log(`waiting for pod for ${deploymentName} to be ready`);
  await waitFor(5000);

  return isPodReady(deploymentName, retries + 1);
};

const revertDeployment = async (deploymentName: string, serviceName: string, pvcName: string) => {
  try {
    console.log('reverting deployment...');
    await appsV1Api.deleteNamespacedDeployment(deploymentName, 'default');
    await coreApi.deleteNamespacedService(serviceName, 'default');
    await coreApi.deleteNamespacedPersistentVolumeClaim(pvcName, 'default');
  } catch (error) {
    console.error('Error reverting deployment', error);
  }
};

/**
 * Deploy a new database instance to the cluster
 * @returns The ID of the newly created pod entry in the database
 */
export const deploy = async (db: DBMS, identifier?: string) => {
  console.log('deploying new pod for ', db);
  identifier ??= Date.now().toString();
  const { deployment, service, pvc, transportServer } = getDeploymentData(db, identifier);

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
    console.log('waiting for pod to be ready');
    await waitFor(5000);

    const podIsReady = await isPodReady(deployment.metadata.name);
    if (!podIsReady) {
      await revertDeployment(deployment.metadata.name, service.metadata.name, pvc.metadata.name);
      throw new Error('Pod is not ready');
    }

    console.log('ingressControllerRule  ===== ', JSON.stringify(transportServer, null, 2));
    // Patch Ingress Controller
    await customObjectsApi.createNamespacedCustomObject(
      'networking.k8s.io',
      'v1',
      'default',
      'ingresses',
      transportServer
    );

    if (process.env.LOCAL === 'true') {
      console.log(`Deployed`);
      return;
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
