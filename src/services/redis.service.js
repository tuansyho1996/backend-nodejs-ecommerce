'use strict'
import { promisify } from "util"
import redis from 'redis'
import { reservationInventory } from "../models/repositories/inventory.repo.js"

const redisClient = redis.createClient()
const pExpire = promisify(redisClient.pexpire).bind(redisClient)
const setNxAsync = promisify(redisClient.setnx).bind(redisClient)

const acquireLock = async (productId, quantity, cartId) => {
  const pExpireTime = 3000
  const timeTry = 10
  const key = `${productId}#0011`
  for (let i = 0; i < timeTry.length; i++) {
    const result = setNxAsync(key, pExpireTime)
    if (result === 1) {
      const reservation = await reservationInventory(productId, quantity, cartId)
      if (!reservation.modifyCount) {
        return null
      }
      await pExpire(key, pExpireTime)
      return key
    }
    else {
      await new Promise((resolve) => setTimeout(resolve, pExpireTime))
    }
  }
}
const releaseLock = async (keyLock) => {
  const delLock = promisify(redisClient.del).bind(redisClient)
  return await delLock(keyLock)
}

export {
  acquireLock,
  releaseLock
}