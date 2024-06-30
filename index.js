import dotenv from 'dotenv';
dotenv.config();

import express from 'express'
import cors from 'cors'
import { ApolloServer,AuthenticationError  } from 'apollo-server-express'
import jwt from 'jsonwebtoken'
import { createServer } from 'http'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { execute, subscribe } from 'graphql'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs";

import sequelize from './config/db.js'; // Путь к db.js
import models from './models/index.js'; // Путь к index.js в models
import typeDefs from './schemas/index.js'; // Путь к index.js в schemas
import resolvers from './resolvers/index.js'; // Путь к index.js в resolvers
import defineAssociations from './models/associations.js';
import { redis, pubsub } from './utils/redis.js'

// Инициализация связей
defineAssociations(models.User, models.Channel, models.ChannelType,  models.ChannelCategory, models.Group, models.GroupCategory);
// Инициализация приложения Express
const app = express();

// Разрешаем запросы с клиента
app.use(cors({
    // origin: ['http://localhost:5173'],  // Ваш клиентский URL
    // credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']  // Разрешаем заголовок Authorization
}));




// Функция для получения пользователя по JWT токену
const getUser = async (token) => {
    if (token) {
        try {
            if (token.startsWith("Bearer ")) {
                token = token.slice(7, token.length).trim();
            }
            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            const user = await models.User.findByPk(decodedToken.userId)
            return { user }
        } catch (e) {
            throw new AuthenticationError('Не удалось декадировать токен')
        }
    }
    return null
};

// Функция для синхронизации базы данных
const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: true  }); // { alter: true }, { force: true  } только для разработки, чтобы пересоздавать таблицы каждый раз
        console.log('База данных синхронизирована');
    } catch (error) {
        console.error('Ошибка синхронизации базы данных:', error);
    }
};

// Функция для запуска сервера
const startServer = async () => {
    // Синхронизация базы данных
    await syncDatabase();

    // Создание GraphQL схемы
    const schema = makeExecutableSchema({ typeDefs, resolvers });

    // Создание Apollo сервера
    const server = new ApolloServer({
        schema,
        context: async ({ req, connection }) => {
            if (connection) {
                // Контекст для подключений WebSocket
                return connection.context;
            } else {
                // Контекст для HTTP запросов
                const token = req.headers.authorization || '';
                const user = await getUser(token);
                return { user, redis, pubsub };
            }
        },
    });

    await server.start();

    // Применение middleware для обработки файлов GraphQL Upload
    app.use(graphqlUploadExpress());

    // Привязка Apollo сервера к Express приложению
    server.applyMiddleware({ app });

    // Создание HTTP сервера для поддержки подписок по WebSocket
    const httpServer = createServer(app);
    SubscriptionServer.create(
        {
            schema,
            execute,
            subscribe,
            onConnect: async (connectionParams, webSocket, context) => {
                if (connectionParams.authToken) {
                    const user = await getUser(connectionParams.authToken);
                    if (!user) {
                        throw new Error('Not authenticated');
                    }
                    return { user, redis ,pubsub };
                }
                throw new Error('Missing auth token!');
            },
        },
        { server: httpServer, path: server.graphqlPath }
    );

    // Запуск сервера на указанном порту
    const PORT = process.env.PORT || 4000;
    httpServer.listen(PORT, () => {
        console.log(`Сервер запущен на http://localhost:${PORT}${server.graphqlPath}`);
    });
};

// Запуск сервера
startServer();