let stocks = [];

// Function to display loading message
function showLoading() {
    const stockList = document.querySelector('#stock-list');
    stockList.innerHTML = '<p>Loading stock data...</p>';
}

// Function to hide loading message
function hideLoading() {
    const stockList = document.querySelector('#stock-list');
    stockList.innerHTML = '';
}

// Function to fetch stock data from a local json-server API
function fetchStockData() {
    showLoading();
    fetch('http://localhost:3000/stocks')
        .then(response => response.json())
        .then(data => {
            hideLoading();
            stocks = data;
            displayFilteredStocks(stocks);
        })
        .catch(error => {
            hideLoading();
            console.error('Error fetching stock data:', error);
            document.querySelector('#stock-list').innerHTML = '<p>Failed to load data. Please try again later.</p>';
        });
}

// Function to display stocks
function displayFilteredStocks(stocks) {
    const stockList = document.querySelector('#stock-list');
    stockList.innerHTML = ''; // Clear previous data

    stocks.forEach(stock => {
        const stockItem = document.createElement('div');
        const percentageChange = ((stock.price - stock.open) / stock.open * 100).toFixed(2);
        
        stockItem.innerHTML = `
            <h2>${stock.name} (${stock.symbol})</h2>
            <p>Current Price: $${stock.price}</p>
            <p>Daily High: $${stock.high}</p>
            <p>Daily Low: $${stock.low}</p>
            <p>Change: ${percentageChange}%</p>
            <button onclick="deleteStock(${stock.id})">Delete</button>
        `;
        stockList.appendChild(stockItem);
    });
}

// Function to sort stocks by a given attribute
function sortStocks(attribute) {
    const stockList = Array.from(document.querySelectorAll('#stock-list > div'));
    stockList.sort((a, b) => {
        if (attribute === 'name') {
            return a.querySelector('h2').textContent.localeCompare(b.querySelector('h2').textContent);
        } else if (attribute === 'price') {
            const priceA = parseFloat(a.querySelector('p').textContent.replace('Current Price: $', ''));
            const priceB = parseFloat(b.querySelector('p').textContent.replace('Current Price: $', ''));
            return priceA - priceB;
        }
    });

    const stockContainer = document.querySelector('#stock-list');
    stockContainer.innerHTML = '';
    stockList.forEach(stock => stockContainer.appendChild(stock));
}

// Function to filter stocks by search input
function searchStocks() {
    const searchValue = document.querySelector('#search-bar').value.toLowerCase();
    const stockList = document.querySelectorAll('#stock-list > div');

    stockList.forEach(stock => {
        const stockName = stock.querySelector('h2').textContent.toLowerCase();
        if (stockName.includes(searchValue)) {
            stock.style.display = 'block';
        } else {
            stock.style.display = 'none';
        }
    });
}

// Function to filter stocks by price range
function filterStocksByPrice() {
    const minPrice = parseFloat(document.querySelector('#min-price').value) || 0;
    const maxPrice = parseFloat(document.querySelector('#max-price').value) || Infinity;
    
    const filteredStocks = stocks.filter(stock => stock.price >= minPrice && stock.price <= maxPrice);
    displayFilteredStocks(filteredStocks);
}

// Function to add a new stock
function addStock() {
    const name = document.querySelector('#new-stock-name').value;
    const symbol = document.querySelector('#new-stock-symbol').value;
    const price = parseFloat(document.querySelector('#new-stock-price').value);

    const newStock = { name, symbol, price, high: price + 10, low: price - 10, open: price };

    fetch('http://localhost:3000/stocks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newStock)
    })
    .then(response => response.json())
    .then(stock => {
        stocks.push(stock);
        displayFilteredStocks(stocks);
    })
    .catch(error => console.error('Error adding stock:', error));
}

// Function to delete a stock
function deleteStock(id) {
    fetch(`http://localhost:3000/stocks/${id}`, {
        method: 'DELETE'
    })
    .then(() => {
        stocks = stocks.filter(stock => stock.id !== id);
        displayFilteredStocks(stocks);
    })
    .catch(error => console.error('Error deleting stock:', error));
}

// Dark mode toggle function
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

// Event Listeners
document.querySelector('#sort-name').addEventListener('click', () => sortStocks('name'));
document.querySelector('#sort-price').addEventListener('click', () => sortStocks('price'));
document.querySelector('#search-bar').addEventListener('input', searchStocks);
document.querySelector('#filter-button').addEventListener('click', filterStocksByPrice);
document.querySelector('#add-stock-button').addEventListener('click', addStock);
document.querySelector('#dark-mode-toggle').addEventListener('click', toggleDarkMode);

// Fetch and display stock data on initial load
fetchStockData();
