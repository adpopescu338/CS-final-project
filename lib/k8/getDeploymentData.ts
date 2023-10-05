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
              key: 'MONGO_INITDB_ROOT_USERNAME',
            },
          },
        },
        {
          name: 'MONGO_INITDB_ROOT_PASSWORD',
          valueFrom: {
            secretKeyRef: {
              name: 'apps-secrets',
              key: 'MONGO_INITDB_ROOT_PASSWORD',
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
      name: `${db}-deployment-${identifier}`,
      labels: {
        serviceName: `${db}-${identifier}-service`,
        pvcName: `${db}-${identifier}-pvc`,
        deploymentName: `${db}-deployment-${identifier}`,
      },
    },
    spec: {
      replicas: 1,
      selector: {
        matchLabels: {
          app: `${db}-${identifier}`,
        },
      },
      template: {
        metadata: {
          labels: {
            app: `${db}-${identifier}`,
          },
        },
        spec: {
          containers: [
            {
              name: `${db}-${identifier}`,
              image: `${getDockerImageName(db)}:latest`,
              ports: [
                {
                  containerPort: getPort(db),
                },
              ],
              env: envs,
              volumeMounts: [
                {
                  name: `${db}-${identifier}-persistent-storage`,
                  mountPath: `/data/db/${db}-${identifier}`,
                },
              ],
            },
          ],
          volumes: [
            {
              name: `${db}-${identifier}-persistent-storage`,
              persistentVolumeClaim: {
                claimName: `${db}-${identifier}-pvc`,
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
    name: `${db}-${identifier}-service`,
    labels: {
      deploymentName: `${db}-deployment-${identifier}`,
      pvcName: `${db}-${identifier}-pvc`,
      serviceName: `${db}-${identifier}-service`,
    },
  },
  spec: {
    type: 'LoadBalancer',
    ports: [
      {
        port: getPort(db),
        targetPort: getPort(db),
      },
    ],
    selector: {
      app: `${db}-${identifier}`,
    },
  },
});

const getPvc = (db: DBMS, identifier: string, storage = `${POD_STORAGE_GIGA}Gi`) => ({
  apiVersion: 'v1',
  kind: 'PersistentVolumeClaim',
  metadata: {
    name: `${db}-${identifier}-pvc`,
    labels: {
      deploymentName: `${db}-deployment-${identifier}`,
      serviceName: `${db}-${identifier}-service`,
      pvcName: `${db}-${identifier}-pvc`,
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
 * Get all the data needed to deploy a new database instance
 */
export const getDeploymentData = (db: DBMS, identifier: string) => {
  return {
    deployment: getDeployment(db, identifier),
    service: getService(db, identifier),
    pvc: getPvc(db, identifier),
  };
};
