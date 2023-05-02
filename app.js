// app.js
const express = require('express');
const expressWs = require('express-ws');
const kafka = require('./kafka');

const app = express();
expressWs(app);

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'websocket-group' });

app.ws('/socket/:topic', async (ws, req) => {
    const topic = req.params.topic;

    // Subscribe to the topic
    await consumer.subscribe({ topic });

    // Consume messages and send them to the WebSocket clients
    consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log(message.value.toString())
            ws.send(message.value.toString());
        },
    });

    ws.on('message', async (msg) => {
        console.log(msg)
        // Produce messages received from WebSocket clients
        await producer.send({
            topic,
            messages: [{ value: msg }],
        });
    });
});

app.listen(4000, async () => {
    console.log('Server listening on port 4000');
    await producer.connect();
    await consumer.connect();
});
