import {
  createClient,
  RedisClientType,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from 'redis';

const createRedisClient = (): Promise<
  RedisClientType<RedisModules, RedisFunctions, RedisScripts>
> => {
  const client = createClient({ url: process.env.REDIS_URI });

  client.on('error', (error) => {
    console.error('Error en el cliente Redis:', error);
  });

  client.on('reconnecting', () => {
    console.log('Reconectando al servidor Redis...');
  });

  return client.connect();
};

export default createRedisClient;
