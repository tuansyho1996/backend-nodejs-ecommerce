'use strict'

import { Kafka, logLevel } from "kafkajs"

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
},
)

const producer = kafka.producer()

async function runProducer() {

  await producer.connect()
  await producer.send({
    topic: 'topic-name',
    messages: [
      { key: 'key1', value: 'hello world' },
      { key: 'key2', value: 'hey hey!' }
    ],
  })

  // before you exit your app
  await producer.disconnect()
}

runProducer().catch(console.error)