let apiKey = "9f8f04d314b7c43545434e30";
const api = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

const fromDropDown = document.getElementById("from-currency-select");
const toDropDown = document.getElementById("to-currency-select");

const populateDropdowns = (currencies, currencyNames) => {
    fromDropDown.innerHTML = ''; // Clear existing options
    toDropDown.innerHTML = ''; // Clear existing options

    currencies.forEach((currency) => {
        const option = document.createElement("option");
        option.value = currency;
        option.text = currency;
        fromDropDown.add(option);
        toDropDown.add(option.cloneNode(true)); // Add same option to the other dropdown
    });
};

let cachedData = null;

const fetchAndPopulateDropdowns = () => {
    fetch(api)
        .then((response) => {
            if (!response.ok) {
                console.error('Response status:', response.status);
                return response.text().then(text => {
                    console.error('Response text:', text);
                    throw new Error('Network response was not ok');
                });
            }
            return response.json();
        })
        .then((data) => {
            cachedData = data; // Cache the data
            const currencies = Object.keys(data.conversion_rates);
            populateDropdowns(currencies);

            // Set default values after populating
            fromDropDown.value = "USD";
            toDropDown.value = "INR";
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            alert('Failed to fetch currency data.');
        });
};

const convertCurrency = () => {
    const amount = parseFloat(document.querySelector("#amount").value);
    const fromCurrency = fromDropDown.value;
    const toCurrency = toDropDown.value;

    if (!isNaN(amount) && amount > 0) {
        if (cachedData) { // Use cached data
            const fromExchangeRate = cachedData.conversion_rates[fromCurrency];
            const toExchangeRate = cachedData.conversion_rates[toCurrency];
            const convertedAmount = (amount / fromExchangeRate) * toExchangeRate;
            document.querySelector("#result").innerHTML = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
        } else {
            alert('Currency data not available.');
        }
    } else {
        alert("Please enter a valid amount.");
    }
};

// Add event listeners
document.querySelector("#convert-button").addEventListener("click", convertCurrency);
window.addEventListener("load", fetchAndPopulateDropdowns);
