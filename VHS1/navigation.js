const userId = localStorage.getItem('userId');
// Funkcja, która aktualizuje tekst w linku na "Logout"
const setUserLoginStatus = (isLoggedIn, userId) => {
  localStorage.setItem('isLoggedIn', isLoggedIn);
  if (isLoggedIn) {
    localStorage.setItem('userId', userId);
  } else {
    localStorage.removeItem('userId');
    clearCart();
  }
};

function clearCart() {
  localStorage.removeItem("cart");
}

function loginLogoutSwitch() {
  const loginLink = document.querySelector('nav ul li a[href="login/login.html"]');
  const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === "true") {
    loginLink.textContent = "Logout";
    loginLink.href = "#"; // Poniżej dodaj obsługę wylogowania
    loginLink.addEventListener('click', () => {
        setUserLoginStatus(false, null);
        // Redirect the user to the login page
        window.location.href = 'login/login.html';
      isLoggedIn = false;
    });
  } else {
    loginLink.textContent = "Login";
    loginLink.href = "login/login.html"; // Przywracamy link do strony logowania
  }
}

// Wywołujemy funkcję po załadowaniu strony
window.addEventListener('DOMContentLoaded', loginLogoutSwitch);