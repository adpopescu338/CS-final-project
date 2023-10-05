const MANDATORY_ENV_VARIABLES = [
  'MONGO_PASSWORD',
  'MONGO_USERNAME',
  'MONGO_HOST',
  'MONGO_PUBLIC_HOST',
  //
  'MYSQL_PASSWORD',
  'MYSQL_HOST',
  'MYSQL_PUBLIC_HOST',
  //
  'POSTGRES_PASSWORD',
  'POSTGRES_HOST',
  'POSTGRES_PUBLIC_HOST',
  //
  'SENDGRID_API_KEY',
  'SENDGRID_FROM_EMAIL',
  //
  'JWT_SECRET',
  'ENCRYPTION_KEY',
  //
  'NODE_ENV',
];

export const checkMandatoryEnvVariables = () => {
  const missingEnvVariables = MANDATORY_ENV_VARIABLES.filter(
    (envVariable) => !process.env[envVariable]
  );
  if (missingEnvVariables.length > 0) {
    throw new Error(`Missing mandatory env variables: ${missingEnvVariables.join(', ')}`);
  }
};
