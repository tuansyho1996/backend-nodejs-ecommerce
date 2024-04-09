'use strict'

import Redis from 'redis'


class RedisPubsubService {
  constructor() {
    this.publisher = Redis.createClient()
    this.subscriber = Redis.createClient()
  }
  publish(channel, message) {
    return new Promise((resolve, reject) => {
      this.publisher.publish(channel, message, (err, reply) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(reply)
        }
      })
    })
  }
  subscribe(channel, callback) {
    this.subscriber.subscribe(channel)
    this.subscriber.on('message', (subscriberChannel, message) => {
      if (channel === subscriberChannel) {
        callback(channel, message)
      }
    })
  }
}

export default new RedisPubsubService()