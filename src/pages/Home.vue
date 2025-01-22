<template>
  <div class="home">
    <div class="header">
      <h3 class="welcome">Bem-vindo, {{ user }}!</h3>
      <button class="logout-button" @click="logout">
        Logout
        <i class="fa-solid fa-right-from-bracket"style="margin-left: 5px;"></i>
      </button>
    </div>

    <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
      
      <button class="add-item-button" @click="fetchProdutosAPI" style="margin-right: 7px;">
        <i class="fas fa-sync-alt"></i>
      </button>
      <button class="add-item-button" @click="openRegister" style="margin-right: 7px;">
        <i class="fa-solid fa-box-open" style="margin-right: 5px;"></i>
        Abastecer estoque
      </button>
      <button class="add-item-button" @click="">
        <i class="fa-solid fa-cart-shopping" style="margin-right: 5px;"></i>
        Realizar venda
      </button>
      <RegisterCard
        v-if="isRegisterOpen"
        :isVisible="isRegisterOpen"
        :produtos="produtos"
        @close="closeRegister"
        @submit="addItem"
      />
    </div>


    <table class="items-table">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Preço</th>
          <th>Quantidade</th>
          <th>Ativo</th>
          <th>Criado em</th>
          <th>Atualizado em</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in produtos" :key="item.productID">
          <td>{{ item.name }}</td>
          <td>R$ {{ item.price }}</td>
          <td>{{ item.quantidade }}</td>
          <td>{{ item.active }}</td>
          <td>{{ item.createdAt }}</td>
          <td>{{ item.updatedAt }}</td>
          <td class="actions">
            <i class="fas fa-edit edit-icon"></i>
            <i class="fas fa-trash-alt delete-icon"></i>
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>


<script>

import axios from "axios";
import RegisterCard from "../components/RegisterCard.vue";

export default {
  components: {
    RegisterCard,
  },
  data() {
    return {
      isRegisterOpen: false,
      produtos: [],
      user: localStorage.getItem("user") || { name: "Usuário" }
    };
  },

  methods: {
    openRegister() {
      this.isRegisterOpen = true;
    },

    closeRegister() {
      this.isRegisterOpen = false;
    },

    addItem(newItem) {
      axios.post('http://localhost/estoque_conexa_php/index.php?r=ProdutoController/actionAddProduto', newItem)
        .then(response => {
          if (response.data.status === 'success') {
            this.items.push(newItem);
          } else {
            console.error('Erro ao adicionar item:', response.data.message);
          }
        })
        .catch(error => {
          console.error('Erro de comunicação com o backend:', error);
        });
    },

    logout() {
      localStorage.clear();
      window.location.reload();
    },

    async fetchProdutosAPI(){
      try {
        let data = new URLSearchParams();
        data.append('authToken', localStorage.getItem('accessToken'));

        const response = await axios.post('http://localhost/estoque_conexa_php/index.php?r=produto/getproductsapi', data);
        this.produtos = response.data.data;
        console.log(response)
        
      } catch (error) {

        console.error('Erro ao buscar os produtos:', error);
      }
    },

    async fetchProdutosBD(){
      try {
        
        const response = await axios.get('http://localhost/estoque_conexa_php/index.php?r=produto/getproductsbd');
        this.produtos = response.data.data;
        console.log(response)
        
      } catch (error) {

        console.error('Erro ao buscar os produtos:', error);
      }
    }

  },

  mounted() {
    this.fetchProdutosBD();
  },
};
</script>

<style>
.add-item-button {
  background-color: #d8781e; 
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 5px;
}

.add-item-button:hover {
  opacity: 0.9;
}

.items-table th,
.items-table td {
  border: 1px solid #ddd;
  padding: 6px 8px;
  font-weight: normal;
}

.items-table th {
  background-color: #d8781e;
  color: white;
}

.items-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.items-table tr:hover {
  background-color: #f1f1f1;
}

.actions {
  display: flex;
  justify-content: space-around; 
}

.actions i {
  font-size: 18px; /* Tamanho dos ícones */
  cursor: pointer;
}

.edit-icon {
  color: #007bff; 
  margin-right: 10px;
}

.edit-icon:hover {
  color: #0056b3; 
}

.delete-icon {
  color: #dc3545; 
}

.delete-icon:hover {
  color: #c82333; 
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between; 
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
}

.home {
  padding: 20px;
}

.welcome {
  font-size: 1.2em;
  color: #333;
}

.logout-button {
  padding: 10px 20px;
  background-color: #d8781e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
}

.logout-button:hover {
  opacity: 0.9;
}

.items-table {
  width: 100%;
  margin-top: 5px;
  border-collapse: collapse;
  text-align: left;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
}

.items-table th,
.items-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.items-table th {
  background-color: #d8781e;
  color: white;
}

.items-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.items-table tr:hover {
  background-color: #f1f1f1;
}

.items-table th,
.items-table td {
  border: 1px solid #ddd;
  padding: 6px 8px;  
  font-weight: normal; 
}

.items-table th {
  background-color: #d8781e;
  color: white;
}

.items-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.items-table tr:hover {
  background-color: #f1f1f1;
}
</style>
