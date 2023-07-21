  // script.js


  window.addEventListener('DOMContentLoaded', (event) => {
    const catalogButton = document.querySelector('#catalogButton');
    
    catalogButton.addEventListener('click', () => {
      window.location.href = 'Katalog/katalog.html';
    });
  });