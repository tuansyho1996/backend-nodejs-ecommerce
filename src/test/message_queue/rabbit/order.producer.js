'use strict'

import amqplib from 'amqplib'

async function orderProducer() {

  const connection = await amqplib.connect('amqp://guest:123456@localhost')
  const channel = await connection.createChannel()
  const queueName = 'order-queue'
  await channel.assertQueue(queueName, {
    durable: true
  })
  for (let i = 0; i < 10; i++) {
    const message = `buy product ${i}`
    channel.sendToQueue(queueName, Buffer.from(message), {
      persistent: true
    })
    console.log(message)
  }
  setTimeout(() => {
    connection.close()
  }, 1000);
}
orderProducer().catch(err => console.log(err))