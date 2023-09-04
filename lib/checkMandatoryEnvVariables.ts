const MANDATORY_ENV_VARIABLES = [
  'MONGO_PASSWORD',
  'MONGO_USERNAME',
  'MONGO_HOST',
  'MONGO_PUBLIC_HOST',
  // TODO: add more mandatory env variables here
];

export const checkMandatoryEnvVariables = () => {
  const missingEnvVariables = MANDATORY_ENV_VARIABLES.filter(
    (envVariable) => !process.env[envVariable]
  );
  if (missingEnvVariables.length > 0) {
    throw new Error(`Missing mandatory env variables: ${missingEnvVariables.join(', ')}`);
  }
};
