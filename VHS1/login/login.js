// Get the login form, logout button, and status message elements
const loginForm = document.getElementById('login-form');
const logoutButton = document.getElementById('logout-button');
const loginStatus = document.getElementById('login-status');

// Function to set user login status in localStorage
const setUserLoginStatus = (isLoggedIn, userId) => {
  localStorage.setItem('isLoggedIn', isLoggedIn);
  if (isLoggedIn) {
    localStorage.setItem('userId', userId);
  } else {
    localStorage.removeItem('userId');
  }
};

// Function to check if the user is logged in
const isLoggedIn = () => {
  return localStorage.getItem('isLoggedIn') === 'true';
};

// Function to get the user ID
const getUserId = () => {
  return localStorage.getItem('userId');
};

// Check if the user is logged in when the page loads
window.addEventListener('load', () => {
  if (isLoggedIn()) {
    // User is logged in
    loginStatus.textContent = `Logged in as User ID: ${getUserId()}`;
    logoutButton.style.display = 'block'; // Show the logout button

    // Hide the login form
    loginForm.style.display = 'none';

  } else {
    // User is not logged in
    loginStatus.textContent = 'Not logged in';
    logoutButton.style.display = 'none'; // Hide the logout button
  }
});

// Event listener for form submission (login)
loginForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent form submission and page reload

  // Get the values entered by the user
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    // Send login credentials to the backend for verification
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Successful login
      loginStatus.textContent = data.message;
      setUserLoginStatus(true, data.user_id); // Set the user login status in localStorage
      logoutButton.style.display = 'block'; // Show the logout button
      // You can redirect the user to another page or perform additional actions here.
    } else {
      // Failed login
      loginStatus.textContent = data.error || 'Login failed. Please try again.';
    }
  } catch (error) {
    console.error(error);
    loginStatus.textContent = 'An error occurred during login. Please try again later.';
  }
});

// Event listener for logout button click
logoutButton.addEventListener('click', () => {
  // Clear the user login status in localStorage
  setUserLoginStatus(false, null);
  // Redirect the user to the login page
  window.location.href = 'login.html';
})