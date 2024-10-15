// Event listener for filter button
document.querySelector('#filter-button').addEventListener('click', filterStocksByPrice);

// Function to filter stocks based on the price range
function filterStocksByPrice() {
    const minPrice = parseFloat(document.querySelector('#min-price').value);
    const maxPrice = parseFloat(document.querySelector('#max-price').value);

    // Mock stock data (replace with fetched data)
    const mockStocks = [
        { name: 'Apple', symbol: 'AAPL', price: 150 },
        { name: 'Google', symbol: 'GOOGL', price: 2800 },
        { name: 'Microsoft', symbol: 'MSFT', price: 300 },
        { name: 'Amazon', symbol: 'AMZN', price: 3500 },
        { name: 'Tesla', symbol: 'TSLA', price: 700 }
    ];

    const filteredStocks = mockStocks.filter(stock => {
        if (isNaN(minPrice) && isNaN(maxPrice)) return true;
        if (!isNaN(minPrice) && stock.price < minPrice) return false;
        if (!isNaN(maxPrice) && stock.price > maxPrice) return false;
        return true;
    });

    displayFilteredStocks(filteredStocks);
}

// Function to display stocks on the page
function displayFilteredStocks(stocks) {
    const stockList = document.querySelector('#stock-list');
    stockList.innerHTML = ''; // Clear previous results

    stocks.forEach(stock => {
        const stockElement = document.createElement('div');
        stockElement.innerHTML = `
            <h2>${stock.name} (${stock.symbol})</h2>
            <p>Current Price: $${stock.price}</p>
        `;
        stockList.appendChild(stockElement);
    });
}

// Function to fetch stock data from a public API
function fetchStockData() {
    fetch('https://api.example.com/stock-data') // Replace with a real API URL
        .then(response => response.json())
        .then(data => {
            // Assuming the API returns an array of stock objects
            displayFilteredStocks(data);
        })
        .catch(error => console.error('Error fetching stock data:', error));
}

// Fetch and display stock data on initial load
fetchStockData();

