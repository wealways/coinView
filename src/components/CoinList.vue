<script setup>
import { ref,onMounted } from 'vue'
import api from '@/api/api.js';
import { v4 as uuidv4 } from 'uuid'
import {getCurrency,getChangeRate,getRatePrefix,getVolume,getColor} from '@/common/util.js'

const coins = ref({})
const markets = ref([])

onMounted(async() => {
  
  const {data:symbols} = await api.getSymbols()
  
  symbols.forEach((symbol) => {
      /** `KRW-` 으로 시작하는 마켓만 핕터링 */
      if (symbol.market.indexOf('KRW-') === -1) {
        return
      }

      markets.value.push(symbol.market)
      coins.value[symbol.market] = symbol
    })

  const { data:tickers} = await api.getTickers(markets.value)
  tickers.forEach((ticker) => {
      coins.value[ticker.market] = Object.assign(
        coins.value[ticker.market],
        ticker
      )
    })

  // Websocket
  try{
    const ws = new WebSocket('wss://api.upbit.com/websocket/v1')
    ws.onopen = (e) => {
      ws.send(
        `${JSON.stringify([
          { ticket: uuidv4() },
          { type: 'ticker', codes: markets.value },
        ])}`
      )
    }
    ws.onmessage = async (payload) => {
      const ticker = await new Response(payload.data).json()

      if (!coins.value[ticker.code]) {
        return
      }

      if (ticker.change === 'FALL') {
        coins.value[ticker.code].trade_price = -ticker.trade_price
        coins.value[ticker.code].change_rate = -ticker.change_rate
        coins.value[ticker.code].change_price = -ticker.change_price
      } else {
        coins.value[ticker.code].trade_price = ticker.trade_price
        coins.value[ticker.code].change_rate = ticker.change_rate
        coins.value[ticker.code].change_price = ticker.change_price
      }
    }
  console.log(coins)
  }catch(err){
    // todo
    // 웹소켓 에러나면 어떻게 처리해야 할까?
  }

})


</script>

<template>
<table class="table w-full">
    <thead>
        <tr class="border-b border-gray-100 text-sm text-gray-500">
          <th class="py-2 px-4 text-left">한글명</th>
          <th class="py-2 px-4 text-right">현재가(원)</th>
          <th class="py-2 px-4 text-right">전일대비</th>
          <th class="py-2 px-4 text-right">거래대금</th>
        </tr>
      </thead>
    <tbody class="text-gray-900">
      <tr v-for="(coin, key) in coins" :key="key">
        <td class="py-1 px-4 text-left">
          <div class="font-semibold text-gray-700">
            {{ coin.korean_name }}
          </div>
          <div class="text-sm text-gray-500">{{ coin.market }}</div>
        </td>
        <td :class="[getColor(coin.change), 'py-1 px-4 text-right font-semibold align-top']">
          {{ getRatePrefix(coin) }}{{ getCurrency(coin.trade_price) }}
        </td>
        <td :class="[getColor(coin.change), 'py-1 px-4 text-right']">
          <div class="font-semibold">
            {{ getRatePrefix(coin) }}{{ getChangeRate(coin.change_rate) }}%
          </div>
          <div class="text-sm text-gray-500">
            {{ getRatePrefix(coin) }}{{ getCurrency(coin.change_price) }}
          </div>
        </td>
        <td class="py-1 px-4 text-right font-semibold text-gray-500">
          {{ getVolume(coin.acc_trade_price_24h) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
</style>
