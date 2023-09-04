import k8s from '@kubernetes/client-node';

const getPublicIpAddress = async (dbService: 'mongo-service') => {
  // first let's check if we are running in a k8s cluster
  if (!process.env.KUBERNETES_SERVICE_HOST) {
    switch (dbService) {
      case 'mongo-service':
        return process.env.MONGO_HOST;
      default:
        throw new Error(`Invalid dbService: ${dbService}`);
    }
  }
  const kc = new k8s.KubeConfig();
  kc.loadFromDefault();
  const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

  const serviceRes = await k8sApi.readNamespacedService(dbService, 'default');
  const service = serviceRes.body;

  // Check if the service has a LoadBalancer type and an IP assigned
  if (
    service.spec?.type === 'LoadBalancer' &&
    service.status?.loadBalancer &&
    service.status.loadBalancer.ingress &&
    service.status.loadBalancer.ingress.length > 0
  ) {
    const publicIP =
      service.status.loadBalancer.ingress[0].ip || service.status.loadBalancer.ingress[0].hostname;

    return publicIP;
  } else {
    throw new Error('No public IP found');
  }
};

export const setDbPublicIpAddress = async () => {
  // TODO: add more services here
  const [mongoServiceIp] = await Promise.all([getPublicIpAddress('mongo-service')]);

  process.env.MONGO_PUBLIC_HOST = mongoServiceIp;
};
