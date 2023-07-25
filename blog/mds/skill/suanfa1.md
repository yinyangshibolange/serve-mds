---
title: 算法题一
author: hy
desp: 如何在一个数组找出随即个数的数字之和大于某个数，但是最接近这个数，例如在数组[308,311,350,200,400,315,288,375,52,340,339,36.84,337,49,360,358,336]中找出大于1800并且最接近1800的数
time: 2022-12-8 9:20:00
tag: 算法
banner: 
---


## ps: 可以做个小程序
## 最近开发票，为了凑一个数，要大于开票额度，但是又不能超出太多（生活拮据，精打细算），所以想出要不弄个算法来实现，一个个加是在太费时间
## 如何在一个数组找出随即个数的数字之和大于某个数，但是最接近这个数，例如在数组[308,311,350,200,400,315,288,375,52,340,339,36.84,337,49,360,358,336]中找出大于1800并且最接近1800的数
## 利用二进制
### 这个数组中一共17个数，所以要遍历2^17次 算法复杂度为O(2^n*n) 
```javascript
const nums = [308, 311, 350, 200, 400, 315, 288, 375, 52, 340, 339, 36.84, 337, 49, 360, 358, 336]

const _nums_len = nums.length
const len = Math.pow(2, _nums_len)

function strToLen (str, len) {
 const _len = str.length
 if (_len < len) {
  return '0'.repeat(len - _len) + str
 } else {
  return str.slice(0, len)
 }
}

let min = 18000, minArr = []
for (let i = 0; i < len; i++) {
 const _num = strToLen(i.toString(2), _nums_len)

 let sum = 0, _tempArr = []
 _num.split('').forEach((item, index) => {
  if (item === '1') {
   sum+= nums[index]
   _tempArr = [..._tempArr, nums[index]]
  }
 })
 if(sum > 1800 && sum < min) {
  min = sum
  minArr = _tempArr
 }
}

console.log(min) 
console.log(minArr.join(','))
```
