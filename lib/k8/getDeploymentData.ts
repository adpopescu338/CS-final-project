import { MONGO_PORT, MYSQL_PORT, POSTGRES_PORT, POD_STORAGE_GIGA } from 'libs/constants';
import { DBMS } from 'libs/types';

const getPort = (db: DBMS) => {
  switch (db) {
    case DBMS.mongodb:
      return MONGO_PORT;
    case DBMS.postgresql:
      return POSTGRES_PORT;
    case DBMS.mysql:
      return MYSQL_PORT;
    default:
      throw new Error('Invalid DBMS');
  }
};

const getDbIdentifier = (db: DBMS, identifier?: string, subDomain = false) =>
  `${db}${subDomain ? '_' : '-'}${identifier}`;

const getDockerImageName = (db: DBMS) => {
  switch (db) {
    case DBMS.mongodb:
      return 'mongo';
    case DBMS.postgresql:
      return 'postgres';
    case DBMS.mysql:
      return 'mysql';
    default:
      throw new Error('Invalid DBMS');
  }
};

const getDeployment = (db: DBMS, identifier: string) => {
  let envs;
  switch (db) {
    case DBMS.mongodb:
      envs = [
        {
          name: 'MONGO_INITDB_ROOT_USERNAME',
          valueFrom: {
            secretKeyRef: {
              name: 'apps-secrets',
              key: 'MONGO_USERNAME',
            },
          },
        },
        {
          name: 'MONGO_INITDB_ROOT_PASSWORD',
          valueFrom: {
            secretKeyRef: {
              name: 'apps-secrets',
              key: 'MONGO_PASSWORD',
            },
          },
        },
      ];
      break;
    case DBMS.postgresql:
      envs = [
        {
          name: 'POSTGRES_PASSWORD',
          valueFrom: {
            secretKeyRef: {
              name: 'apps-secrets',
              key: 'POSTGRES_PASSWORD',
            },
          },
        },
      ];
      break;
    case DBMS.mysql:
      envs = [
        {
          name: 'MYSQL_ROOT_PASSWORD',
          valueFrom: {
            secretKeyRef: {
              name: 'apps-secrets',
              key: 'MYSQL_PASSWORD',
            },
          },
        },
      ];
      break;
    default:
      throw new Error('Invalid DBMS');
  }

  return {
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: {
      name: `${getDbIdentifier(db, identifier)}-deployment`,
      labels: {
        serviceName: `${getDbIdentifier(db, identifier)}-service`,
        pvcName: `${getDbIdentifier(db, identifier)}-pvc`,
        deploymentName: `${getDbIdentifier(db, identifier)}-deployment`,
      },
    },
    spec: {
      replicas: 1,
      selector: {
        matchLabels: {
          app: getDbIdentifier(db, identifier),
        },
      },
      template: {
        metadata: {
          labels: {
            app: getDbIdentifier(db, identifier),
          },
        },
        spec: {
          containers: [
            {
              name: getDbIdentifier(db, identifier),
              image: `${getDockerImageName(db)}:latest`,
              ports: [
                {
                  containerPort: getPort(db),
                },
              ],
              env: envs,
              volumeMounts: [
                {
                  name: `${getDbIdentifier(db, identifier)}-persistent-storage`,
                  mountPath: `/data/db/${getDbIdentifier(db, identifier)}`,
                },
              ],
            },
          ],
          volumes: [
            {
              name: `${getDbIdentifier(db, identifier)}-persistent-storage`,
              persistentVolumeClaim: {
                claimName: `${getDbIdentifier(db, identifier)}-pvc`,
              },
            },
          ],
        },
      },
    },
  };
};

const getService = (db: DBMS, identifier: string) => ({
  apiVersion: 'v1',
  kind: 'Service',
  metadata: {
    name: `${getDbIdentifier(db, identifier)}-service`,
    labels: {
      deploymentName: `${getDbIdentifier(db, identifier)}-deployment`,
      pvcName: `${getDbIdentifier(db, identifier)}-pvc`,
      serviceName: `${getDbIdentifier(db, identifier)}-service`,
    },
  },
  spec: {
    type: 'NodePort', //process.env.LOCAL ? 'LoadBalancer' : 'NodePort',
    ports: [
      {
        port: getPort(db),
        targetPort: getPort(db),
      },
    ],
    selector: {
      app: getDbIdentifier(db, identifier),
    },
  },
});

const getPvc = (db: DBMS, identifier: string, storage = `${POD_STORAGE_GIGA}Gi`) => ({
  apiVersion: 'v1',
  kind: 'PersistentVolumeClaim',
  metadata: {
    name: `${getDbIdentifier(db, identifier)}-pvc`,
    labels: {
      deploymentName: `${getDbIdentifier(db, identifier)}-deployment`,
      serviceName: `${getDbIdentifier(db, identifier)}-service`,
      pvcName: `${getDbIdentifier(db, identifier)}-pvc`,
    },
  },
  spec: {
    accessModes: ['ReadWriteOnce'],
    resources: {
      requests: {
        storage,
      },
    },
  },
});

/**
 * Returns the payload for the patch request to add a new ingress rule (subdomain for the new database)
 */
const getIngressControllerPatch = (db: DBMS, identifier: string, serviceName: string) => ({
  op: 'add',
  path: '/spec/rules/-',
  value: {
    host: `${getDbIdentifier(db, identifier)}.localhost`,
    http: {
      paths: [
        {
          path: '/',
          pathType: 'Prefix',
          backend: {
            service: {
              name: serviceName,
              port: {
                number: getPort(db),
              },
            },
          },
        },
      ],
    },
  },
});

/**
 * Get all the data needed to deploy a new database instance
 */
export const getDeploymentData = (db: DBMS, identifier: string) => {
  const service = getService(db, identifier);
  return {
    deployment: getDeployment(db, identifier),
    service,
    pvc: getPvc(db, identifier),
    ingressControllerRule: getIngressControllerPatch(db, identifier, service.metadata.name),
  };
};
