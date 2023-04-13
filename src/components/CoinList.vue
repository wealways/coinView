<script setup>
import { ref,onMounted } from 'vue'
import api from '@/api/api.js';

const coins = ref({})

onMounted(async() => {
  const markets = []
  
  const {data:symbols} = await api.getSymbols()
  
  symbols.forEach((symbol) => {
      /** `KRW-` 으로 시작하는 마켓만 핕터링 */
      if (symbol.market.indexOf('KRW-') === -1) {
        return
      }

      markets.push(symbol.market)
      coins.value[symbol.market] = symbol
    })

  const { data:tickers} = await api.getTickers(markets)
  tickers.forEach((ticker) => {
      coins.value[ticker.market] = Object.assign(
        coins.value[ticker.market],
        ticker
      )
    })

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
            <div class="text-sm text-gray-500">{{ coin.market }}/KRW</div>
          </td>
          <td class="py-1 px-4 text-right align-top font-semibold">
            {{ coin.trade_price }}
          </td>
          <td class="py-1 px-4 text-right">
            <div class="font-semibold">{{ coin.change_rate * 100 }}%</div>
            <div class="text-sm text-gray-500">{{ coin.change_price }}</div>
          </td>
          <td class="py-1 px-4 text-right">
            {{ coin.acc_trade_price_24h }}백만
          </td>
        </tr>
      </tbody>
  </table>
</template>

<style scoped>
</style>
