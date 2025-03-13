<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const currencies = ref([])
const selectedCurrency = ref(null)
const comparisonCurrency = ref(null)
const exchangeRates = ref({})

// Fetch the currencies from the API with USD as the base currency
const fetchCurrencies = async () => {
  try {
    const apiKey = '284c17003fd75a314138773b'
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`)

    currencies.value = Object.keys(response.data.conversion_rates)
    exchangeRates.value = response.data.conversion_rates
  } catch (error) {
    console.error('Failed to fetch currencies', error)
  }
}

// Calculate the comparison between the two currencies
const calculateComparison = () => {
  if (selectedCurrency.value && comparisonCurrency.value) {
    const rate1 = exchangeRates.value[selectedCurrency.value]
    const rate2 = exchangeRates.value[comparisonCurrency.value]
    return (rate2 / rate1).toFixed(4)
  }

  return null
}

onMounted(() => {
  fetchCurrencies()
})
</script>
<template>
  <div id="currency-select-container">
    <!-- First currency dropdown -->
    <label for="currency-select">Select a currency</label>
    <select id="currency-select" v-model="selectedCurrency">
      <option v-for="currency in currencies" :key="currency" :value="currency">
        {{ currency }}
      </option>
    </select>

    <!-- Second currency to compare dropdown -->
    <label for="currency-select-two">Compare to</label>
    <select id="currency-select-two" v-model="comparisonCurrency">
      <option v-for="currency in currencies" :key="currency" :value="currency">
        {{ currency }}
      </option>
    </select>

    <div id="comparisonResult" v-if="selectedCurrency && comparisonCurrency">
      <p>
        1 {{ selectedCurrency }} is equal to {{ calculateComparison() }} {{ comparisonCurrency }}
      </p>
    </div>
  </div>
</template>
<style scoped>
#currency-select-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  padding-top: 20px;
  padding-bottom: 20px;
  background-color: #393e46;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 90%;
  height: 400px;
}

label {
  font-size: 1.25rem;
  color: white;
}

#currency-select,
#currency-select-two {
  width: 100px;
  height: 30px;
  margin-bottom: 10px;
  border-radius: 5px;
}

#comparisonResult {
  margin-top: 20px;
  font-size: 1.25rem;
}
</style>
