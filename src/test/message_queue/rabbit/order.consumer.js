'use strict'

import amqplib from 'amqplib'

const orderConsumer = async () => {
  const connection = await amqplib.connect('amqp://guest:123456@localhost')
  const channel = await connection.createChannel()

  const queueName = 'order-queue'
  await channel.assertQueue(queueName, {
    durable: true
  })
  channel.prefetch(1)
  channel.consume(queueName, msg => {
    const message = msg.content.toString()
    setTimeout(() => {
      console.log(`consumer ${message}`)
      channel.ack(msg)
    }, Math.random() * 1000);
  })
}

orderConsumer().catch(err => console.log(err))

