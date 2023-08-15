const getData = async () => {
  try {
    const response = await fetch("http://localhost:3001/api/getMovies/1");
    const movies = await response.json();

    const firstMovie = movies[0];
    console.log(firstMovie);
    const movieTitle = document.querySelector("#movieTitle");
    const movieDescription = document.querySelector("#movieDescription");
    const movieRating = document.querySelector("#movieRating");
    const movieImage = document.querySelector("#movieImage");

    movieTitle.textContent = firstMovie.title;
    movieDescription.textContent = firstMovie.description;
    movieRating.textContent = firstMovie.rating;

    const imageName = firstMovie.title.replace(/\s+/g, "_"); // Zamień spacje na podkreślenia w nazwie pliku
    const imageUrl = `../../img/${imageName}.jpg`; // Ścieżka do pliku obrazu
    movieImage.style.backgroundImage = `url(${imageUrl})`;

    const rentButton = document.querySelector("#rentButton");
    const messageContainer = document.querySelector("#messageContainer");
  } catch (error) {
    console.error("Wystąpił błąd podczas pobierania danych:", error);
  }
};

getData();
function addToCart(title, price, quantity = 1) {
  // Sprawdź, czy użytkownik jest zalogowany na podstawie localStorage
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (isLoggedIn) {
    // Użytkownik jest zalogowany
    const movie = { title, price, quantity };
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(movie);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${title} has been added to your cart.`);
  } else {
    // Użytkownik nie jest zalogowany - przekieruj na stronę logowania
    alert(`Musisz być zalogowany!`);
    window.location.href = "../../login/login.html";
  }
}
rentButton.addEventListener("click", () => {
  addToCart();
  messageContainer.textContent = "Film został dodany do twojego koszyka!";
  messageContainer.style.backgroundColor = "#f600ff";
  messageContainer.style.padding = "5px";
});
