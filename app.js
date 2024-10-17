// Fetching crypto data from the CoinGecko API
async function fetchCryptos() {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1');
      const cryptos = await response.json();
      displayCryptos(cryptos);  // Display fetched data on the page
      return cryptos;  // Return the data for further usage (e.g., search)
    } catch (error) {
      console.error('Error fetching cryptos:', error);
    }
  }
  
  // Display the crypto data on the page
  function displayCryptos(cryptos) {
    const container = document.getElementById('crypto-container');
    container.innerHTML = '';  // Clear any previous data
  
    cryptos.forEach(crypto => {
      const cryptoCard = document.createElement('div');
      cryptoCard.classList.add('crypto-card');
      cryptoCard.innerHTML = `
        <h3>${crypto.name} (${crypto.symbol.toUpperCase()})</h3>
        <p>Price: $${crypto.current_price.toFixed(2)}</p>
        <p>Market Cap: $${crypto.market_cap.toLocaleString()}</p>
        <p>24h Change: ${crypto.price_change_percentage_24h.toFixed(2)}%</p>
      `;
      container.appendChild(cryptoCard);
    });
  }
  
  // Event listener for the search input
  document.getElementById('search-input').addEventListener('input', function (e) {
    const searchTerm = e.target.value.toLowerCase();  // Get the search term
  
    // Fetch data again and filter it based on the search term
    fetchCryptos().then(cryptos => {
      const filteredCryptos = cryptos.filter(crypto =>
        crypto.name.toLowerCase().includes(searchTerm) || crypto.symbol.toLowerCase().includes(searchTerm)
      );
      displayCryptos(filteredCryptos);  // Display the filtered cryptos
    });
  });
  
  // Event listener for dark/light mode toggle
  document.getElementById('toggle-mode').addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');  // Toggle dark mode class on the body element
  });
  
  // Fetch and display cryptos when the page loads
  fetchCryptos();
  