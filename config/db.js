import {Sequelize} from 'sequelize'

const sequelize = new Sequelize('malacandra_network', 'postgres', '1989', {
    host: 'localhost',
    dialect: 'postgres',
    freezeTableName: false, // Отключение использования имени модели как имени таблицы
    logging: false,
    define: {
        aliases: true, // Включение использования алиасов для моделей
    },
});

sequelize.authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch(err => console.error('Unable to connect to the database:', err));

export default  sequelize;