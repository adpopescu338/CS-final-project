export const getServiceInternalAddress = (serviceName: string) => {
  // Check env to see if we're in a k8s cluster
  if (process.env.KUBERNETES_SERVICE_HOST) {
    return `${serviceName}.default.svc.cluster.local`;
  }

  return '127.0.0.1';
};
