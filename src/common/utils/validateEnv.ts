import { cleanEnv, port, str } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    DATABASE_URL: str(),
    DATABASE_URL_DEV: str(),
    FACEBOOK_APP_ID: str(),
    FACEBOOK_APP_SECRET: str(),
    GOOGLE_CLIENT_ID: str(),
    GOOGLE_CLIENT_SECRET: str(),
    GITHUB_CLIENT_ID: str(),
    GITHUB_CLIENT_SECRET: str(),
    JWT_SECRET: str(),
    JWT_RESET_SECRET: str(),
    GCS_TYPE: str(),
    GCS_PROJECT_ID: str(),
    GCS_PRIVATE_KEY: str(),
    GCS_CLIENT_EMAIL: str(),
    MAILGUN_KEY: str(),
  });
};

export default validateEnv;
