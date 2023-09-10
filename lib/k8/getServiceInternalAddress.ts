export const getServiceInternalAddress = (serviceName: string) => {
  return `${serviceName}.default.svc.cluster.local`;
};
