<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

const currencies = ref([])
const selectedCurrency = ref('USD')
const comparisonCurrency = ref('SEK')
const exchangeRates = ref({})
const currencyAmount = ref('') // Keep as string for input binding
const time = ref('')

//Fetch flags matching the currencies country code eg. USD or SEK
const flags = ref([])

const fetchFlags = async () => {
  try {
    const response = await axios.get('/src/flags.json')
    flags.value = response.data
    console.log('Flags fetched:', flags.value)
  } catch (error) {
    console.error('Failed to fetch flags', error)
  }
}

// Fetch the currencies from the API with USD as the base currency
const fetchCurrencies = async () => {
  try {
    const apiKey = '284c17003fd75a314138773b'
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`)

    currencies.value = Object.keys(response.data.conversion_rates)
    exchangeRates.value = response.data.conversion_rates
    time.value = response.data.time_last_update_utc
    console.log('Currencies fetched:', currencies.value)
  } catch (error) {
    console.error('Failed to fetch currencies', error)
  }
}

// Switch the currency rate when the currency is changed
const switchCurrencyRate = async () => {
  try {
    const apiKey = '284c17003fd75a314138773b'
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${selectedCurrency.value}`,
    )
    currencies.value = Object.keys(response.data.conversion_rates)
    exchangeRates.value = response.data.conversion_rates
    time.value = response.data.time_last_update_utc
  } catch (error) {
    console.error('Failed to fetch currencies', error)
  }
}

// Computed property to calculate the converted amount
const convertedAmount = computed(() => {
  if (currencyAmount.value && selectedCurrency.value && comparisonCurrency.value) {
    const rate = exchangeRates.value[comparisonCurrency.value]
    const amount = parseFloat(currencyAmount.value) // Ensure it's treated as a number
    if (!isNaN(amount)) {
      return (amount * rate).toFixed(2)
    }
  }
  return ''
})

// Swap currencies
const swapCurrencies = () => {
  ;[selectedCurrency.value, comparisonCurrency.value] = [
    comparisonCurrency.value,
    selectedCurrency.value,
  ]

  switchCurrencyRate()
}

const getFlag = (currencyCode) => {
  const flag = flags.value.find((flag) => flag.code === currencyCode)
  return flag ? flag.flag : null
}

// Fetch currencies and flags when the component is mounted
onMounted(() => {
  fetchCurrencies()
  fetchFlags()
})
</script>

<template>
  <div id="currency-select-container">
    <!-- First currency dropdown and input -->
    <label id="label1" for="currency-select">Select a currency</label>
    <div id="firstCurrencyContainer">
      <v-select
        id="currency-select"
        v-model="selectedCurrency"
        :options="currencies"
        label="currency"
        @input="switchCurrencyRate"
      >
        <template #option="{ currency }">
          <div style="display: flex; align-items: center">
            <img
              :src="getFlag(currency)"
              :alt="`${currency} flag`"
              style="width: 20px; height: 15px; margin-right: 10px"
            />
            {{ currency }}
          </div>
        </template>
      </v-select>

      <input
        id="firstCurrencyAmount"
        type="number"
        v-model="currencyAmount"
        placeholder="Amount"
        inputmode="numeric"
      />
    </div>

    <!-- Second currency to compare dropdown and input -->
    <label id="label2" for="currency-select-two">Compare to</label>
    <div id="secondCurrencyContainer">
      <v-select
        id="currency-select-two"
        v-model="comparisonCurrency"
        :options="currencies"
        label="currency"
      >
        <template #option="{ currency }">
          <div style="display: flex; align-items: center">
            <img
              :src="getFlag(currency)"
              :alt="`${currency} flag`"
              style="width: 20px; height: 15px; margin-right: 10px"
            />
            {{ currency }}
          </div>
        </template>
      </v-select>
      <div id="comparisonResult">
        <p v-if="currencyAmount && selectedCurrency && comparisonCurrency">
          {{ convertedAmount }} {{ comparisonCurrency }}
        </p>
      </div>
    </div>
    <button id="swapBtn" @click="swapCurrencies">
      Swap
      <img src="../components/icons/swap.png" alt="" />
    </button>
    <p id="time">{{ time }}</p>
  </div>
</template>
<style scoped>
#currency-select-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 20px;
  background-color: #393e46;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 90%;
  height: 100%;
}

.v-select {
  background-color: white;
  display: flex;
}

#time {
  color: white;
  font-size: 0.8rem;
}

#swapBtn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  background-color: #222831;
  color: white;
  font-size: 1.1rem;
  border: none;
  border-radius: 5px;
  height: 30px;
  width: 100px;
  padding: 0;
}

#swapBtn img {
  width: 30px;
  height: 30px;
  margin-left: 10px;
}

label {
  font-size: 1.25rem;
  color: white;
  margin-bottom: 5px;
}

#firstCurrencyAmount {
  width: 80px;
  height: 20px;
  padding: 5px;
  margin-left: 10px;
  border-radius: 5px;
  border: none;
}

#secondCurrencyAmount {
  width: 80px;
  height: 20px;
  padding: 5px;
  margin-left: 10px;
  border-radius: 5px;
  border: none;
  margin-right: 10px;
}

#firstCurrencyContainer,
#secondCurrencyContainer {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}

#currency-select,
#currency-select-two {
  width: 100px;
  height: 30px;
  border-radius: 5px;
  border: none;
}

#comparisonResult {
  font-size: 15px;
  color: white;
  margin-left: 10px;
  height: 30px;
  display: flex;
  align-items: center;
  width: 90px;
}

.flag-icon {
  width: 30px;
  height: 30px;
  border-radius: 3px;
}

.flagContainer {
  width: 30px;
  height: 30px;
  margin-left: 10px;
}
</style>
