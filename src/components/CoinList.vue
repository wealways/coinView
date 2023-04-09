<script setup>
import { ref } from 'vue'
import api from '@/api/api.js';

const coins = ref([])

const res = await api.getSymbols() 
coins.value = res


</script>

<template>
<table>
  <thead>
    <tr>
      <th>한글명</th>
      <th>현재가</th>
      <th>전일대비</th>
      <th>거래대금</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="coin in coins" :key="coin.symbol">
      <td>
        <div>{{coin.korean_name}}</div>
        <div>{{coin.symbol}}/KRW</div>
      </td>
      <td>
        {{coin.price}}
      </td>
      <td>
        <div>{{coin.change}}%</div>
        <div>{{coin.change_price}}</div>
      </td>
      <td>
        {{coin.volume}}백만
      </td>
    </tr>
  </tbody>
</table>
</template>

<style scoped>
</style>
