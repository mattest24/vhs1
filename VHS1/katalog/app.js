// Pobierz dane z serwera

document.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:3000/movies')
    .then(response => response.json())
    .then(data => {
      displayMovies(data); // Zmieniamy nazwę funkcji na displayMovies
    })
    .catch(error => console.error('Błąd pobierania danych:', error));
});

const table = document.getElementById('movieTable');

function displayMovies(data) {
  const table = document.getElementById('movieTable');
  const tbody = document.createElement('tbody');
  table.appendChild(tbody);

  data.forEach(movie => {
    let row = document.createElement('tr');
    row.innerHTML = `
      <td><a href="/katalog/product/product.html?id=${movie.movie_id}">${movie.title}</a></td>
      <td>${movie.year}</td>
      <td>${movie.director}</td>
      <td>${movie.price}</td>
      <td>${movie.quantity}</td>
      <td>
        ${
          movie.quantity > 0
            ? `<button onclick="addToCart(${movie.movie_id}, '${movie.title}', ${movie.price})">Wypożycz</button>`
            : `<button disabled>Wypożycz</button>`
        }
      </td>`;
    tbody.appendChild(row);
  });
}

// Function to add a movie to the cart
function addToCart(movie_id, title, price, quantityDays = 1) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (isLoggedIn) {
    const movie = { movie_id, title, price, quantityDays };
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(movie);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${title} has been added to your cart.`);
  } else {
    // Użytkownik nie jest zalogowany - przekieruj na stronę logowania
    alert(`Musisz być zalogowany!`);
    window.location.href = '../login/login.html';
  }
}

let sortAscending = true; // Add this variable outside the function

function sortTable(column) {
  let table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("movieTable");
  switching = true;
  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[column];
      y = rows[i + 1].getElementsByTagName("TD")[column];
      if (sortAscending) {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      } else {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
  sortAscending = !sortAscending; // Add this to toggle the sorting direction
}