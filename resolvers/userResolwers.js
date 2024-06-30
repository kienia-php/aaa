import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Channel from '../models/Channel/Channel.js';


import { sendVerificationEmail } from '../utils/email.js'
import { redis, pubsub } from '../utils/redis.js'
import { generateVerificationCode } from '../utils/helpers.js'

import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";

import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import {where} from "sequelize";



const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


const USER_STATUS_CHANGED = 'USER_STATUS_CHANGED';



const storeUpload = async ({ stream, filename }) => {
    const uploadDir = './public/uploads';
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);

    return new Promise((resolve, reject) =>
        stream
            .pipe(fs.createWriteStream(filePath))
            .on('finish', () => resolve({ path: filePath }))
            .on('error', reject)
    );
};

const processImage = async (filePath, sizes, userDir) => {
    const avatarPaths = {};

    for (const [size, { width, height }] of Object.entries(sizes)) {
        const outputPath = path.join(userDir, `${size}.webp`);
        await sharp(filePath)
            .resize(width, height)
            .toFormat('webp')
            .toFile(outputPath);
        avatarPaths[size] = `/avatars/${userDir}/${size}.webp`;
    }

    return avatarPaths;
};





const userResolvers = {
    Upload: GraphQLUpload,

    Query: {
        user: async (_, { id }) => {
            if (!id) throw new Error('No user found.');
            const user = await User.findByPk(id);
            return { id:user.id, firstName:user.firstName, lastName:user.lastName}
        },

        me: async (_, __, { user }) => {
             if (!user) throw new Error('Not authenticated');
            return await  User.findByPk(user.user.id);
        },
    },
    Mutation: {
        register: async (_, { firstName, lastName, gender, phone, password }) => {
            // Check if the user already exists
            const existingUser = await User.findOne({ where: { phone } });

            if (existingUser) {
                throw new Error('Phone is already registered');
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const verificationCode = generateVerificationCode();
            const verificationCodeExpires = new Date(Date.now() + 3600000); // 1 hour from now

            const userData = {
                firstName,
                lastName,
                gender,
                phone,
                password,
                hashedPassword,
                verificationCode,
                verificationCodeExpires,
            };

            await redis.set(`user:${phone}`, JSON.stringify(userData), 'EX', 3600);

            await sendVerificationEmail(phone, verificationCode);
            return true;
        },
        verifyPhone: async (_, { phone, code }) => {
            const userDataString = await redis.get(`user:${phone}`);
            if (!userDataString) throw new Error('User not found or verification code expired');

            const userData = JSON.parse(userDataString);
            if (userData.verificationCode !== code || new Date() > new Date(userData.verificationCodeExpires)) {
                throw new Error('Invalid or expired verification code');
            }

            const user = await User.create({
                id: userData.id,
                firstName: userData.firstName,
                lastName: userData.lastName,
                gender: userData.gender,
                phone: userData.phone,
                password: userData.hashedPassword,
                phoneVerified: true,
            });

            await redis.del(`user:${phone}`);


            // Логиним пользователя после верификации телефона
            const { accessToken, refreshToken } = await userResolvers.Mutation.login(_, { phone: userData.phone, password: userData.password });

            console.log(user.id)

            return {
                accessToken,
                refreshToken,
                user,
            };

        },
        login: async (_, { phone, password }) => {
            const user = await User.findOne({ where: { phone } });



            if (!user) throw new Error('User not found');

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) throw new Error('Invalid password');

            if (!user.phoneVerified) throw new Error('Email not verified');

            const accessToken = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30d' });
            const refreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

            user.refreshToken = refreshToken;
            user.isOnline = true;
            user.lastOnline = new Date();
            await user.save();

            pubsub.publish(USER_STATUS_CHANGED, { userStatusChanged: { id: user.id, isOnline: true, lastOnline: new Date() } });

            return {
                accessToken,
                refreshToken,
                user,
            };
        },
        logout: async (_, __, { user }) => {
            console.log(user)

            // if (!user) throw new Error('Not authenticated');

            const currentUser = await User.findById('666b45365f1df49f235b257b');
            currentUser.refreshToken = null;
            currentUser.isOnline = false;
            currentUser.lastOnline = new Date();
            await currentUser.save();

            pubsub.publish(USER_STATUS_CHANGED, { userStatusChanged: { id: currentUser.id, isOnline: false, lastOnline: currentUser.lastOnline } });

            return true;
        },
        refreshToken: async (_, { token }) => {
            try {
                const { userId } = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
                const user = await User.findById(userId);
                if (!user || user.refreshToken !== token) throw new Error('Invalid refresh token');

                const accessToken = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30d' });
                const newRefreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

                user.refreshToken = newRefreshToken;
                await user.save();

                return {
                    accessToken,
                    refreshToken: newRefreshToken,
                    user,
                };
            } catch (e) {
                throw new Error('Invalid or expired refresh token');
            }
        },
        updateUser: async (_, { name, email }, { user }) => {
            if (!user) throw new Error('Not authenticated');

            const currentUser = await User.findById(user.id);
            if (name) currentUser.name = name;
            if (email) currentUser.email = email;

            await currentUser.save();

            return currentUser;
        },

        uploadAvatar: async (_, { file }, { user2 }) => {
            const user = await User.findOne({ email: 'fgfdg@tut.by' });

            if (!user) throw new Error('Not authenticated');

            const { createReadStream, filename } = await file;
            const stream = createReadStream();
            const userDir = path.join(__dirname, `../public/avatars/${user.id}`);

            if (!fs.existsSync(userDir)) {
                fs.mkdirSync(userDir, { recursive: true });
            }

            const { path: filePath } = await storeUpload({ stream, filename });

            const sizes = {
                tiny: { width: 50, height: 50 },
                small: { width: 100, height: 100 },
                medium: { width: 250, height: 250 },
                large: { width: 500, height: 500 },
                huge: { width: 1000, height: 1000 },
            };

            const avatarPaths = await processImage(filePath, sizes, userDir);

            user.avatar = avatarPaths;
            await user.save();

            return user;
        },

    },

    User: {
        channelsOwner: async (parent) => {
            try {
                return await Channel.findAll({
                    where: { type: parent.id }
                });
            } catch (error) {
                console.error(error);
                throw new Error('Error fetching channels for category');
            }
        }
    },

    Subscription: {
        userStatusChanged: {
            subscribe: () => pubsub.asyncIterator(USER_STATUS_CHANGED),
        },
    },
};

export default userResolvers