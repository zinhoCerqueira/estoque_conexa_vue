<template>
  <div class="home">
    
    <div class="header" >
      <h3 class="welcome">Bem-vindo, {{ user.name }}!</h3>
      <button class="logout-button" @click="logout">Logout</button>      
    </div>

    <button class="add-item-button" @click="addItem">Adicionar Novo Item</button>

    <table class="items-table">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Preço</th>
          <th>Quantidade</th>
          <th>Ações</th> 
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.name">
          <td>{{ item.name }}</td>
          <td>R$ {{ item.price.toFixed(2) }}</td>
          <td>{{ item.quantity }}</td>
          <td class="actions">
            <i class="fas fa-edit edit-icon" @click="editItem(item)"></i> 
            <i class="fas fa-trash-alt delete-icon" @click="deleteItem(item)"></i> 
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")) || { name: "Usuário" },
      items: [
        { name: "Água", price: 2.50, quantity: 10 },
        { name: "Refrigerante", price: 5.00, quantity: 8 },
        { name: "Cerveja", price: 7.50, quantity: 4 },
        { name: "Suco", price: 6.00, quantity: 12 },
        { name: "Água de Coco", price: 8.00, quantity: 6 }
      ]
    };
  },
  methods: {
    logout() {
      localStorage.clear();
      window.location.reload();
    },
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
  margin-bottom: 20px;
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
  margin-top: 50px;
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
