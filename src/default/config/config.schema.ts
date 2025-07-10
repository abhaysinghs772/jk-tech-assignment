import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // General Config
  PORT: Joi.number().default(4002),

  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'uat')
    .required(),

  API_VERSION: Joi.number().required(),
  API_KEY: Joi.string().required(),
  API_SECRET: Joi.string().required(),

  // MySQL Config
  MYSQL_HOST: Joi.string().required(),
  MYSQL_PORT: Joi.number().default(3306),
  MYSQL_USERNAME: Joi.string().required(),
  MYSQL_PASSWORD: Joi.string().required(),
  MYSQL_DATABASE: Joi.string().required(),

  // MongoDB Config
  // MONGO_HOST: Joi.string().required(),
  // MONGO_PORT: Joi.number().default(27017),
  // MONGO_USERNAME: Joi.string().required(),
  // MONGO_PASSWORD: Joi.string().required(),
  // MONGO_DATABASE: Joi.string().required(),

  // Redis Config
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().optional().allow(''),

  // AWS Config (Required only in production)
  AWS_REGION: Joi.when('NODE_ENV', {
    is: 'production',
    then: Joi.string().required(),
    otherwise: Joi.string().optional().allow(''),
  }),
  AWS_ACCESS_KEY_ID: Joi.when('NODE_ENV', {
    is: 'production',
    then: Joi.string().required(),
    otherwise: Joi.string().optional().allow(''),
  }),
  AWS_SECRET_ACCESS_KEY: Joi.when('NODE_ENV', {
    is: 'production',
    then: Joi.string().required(),
    otherwise: Joi.string().optional().allow(''),
  }),
  APP_NAME: Joi.when('NODE_ENV', {
    is: 'production',
    then: Joi.string().required(),
    otherwise: Joi.string().optional().allow(''),
  }),
});
