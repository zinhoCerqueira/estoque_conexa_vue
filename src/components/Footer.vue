<template>
    <div class="footer">
      <p>&copy; {{ new Date().getFullYear() }} Conexa App. Todos os direitos reservados.</p>
    </div>
  </template>
  
  <script>
  export default {
    name: "FooterComponent",
  };
  </script>
  
  <style scoped>
  /* Footer container */
  .footer {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f7e7d8;
    padding: 20px;
    font-family: 'Montserrat', Arial, sans-serif;
    font-weight: bold;
    color: #333;
  }
  </style>
  