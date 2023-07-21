// app.js

// ... Reszta kodu ...

document.addEventListener('DOMContentLoaded', () => {
    fetch('data/movies.json')
      .then(response => response.json())
      .then(data => {
        displayMovies(data);
        displayCart();
      })
      .catch(error => console.error('Błąd pobierania danych:', error));
  });
  
  // ... Reszta kodu ...
  
  function displayCart() {
    const cartList = document.getElementById('cartList');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    // Czyścimy zawartość listy przed wyświetleniem
    cartList.innerHTML = '';
  
    // Wyświetlamy tytuły filmów z koszyka
    cart.forEach(title => {
      const listItem = document.createElement('li');
      listItem.textContent = title;
      cartList.appendChild(listItem);
    });
  }
  