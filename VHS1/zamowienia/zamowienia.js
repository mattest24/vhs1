document.addEventListener('DOMContentLoaded', async () => {
  // Pobierz userId z localStorage
  const userId = localStorage.getItem('userId');

  // Utwórz adres URL z userId
  const url = `http://localhost:3000/user_orders/${userId}`;

  try {
    // Pobranie danych o zamówieniach z backendu
    const response = await fetch(url);
    const data = await response.json();
    const movieData = await fetchMovies(data); // Pobranie danych o filmach
    await displayCurrentOrders(data, movieData);
    await displayOrderHistory(data, movieData); // Dodaj to wywołanie
  } catch (error) {
    console.error('Błąd pobierania danych:', error);
  }

  // Pobierz dane o filmach z serwera
  async function fetchMovies(data) {
    const uniqueMovieIds = [...new Set(data.map(order => order.movie_id))];
    const url_movies = `http://localhost:3000/movies`;

    const response = await fetch(url_movies);
    const allMovieData = await response.json();

    const filteredMovieData = allMovieData.filter(movie => uniqueMovieIds.includes(movie.movie_id));
    return filteredMovieData;
  }

  // Funkcja wyświetl dane o zamówieniach
  async function displayCurrentOrders(data, movieData) {
    const tableBody = document.querySelector("#currentOrdersTable tbody");
    const todayDate = new Date();

    for (const order of data) {
      try {
        const startDate = new Date(order.start_date);
        const endDate = new Date(order.end_date);

        if (endDate >= todayDate) {
          const movieId = order.movie_id;
          const movie = movieData.find(movie => movie.movie_id === movieId);
          const movieTitle = movie ? movie.title : 'Nieznany tytuł';

          const row = document.createElement("tr");
          // Wypełnienie tabeli danymi
          row.innerHTML = `
            <td>${movieTitle}</td>
            <td>${startDate.toLocaleDateString("pl-PL", { month: "short", day: "2-digit", year: "2-digit" })}</td>
            <td>${endDate.toLocaleDateString("pl-PL", { month: "short", day: "2-digit", year: "2-digit" })}</td>
            <td>${order.total_price}</td>
            <td><button class="returnButton" data-movie-title="${movieTitle}" data-order-id="${order.order_id}">Zwróć</button></td>
          `;
          tableBody.appendChild(row);
        }
      } catch (error) {
        console.error('Błąd pobierania tytułu filmu:', error);
      }
    }
  }

  // Funkcja wyświetl dane o zamówieniach
function displayOrderHistory(data, movieData) {
  const tableBody = document.querySelector("#orderHistoryTable tbody");
  const todayDate = new Date();

  data.forEach(order => {
    const row = document.createElement("tr");
    const startDate = new Date(order.start_date);
    const endDate = new Date(order.end_date);

    if (endDate < todayDate) {
      const movieId = order.movie_id;
      const movie = movieData.find(movie => movie.movie_id === movieId);
      const movieTitle = movie ? movie.title : 'Nieznany tytuł';
      // Wypełnienie tabeli danymi
      row.innerHTML = `
        <td>${movieTitle}</td>
        <td>${startDate.toLocaleDateString("pl-PL", { month: "short", day: "2-digit", year: "2-digit" })}</td>
        <td>${endDate.toLocaleDateString("pl-PL", { month: "short", day: "2-digit", year: "2-digit" })}</td>
        <td>Zakończona</td>
      `;
      tableBody.appendChild(row);
    }
  });
}

const returnButtons = document.querySelectorAll(".returnButton");
returnButtons.forEach(button => {
  button.addEventListener("click", async () => {
    const orderId = button.dataset.orderId;
    const movieTitle = button.dataset.movieTitle;

    try {
      // Pobierz informacje o zamówieniu
      const orderInfoEndpoint = `http://localhost:3000/orders/${orderId}`;
      const orderInfoResponse = await fetch(orderInfoEndpoint);
      const orderInfo = await orderInfoResponse.json();

      // Pobierz informacje o filmie
      const movieId = orderInfo.movie_id;
      const movieInfoEndpoint = `http://localhost:3000/movies/${movieId}`;
      const movieInfoResponse = await fetch(movieInfoEndpoint);
      const movieInfo = await movieInfoResponse.json();

      const currentDate = new Date();
      const endDate = new Date(orderInfo.end_date);
      const moviePrice = movieInfo[0].price;

      console.log(moviePrice);
      
      const diffInMs = endDate - currentDate;
      const daysLeft = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      const discount = Math.floor(daysLeft * moviePrice); // Poprawiono sposób obliczania rabatu

      console.log(discount);
      console.log(daysLeft);



      const confirmMessage = `Czy chcesz dzisiaj zwrócić film ${movieTitle}?\nOtrzymasz rabat w wysokości ${discount} zł.`;

      const confirmReturn = confirm(confirmMessage);
      if (confirmReturn) {
        alert(`Czekamy na zwrot filmu. Pozdrawiamy serdecznie.`);

        const endpoint = `http://localhost:3000/orders/${orderId}`;
        const response = await fetch(endpoint, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ end_date: currentDate.toISOString().split('T')[0] })
        });

        if (response.status === 200) {
          alert(`Zwrócono film ${movieTitle}.`);

          // Zmniejsz ilość dostępnych kopii filmu w bazie danych
        const quantityUpdate = +1;
        const updateResponse = await fetch(`http://localhost:3000/updateMovieQuantity/${movieId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: quantityUpdate }),
        });

        const updateData = await updateResponse.json();
        console.log("Update Movie:", updateData);
          
        }
      }
    } catch (error) {
      console.error('Błąd:', error);
    }
  });
});

});
