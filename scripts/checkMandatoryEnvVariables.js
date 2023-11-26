const MANDATORY_ENV_VARIABLES = [
  'MONGO_PASSWORD',
  'MONGO_USERNAME',
  //
  'MYSQL_PASSWORD',
  //
  'POSTGRES_PASSWORD',
  //
  'DATABASE_URL',
  //
  'PUBLIC_URL',
  //
  'SENDGRID_API_KEY',
  'SENDGRID_FROM_EMAIL',
  //
  'ENCRYPTION_KEY',
  'NEXTAUTH_TERCES',
];

const OPTIONAL_ENV_VARIABLES = ['DISABLE_EMAILS', 'LOG_LEVEL'];

const checkMandatoryEnvVariables = () => {
  const missingEnvVariables = MANDATORY_ENV_VARIABLES.filter(
    (envVariable) => !process.env[envVariable]
  );
  if (missingEnvVariables.length > 0) {
    throw new Error(`Missing mandatory env variables: ${missingEnvVariables.join(', ')}`);
  }

  const missingOptionalVariables = OPTIONAL_ENV_VARIABLES.filter(
    (envVariable) => !process.env[envVariable]
  );

  if (missingOptionalVariables.length) {
    console.warn('Missing optional env variables', missingOptionalVariables);
  }
};

module.exports = { checkMandatoryEnvVariables };
