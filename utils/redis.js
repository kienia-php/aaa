import  Redis from 'ioredis'
import {RedisPubSub} from "graphql-redis-subscriptions";

const options = {
    host: '127.0.0.1',
    port: 6379,
    retryStrategy: times => Math.min(times * 50, 2000),
};

export const redis = new Redis(options);
export const pubsub = new RedisPubSub({
    publisher: new Redis(options),
    subscriber: new Redis(options),
});

