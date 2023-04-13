import { numToKorean } from 'num-to-korean'

export function getCurrency(value) {
  return Number(value).toLocaleString()
}

export function getChangeRate(value) {
  return Number(value).toFixed(3)
}

export function getRatePrefix(coin) {
  switch (coin.change) {
    case 'RISE':
      return '+'
    default:
      return ''
  }
}

export function getVolume(volume) {
  return numToKorean(Math.floor(volume / 100000000) * 100000000, 'mixed')
}
