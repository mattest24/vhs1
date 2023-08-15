// Function to check if the user is logged in
const isLoggedIn = () => {
  return localStorage.getItem("isLoggedIn") === "true";
};

// Function to get the user ID
const getUserId = () => {
  return localStorage.getItem("userId");
};

// Function to handle form submission (address data)
const handleAddressFormSubmit = async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const city = document.getElementById("city").value;
  const zipCode = document.getElementById("zipCode").value;

  try {
    const response = await fetch("http://localhost:3000/save-address", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, address, city, zipCode }),
    });

    if (response.ok) {
      // Address data saved successfully
      const loginStatus = document.getElementById("login-status");
      loginStatus.textContent = "Address data saved successfully";
    } else {
      // Failed to save address data
      const loginStatus = document.getElementById("login-status");
      loginStatus.textContent = "Failed to save address data";
    }
  } catch (error) {
    console.error(error);
    const loginStatus = document.getElementById("login-status");
    loginStatus.textContent =
      "An error occurred while saving address data. Please try again later.";
  }
};

// Funkcja do obsługi wylogowania
const handleLogout = () => {
  // Usuń userId z local storage
  localStorage.removeItem("userId");

  // Ustaw isLoggedIn na false w local storage
  localStorage.setItem("isLoggedIn", "false");

  // Ukryj przycisk wylogowania
  hideLogoutButton();

  // Odśwież stronę automatycznie
  location.reload();
};

// Nasłuchuj kliknięcia na przycisku wylogowania
const logoutButton = document.getElementById("logout-button");
logoutButton.addEventListener("click", handleLogout);

// Funkcja ukrycia przycisku wyloguj
function hideLogoutButton() {
  const logoutButton = document.getElementById("logout-button");
  if (!isLoggedIn()) {
    logoutButton.style.display = "none";
  } else {
    logoutButton.style.display = "block";
  }
}

// Sprawdź, czy użytkownik jest zalogowany przy załadowaniu strony
window.addEventListener("load", () => {
  if (isLoggedIn()) {
    // User is logged in
    const loginStatus = document.getElementById("login-status");
    loginStatus.textContent = `Zalogowany jako użytkownik o ID: ${getUserId()}`;

    // Show the logout button
    hideLogoutButton();
  } else {
    // User is not logged in
    const loginStatus = document.getElementById("login-status");
    loginStatus.textContent = "Nie jesteś zalogowany";
    hideLogoutButton();
    hideOrdersButton(); 
  }
});

// Funkcja ukrycia przycisku Zamówienia
function hideOrdersButton() {
  const logoutButton = document.getElementById("ordersButton");
  if (!isLoggedIn()) {
    logoutButton.style.display = "none";
  } else {
    logoutButton.style.display = "block";
  }
}