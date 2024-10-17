let currentPage = 1;
let currency = 'usd';
let cryptos = [];

// Fetch crypto data from the CoinGecko API
async function fetchCryptos(currency = 'usd', page = 1) {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=10&page=${page}`;
  const loadingIndicator = document.getElementById('loading');
  loadingIndicator.style.display = 'block';  // Show loading

  try {
    const response = await fetch(url);
    cryptos = await response.json();
    loadingIndicator.style.display = 'none';  // Hide loading
    displayCryptos(cryptos);  // Display fetched data on the page
    return cryptos;  // Return the data for further usage (e.g., search and sort)
  } catch (error) {
    loadingIndicator.style.display = 'none';  // Hide loading
    document.getElementById('crypto-container').innerHTML = '<p>Failed to load data. Please try again later.</p>';
    console.error('Error fetching cryptos:', error);
  }
}

// Display the crypto data on the page
function displayCryptos(cryptos) {
  const container = document.getElementById('crypto-container');
  container.innerHTML = '';  // Clear previous data

  cryptos.forEach(crypto => {
    const cryptoCard = document.createElement('div');
    cryptoCard.classList.add('crypto-card');
    cryptoCard.innerHTML = `
      <h3>${crypto.name} (${crypto.symbol.toUpperCase()})</h3>
      <p>Price: ${currency.toUpperCase()} ${crypto.current_price.toFixed(2)}</p>
      <p>Market Cap: ${crypto.market_cap.toLocaleString()}</p>
      <p>24h Change: ${crypto.price_change_percentage_24h.toFixed(2)}%</p>
      <button onclick="toggleFavorite('${crypto.id}')">⭐ Favorite</button>
      <button onclick="showCryptoDetails('${crypto.id}')">More Details</button>
    `;
    container.appendChild(cryptoCard);
  });
}

// Event listener for search input
document.getElementById('search-input').addEventListener('input', function (e) {
  const searchTerm = e.target.value.toLowerCase();
  const filteredCryptos = cryptos.filter(crypto =>
    crypto.name.toLowerCase().includes(searchTerm) || crypto.symbol.toLowerCase().includes(searchTerm)
  );
  displayCryptos(filteredCryptos);
});

// Event listener for sorting options
document.getElementById('sort-options').addEventListener('change', function (e) {
  const sortBy = e.target.value;

  cryptos.sort((a, b) => {
    if (sortBy === 'price') return b.current_price - a.current_price;
    if (sortBy === 'market-cap') return b.market_cap - a.market_cap;
    if (sortBy === '24h-change') return b.price_change_percentage_24h - a.price_change_percentage_24h;
  });
  displayCryptos(cryptos);
});

// Event listener for currency selection
document.getElementById('currency-options').addEventListener('change', function (e) {
  currency = e.target.value;
  fetchCryptos(currency, currentPage);  // Fetch data in the selected currency
});

// Event listener for dark/light mode toggle
document.getElementById('toggle-mode').addEventListener('click', function () {
  document.body.classList.toggle('dark-mode');  // Toggle dark mode class on the body element
});

// Pagination controls
document.getElementById('next-page').addEventListener('click', () => {
  currentPage++;
  fetchCryptos(currency, currentPage);
  document.getElementById('previous-page').disabled = false;
});

document.getElementById('previous-page').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    fetchCryptos(currency, currentPage);
  }
  if (currentPage === 1) {
    document.getElementById('previous-page').disabled = true;
  }
});

// Favorite system with localStorage
function toggleFavorite(cryptoId) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  if (favorites.includes(cryptoId)) {
    favorites = favorites.filter(id => id !== cryptoId);
  } else {
    favorites.push(cryptoId);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  alert(`Favorite ${cryptoId} updated!`);
}

// Show details for a specific cryptocurrency
async function showCryptoDetails(cryptoId) {
  const url = `https://api.coingecko.com/api/v3/coins/${cryptoId}`;
  const response = await fetch(url);
  const cryptoDetails = await response.json();
  const detailsContainer = document.getElementById('crypto-details');

  detailsContainer.innerHTML = `
    <h3>${cryptoDetails.name} (${cryptoDetails.symbol.toUpperCase()})</h3>
    <p>Market Cap: $${cryptoDetails.market_cap.toLocaleString()}</p>
    <p>24h High: $${cryptoDetails.high_24h}</p>
    <p>24h Low: $${cryptoDetails.low_24h}</p>
    <p>Circulating Supply: ${cryptoDetails.circulating_supply.toLocaleString()}</p>
    <canvas id="price-chart"></canvas>
  `;

  // Fetch and display historical data
  fetchHistoricalData(cryptoId);
}

// Fetch historical data and display price chart
async function fetchHistoricalData(cryptoId) {
  const url = `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=${currency}&days=7`;
  const response = await fetch(url);
  const historicalData = await response.json();
  displayPriceChart(historicalData);
}

// Display price chart using Chart.js
function displayPriceChart(data) {
  const ctx = document.getElementById('price-chart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.prices.map(p => new Date(p[0]).toLocaleDateString()),
      datasets: [{
        label: `Price in ${currency.toUpperCase()}`,
        data: data.prices.map(p => p[1]),
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false
      }]
    }
  });
}

// Initial call to fetch and display cryptos
fetchCryptos();
