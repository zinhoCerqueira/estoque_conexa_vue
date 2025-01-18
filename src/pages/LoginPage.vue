<template>
    <div class="container">
      <!-- Coluna 1 -->
      <div class="left-column">
        <div class="form-container">
          <form class="login-form" @submit.prevent="login">
            <label for="username">Usuário</label>
            <input
              type="text"
              id="username"
              v-model="form.username"
              placeholder="Digite seu usuário"
              required
            />
  
            <label for="password">Senha</label>
            <input
              type="password"
              id="password"
              v-model="form.password"
              placeholder="Digite sua senha"
              required
            />
  
            <div class="form-buttons">
              <button type="submit">Login</button>
              <button type="button" @click="goToRegister">Cadastro</button>
            </div>
          </form>
        </div>
      </div>
  
      <!-- Coluna 2 -->
      <div class="right-column">
        <h1>Faz uma graça do lado de cá.</h1>
      </div>
    </div>
  </template>
  
  <script>
  
  import axios from "axios";
  
  export default {
    components: {
    },
  
    data() {
      return {
        form: {
          username: "", 
          password: "", 
        },
      };
    },
  
    methods: {
      async login() {
        try {
          const response = await axios.post(
            "https://staging.conexa.app/index.php/api/v2/auth",
            {
              username: this.form.username,
              password: this.form.password,
            }
          );
  
          if (response.status === 200) {
            const data = response.data;
  
            // Salva os dados relevantes no localStorage
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("tokenType", data.tokenType);
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("expiresIn", data.expiresIn);
  
            // Seta o usuário como logado
            localStorage.setItem("isLoggedIn", "true");
  
            window.location.reload();
          }
        } catch (error) {
          alert("Erro ao fazer login. Verifique suas credenciais.");
          console.error(error);
        }
      },
  
  
  
      goToRegister() {
        // Redirecionar para a página de cadastro
      },
    },
  
  
  };
  </script>
  
  <style scoped>
  body {
    font-family: Arial, sans-serif;
    background-color: #c8c8c823;
    margin: 0;
    padding: 0;
  }
  
  .container {
    display: flex;
    height: 100vh;
  }
  
  .left-column,
  .right-column {
    flex: 1; /* Cada coluna ocupa 50% do espaço */
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }
  
  .left-column {
    background-color: #f4f4f4;
  }
  
  .right-column {
    background-color: #ffffff;
    text-align: center;
  }
  
  .form-container {
    background-color: #ffffff;
    border: 1px solid #db7515;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
  }
  
  .login-form {
    width: 100%;
  }
  
  .login-form label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  .login-form input {
    width: 100%;
    padding: 8px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }
  
  .form-buttons {
    display: flex;
    justify-content: space-between;
  }
  
  .form-buttons button {
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .form-buttons button[type="submit"] {
    background-color: #d8781e;
    color: white;
  }
  
  .form-buttons button[type="button"] {
    background-color: #ccc;
    color: black;
  }
  
  .form-buttons button:hover {
    opacity: 0.9;
  }
  </style>
  