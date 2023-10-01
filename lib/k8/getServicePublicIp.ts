import { coreApi } from './k8';

export const getServicePublicIp = async (serviceName: string) => {
  const service = await coreApi.readNamespacedService(serviceName, 'default');
  if (
    service.body.status &&
    service.body.status.loadBalancer &&
    service.body.status.loadBalancer.ingress &&
    service.body.status.loadBalancer.ingress.length
  ) {
    return service.body.status.loadBalancer.ingress[0].ip || null;
  }

  return null;
};
