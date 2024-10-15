// Event listeners for sorting buttons
document.querySelector('#sort-name').addEventListener('click', () => sortStocks('name'));
document.querySelector('#sort-price').addEventListener('click', () => sortStocks('price'));

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

    // Clear and re-append sorted elements
    const stockContainer = document.querySelector('#stock-list');
    stockContainer.innerHTML = '';
    stockList.forEach(stock => stockContainer.appendChild(stock));
}
