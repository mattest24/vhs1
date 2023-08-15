// Pobierz formularz rejestracji
const registrationForm = document.getElementById('registration-form');
const registrationStatus = document.getElementById('registration-status');

// Obsłuż zdarzenie wysłania formularza
registrationForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Pobierz wartości wprowadzone przez użytkownika
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  try {
    // Wyślij dane rejestracji do backendu za pomocą metody POST
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password, confirmPassword }),
    });

    const data = await response.json();

    if (response.ok) {
      // Rejestracja udana
      registrationStatus.textContent = data.message;
      // Możesz przekierować użytkownika na inną stronę lub wykonać dodatkowe akcje tutaj.
    } else {
      // Błąd rejestracji
      registrationStatus.textContent = data.error || 'Registration failed. Please try again.';
    }
  } catch (error) {
    console.error(error);
    registrationStatus.textContent = 'An error occurred during registration. Please try again later.';
  }
});
