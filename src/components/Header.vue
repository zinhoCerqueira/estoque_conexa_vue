<template>
    <div class="header">
      <!-- Logo -->
      <img
        decoding="async"
        width="197"
        height="48"
        alt="Conexa App Logo"
        src="https://storage.googleapis.com/site-upload-storage/sites/conexa.png"
        class="img-responsive wp-image-2877 disable-lazyload"
      />
  
      <!-- Logout Button -->
      <button class="logout-button" @click="logout">
        Logout
        <i class="fa-solid fa-right-from-bracket" style="margin-left: 5px;"></i>
      </button>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      logout() {
        localStorage.clear();
        window.location.reload(); // Reload da página após o logout
      },
    },
  };
  </script>
  
  <style scoped>
  /* Importando a fonte Montserrat */
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');
  
  /* Aplicando a fonte Montserrat ao corpo */
  body {
    font-family: 'Montserrat', Arial, sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  /* Header container */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f7e7d8;
    padding: 20px;
  }
  
  /* Logout Button */
  .logout-button {
    padding: 10px 20px;
    background-color: #d8781e;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    font-family: 'Montserrat', Arial, sans-serif;
    transition: opacity 0.3s ease;
  }
  
  .logout-button:hover {
    opacity: 0.9;
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .header {
      flex-direction: column;
      align-items: flex-start;
    }
  
    .menu {
      justify-content: flex-start;
      margin-top: 15px;
    }
  
    .logout-button {
      margin-top: 15px;
      align-self: flex-end;
    }
  }
  </style>
  