import * as k8s from '@kubernetes/client-node';
const kc = new k8s.KubeConfig();
kc.loadFromFile(`${process.env.HOME}/.kube/config`);

export const appsV1Api = kc.makeApiClient(k8s.AppsV1Api);
export const coreApi = kc.makeApiClient(k8s.CoreV1Api);
