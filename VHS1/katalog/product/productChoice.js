let movie_id; 

// Funkcja do pobrania danych filmu
const getProductData = async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get("id"));

    const response = await fetch(`http://localhost:3000/moviedata/${productId}`);
    const movies = await response.json();

    const firstMovie = movies[0];
    
    let movieTitle = document.querySelector("#movieTitle");
    let movieDescription = document.querySelector("#movieDescription");
    let movieRating = document.querySelector("#movieRating");
    let movieImage = document.querySelector("#movieImage");

    movieTitle.textContent = firstMovie.polish_title;
    movieDescription.textContent = firstMovie.description;
    movieRating.textContent = firstMovie.rating;
    
    const imageName = firstMovie.polish_title.replace(/\s+/g, "_"); // Zamień spacje na podkreślenia w nazwie pliku
    const imageUrl = `../../img/${imageName}.jpg`; // Ścieżka do pliku obrazu
    movieImage.style.backgroundImage = `url(${imageUrl})`;

    const rentButton = document.querySelector("#rentButton");
    const messageContainer = document.querySelector("#messageContainer");
  } catch (error) {
    console.error("Wystąpił błąd podczas pobierania danych:", error);
  }
};

getProductData();

// Funkcja do dodania do koszyka
function addToCart(movie_id, movieTitle, moviePrice, quantityDays) {
  // Sprawdź, czy użytkownik jest zalogowany na podstawie localStorage
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (isLoggedIn) {
    // Użytkownik jest zalogowany
    const cartPrice = parseFloat(moviePrice);
    const movie = { movie_id, title: movieTitle, price: cartPrice, quantityDays: 1 };
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(movie);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${movieTitle} has been added to your cart.`);
  } else {
    // Użytkownik nie jest zalogowany - przekieruj na stronę logowania
    alert(`Musisz być zalogowany!`);
    window.location.href = '../../login/login.html';
  }
}

rentButton.addEventListener("click", () => {
  // Pobierz wartości z odpowiednich elementów na stronie
  const movieTitle = document.querySelector("#movieTitle").textContent;
  const moviePrice = document.querySelector("#moviePrice").textContent;
  
  // Wywołaj funkcję addToCart, przekazując odpowiednie wartości
  addToCart(movie_id, movieTitle, moviePrice);
  
    // Wywołaj funkcję showMessage, aby wyświetlić komunikat użytkownikowi
  showMessage("Film został dodany do twojego koszyka!", "#f600ff");
});

// Funkcja do wyświetlania komunikatu
function showMessage(message, color) {
  const messageContainer = document.querySelector("#messageContainer");
  messageContainer.textContent = message;
  messageContainer.style.backgroundColor = color;
  messageContainer.style.padding = "5px";
}

// funkcja do pobrania ceny filmu
const getMoviedata = async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get("id"));

    const response = await fetch(`http://localhost:3000/movies/${productId}`);
    const movies = await response.json();

    const firstMovie = movies[0];
    const moviePrice = firstMovie.price.toFixed(2) + " zł";
    const movieTitle = firstMovie.title;
    movie_id = firstMovie.movie_id;

    const moviePriceElement = document.querySelector("#moviePrice");
    moviePriceElement.textContent = moviePrice;

    const rentButton = document.querySelector("#rentButton");
    const messageContainer = document.querySelector("#messageContainer");


  } catch (error) {
    console.error("Wystąpił błąd podczas pobierania danych:", error);
  }
};

// Wywołanie funkcji
getMoviedata();





