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

    <!-- Swap button -->
    <button id="swapBtn" @click="swapCurrencies">
      <img src="../components/icons/swap.png" alt="" />
    </button>

    <!-- Second currency to compare dropdown and input -->
    <label id="label2" for="currency-select-two">Compare to</label>
    <div id="secondCurrencyContainer">
      <v-select v-model="comparisonCurrency" :options="currencies" label="currency">
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
        <p id="placeholderResult" v-else>Result</p>
      </div>
    </div>

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
  background-image: url(../assets/gradient.png);
  background-size: 1000px 1000px;
  border-radius: 10px;
  box-shadow:
    rgba(0, 0, 0, 0.4) 0px 2px 4px,
    rgba(0, 0, 0, 0.3) 0px 7px 13px -3px,
    rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  width: 90%;
  height: 100%;
}

.v-select {
  width: 200px;
  border-radius: 5px;
  background-color: white;
  font-family: 'Hanken Grotesk', sans-serif;
  font-size: 16px;
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

  background-color: transparent;
  color: white;
  font-family: 'Hanken Grotesk', sans-serif;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  box-shadow:
    rgba(0, 0, 0, 0.25) 0px 54px 55px,
    rgba(0, 0, 0, 0.12) 0px -12px 30px,
    rgba(0, 0, 0, 0.12) 0px 4px 6px,
    rgba(0, 0, 0, 0.17) 0px 12px 13px,
    rgba(0, 0, 0, 0.09) 0px -3px 5px;
  height: 30px;
  padding: 2px;
  margin-bottom: 10px;
}

#swapBtn img {
  width: 30px;
  height: 30px;
}

label {
  font-size: 1.25rem;
  color: white;
  margin-bottom: 5px;
  font-family: 'Hanken Grotesk', sans-serif;
  font-size: 1.2rem;
  font-weight: 400;
}

#firstCurrencyAmount {
  width: 195px;
  height: 30px;
  padding: 0 0 0 5px;
  margin-top: 10px;
  border-radius: 5px;
  border: none;
  font-family: 'Hanken Grotesk', sans-serif;
  font-size: 14px;
}

#firstCurrencyContainer,
#secondCurrencyContainer {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
  width: 300px;
}

#comparisonResult {
  font-size: 14px;
  color: black;
  font-family: 'Hanken Grotesk', sans-serif;
  height: 30px;
  display: flex;
  align-items: center;
  width: 195px;
  background-color: white;
  border-radius: 5px;
  padding-left: 5px;
  margin-top: 10px;
}

#placeholderResult {
  color: grey;
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
