<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

const currencies = ref([])
const selectedCurrency = ref(null)
const comparisonCurrency = ref(null)
const exchangeRates = ref({})
const currencyAmount = ref('')
const comparisonAmount = ref('')
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

// Calculate the comparison from the first currency to the second currency
const calculateComparison = () => {
  if (selectedCurrency.value && comparisonCurrency.value && currencyAmount.value) {
    const rate1 = exchangeRates.value[selectedCurrency.value]
    const rate2 = exchangeRates.value[comparisonCurrency.value]
    console.log('Rate 1:', rate1)
    console.log('Rate 2:', rate2)

    const amount = parseFloat(currencyAmount.value)
    console.log('Amount:', amount)

    if (!isNaN(amount)) {
      // comparisonAmount.value = (amount * (rate2 / rate1)).toFixed(0)
      const result = ((amount / rate1) * rate2).toFixed(0)
      console.log('Result:', result)
      comparisonAmount.value = result
    } else {
      comparisonAmount.value = ''
    }
  } else {
    comparisonAmount.value = ''
  }
}

// Calculate the comparison from the second currency to the first currency
const calculateReverseComparison = () => {
  if (selectedCurrency.value && comparisonCurrency.value && comparisonAmount.value) {
    const rate1 = exchangeRates.value[selectedCurrency.value]
    const rate2 = exchangeRates.value[comparisonCurrency.value]
    const amount = parseFloat(comparisonAmount.value)

    if (!isNaN(amount)) {
      currencyAmount.value = (amount * (rate1 / rate2)).toFixed(0)
    } else {
      currencyAmount.value = ''
    }
  } else {
    currencyAmount.value = ''
  }
}

// Watch for changes in currencyAmount and update comparisonAmount
watch(currencyAmount, () => {
  calculateComparison()
})

// Watch for changes in comparisonAmount and update currencyAmount
watch(comparisonAmount, () => {
  calculateReverseComparison()
})

// Swap currencies and amounts
const swapCurrencies = () => {
  ;[selectedCurrency.value, comparisonCurrency.value] = [
    comparisonCurrency.value,
    selectedCurrency.value,
  ]
  ;[currencyAmount.value, comparisonAmount.value] = [comparisonAmount.value, currencyAmount.value]
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
      <select id="currency-select" v-model="selectedCurrency">
        <option v-for="currency in currencies" :key="currency" :value="currency">
          {{ currency }}
        </option>
      </select>

      <div class="flagContainer">
        <img
          class="flag-icon"
          v-if="selectedCurrency && getFlag(selectedCurrency)"
          :src="getFlag(selectedCurrency)"
          :alt="`${selectedCurrency} flag`"
        />
      </div>

      <input
        id="firstCurrencyAmount"
        type="text"
        v-model="currencyAmount"
        placeholder="Amount"
        inputmode="numeric"
      />
    </div>

    <!-- Second currency to compare dropdown and input -->
    <label id="label2" for="currency-select-two">Compare to</label>
    <div id="secondCurrencyContainer">
      <select id="currency-select-two" v-model="comparisonCurrency">
        <option v-for="currency in currencies" :key="currency" :value="currency">
          {{ currency }}
        </option>
      </select>

      <div class="flagContainer">
        <img
          class="flag-icon"
          v-if="comparisonCurrency && getFlag(comparisonCurrency)"
          :src="getFlag(comparisonCurrency)"
          :alt="`${comparisonCurrency} flag`"
        />
      </div>

      <input
        id="secondCurrencyAmount"
        type="text"
        v-model="comparisonAmount"
        placeholder="Amount"
        inputmode="numeric"
      />
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
  height: 250px;
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
  margin-right: 10px;
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
  margin-top: 20px;
  font-size: 1.25rem;
  color: white;
  text-align: center;
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
