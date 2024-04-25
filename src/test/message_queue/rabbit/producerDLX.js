'use strict'

import amqplib from 'amqplib'

const messages = 'Release a new product title:hoodie'

const runProducer = async () => {
  try {
    const connection = await amqplib.connect('amqp://guest:123456@localhost')
    const channel = await connection.createChannel()

    const notificationExchange = 'notificationEx' // notification direct
    const notiQueue = 'notificationQueueProcess' // assertQueue
    const notificationExchangeDLX = 'notificationExDLX'// notification direct
    const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX' //assert

    //1. create Exchange
    await channel.assertExchange(notificationExchange, 'direct', {
      durable: true
    })
    // 2.create queue
    const resultQueue = await channel.assertQueue(notiQueue, {
      exclusive: false, //cho phep ket noi truy cap vao cung mot luc hang doi
      deadLetterExchange: notificationExchangeDLX,
      deadLetterRoutingKey: notificationRoutingKeyDLX
    })

    //3. bind queue
    await channel.bindQueue(resultQueue.queue, notificationExchange)

    //4. Send message

    const msg = 'a new product'
    console.log('producer smg', msg)
    channel.sendToQueue(resultQueue.queue, Buffer.from(msg), {
      expiration: '10000'
    })

    setTimeout(() => {
      connection.close()
      process.exit(0)
    }, 500);
  } catch (error) {
    console.error(error)
  }
}

runProducer().catch(console.error)
