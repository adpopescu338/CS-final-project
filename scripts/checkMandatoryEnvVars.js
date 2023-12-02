const mandatoryEnvVars = [
  'MONGO_USERNAME',
  'MONGO_PASSWORD',
  'MYSQL_PASSWORD',
  'POSTGRES_PASSWORD',
  'PUBLIC_URL',
  'DATABASE_URL',
  'SENDGRID_API_KEY',
  'SENDGRID_FROM_EMAIL',
  'ENCRYPTION_KEY',
  'NEXTAUTH_TERCES',
];

module.exports = () => {
  const missingEnvVars = mandatoryEnvVars.filter((envVar) => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    throw new Error(`Missing environment variables: ${missingEnvVars.join()}`);
  }
};
