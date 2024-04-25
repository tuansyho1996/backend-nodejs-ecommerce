'use strict'

import amqplib from 'amqplib'


const runConsumer = async () => {
  try {
    const connection = await amqplib.connect('amqp://guest:123456@localhost')
    const channel = await connection.createChannel()
    const queueName = 'test-topic'
    await channel.assertQueue(queueName, {
      durable: true
    })
    //send message to consumer channel
    channel.consume(queueName, (messages) => {
      console.log(`Received${messages.content.toString()}`)
    }, {
      noAck: true
    })

  } catch (error) {
    console.error(error)
  }
}

runConsumer().catch(console.error)
