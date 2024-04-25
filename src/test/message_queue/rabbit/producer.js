'use strict'

import amqplib from 'amqplib'

const messages = 'Release a new product title:hoodie'

const runProducer = async () => {
  try {
    const connection = await amqplib.connect('amqp://guest:123456@localhost')
    const channel = await connection.createChannel()
    const queueName = 'test-topic'
    await channel.assertQueue(queueName, {
      durable: true
    })
    //send message to consumer channel
    channel.sendToQueue(queueName, Buffer.from(messages))
    console.log('message send', messages)

  } catch (error) {
    console.error(error)
  }
}

runProducer().catch(console.error)
