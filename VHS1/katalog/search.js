// search.js

// Function to perform the search
function searchMovies() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const rows = document.querySelectorAll('#movieTable tbody tr');
  
    rows.forEach((row) => {
      const title = row.cells[0].innerText.toLowerCase();
      const director = row.cells[2].innerText.toLowerCase();
      const year = row.cells[1].innerText;
  
      // Check if the title, director, or year includes the search term
      if (title.includes(searchTerm) || director.includes(searchTerm) || year.includes(searchTerm)) {
        row.style.display = ''; // Show the row if it matches the search term
      } else {
        row.style.display = 'none'; // Hide the row if it doesn't match the search term
      }
    });
  }
  
  // Event listeners for search input and search button
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', searchMovies);
  
  const searchButton = document.getElementById('searchButton');
  searchButton.addEventListener('click', searchMovies);