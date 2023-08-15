document.addEventListener("DOMContentLoaded", () => {
  renderCart();
});

let userId = localStorage.getItem("userId");

// Wyświetl userId w konsoli
console.log("User ID:", userId);

// Pobieranie aktualnego koszyka
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Pobieranie aktualnego koszyka
function renderCart() {
  const cart = getCart();

  const tableBody = document.querySelector("#cartTable tbody");
  tableBody.innerHTML = "";

  // Generuj wiersze tabeli na podstawie danych z LocalStorage
  cart.forEach((product, index) => {
    const row = document.createElement('tr');
    const total = product.price * product.quantityDays;

    // Przypisanie sumy jako total_price dla każdego produktu
    product.total_price = total.toFixed(2); // Format to two decimal places

    row.innerHTML = `
        <td>${product.title}</td>
        <td>${product.price} zł</td>
        <td>
        <select class="quantityDays" min="1" max="7" required>
            <option value="1" selected>1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
          </select>
        </td>
        <td>${total.toFixed(2)} zł</td> <!-- Format total to two decimal places -->
        <td><button onclick="removeFromCart(${index})">Usuń</button></td>
    `;

    const select = row.querySelector('.quantityDays');
    select.value = product.quantityDays; // Ustaw aktualną ilość

    select.addEventListener('change', () => {
      const newQuantityDays = parseInt(select.value);
      updateQuantityDays(index, newQuantityDays);
    });

    tableBody.appendChild(row);

    localStorage.setItem("cart", JSON.stringify(cart));

  });

  const totalSum = calculateTotalSum(cart);
  updateSummary(totalSum);
  performCheckout(cart);
}

// Funkcja aktualizacji localStorage
function performCheckout(cart) {
  cart.forEach((product) => {
    console.log('Total Price for', product.title, ':', product.total_price);
    // Tutaj możesz wykonać dalsze operacje z wartością total_price
  });
}

// Aktualizuj ilość
function updateQuantityDays(index, quantityDays) {
  // Pobierz dane z LocalStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  // Aktualizuj liczbę sztuk produktu
  cart[index].quantityDays = parseInt(quantityDays);
  // Zapisz zmiany w LocalStorage
  localStorage.setItem("cart", JSON.stringify(cart));
  // Odśwież tabelę koszyka
  renderCart();

  // policz sumę
  const totalSum = calculateTotalSum(cart);
}

// Funkcja do aktualizacji sumy koszyka
function updateSummary(totalSum) {
  const totalSumElement = document.getElementById("totalSum");
  totalSumElement.textContent = `Suma koszyka: ${totalSum} zł`;
}

// Oblicz sumę
function calculateTotalSum(cart) {
  const totalSum = cart.reduce((total, product) => {
    return total + product.price * product.quantityDays;
  }, 0);

  console.log("Całkowita suma:", totalSum); // Dodane logowanie
  return totalSum;
}

// Usuń produkt z koszyka
function removeFromCart(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// Wykonaj zamówienie
async function rentMovies() {
  const cart = getCart();

  try {
    for (const movie of cart) {
      
      function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }

      const userData = {
        user_id: userId,
        movie_id: movie.movie_id,
        start_date: formatDate(new Date()),
        end_date: formatDate(new Date(Date.now() + movie.quantityDays * 24 * 60 * 60 * 1000)),
        total_price: movie.total_price,
      };

      const orderResponse = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const orderData = await orderResponse.json();
      console.log("Order ID:", orderData.order_id);

      const quantityUpdate = -1;

      const updateResponse = await fetch(`http://localhost:3000/updateMovieQuantity/${movie.movie_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: quantityUpdate }),
      });

      const updateData = await updateResponse.json();
      console.log("Update Movie:", updateData);
    }

    alert(`Wypożyczyłeś filmy.`);
    localStorage.removeItem("cart");
    renderCart();
  } catch (error) {
    console.error("Error:", error);
  }
}

