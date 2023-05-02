// kafka.js
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'nodejs-express-server',
    brokers: ['localhost:9092'],
});

module.exports = kafka;
