<template>
  <div>
    <div>
      <Header></Header>
    </div>

    <div class="home">
      <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; width: 100%; margin-top: 25px;">
      <div>
        <p class="welcome">Bem-vindo, {{ user }}!</p>
      </div>

      <div>
        <div style="display: flex; justify-content: flex-end;">    
      
          <button class="add-item-button" @click="changeSalePage" style="margin-right: 7px;">
            <i class="fa-solid fa-money-check-dollar" style="margin-right: 5px;"></i> Histórico
          </button>
      
          <button class="add-item-button" @click="openRegister" style="margin-right: 7px;">
            <i class="fa-solid fa-box-open" style="margin-right: 5px;"></i>
            Abastecer estoque
          </button>
      
          <button class="add-item-button" @click="showCartCart()">
            <i class="fa-solid fa-cart-shopping" style="margin-right: 5px;"></i>
            Realizar venda
          </button>
          
          <SaleCard 
            v-if="showCart"
            :isCartVisible="showCart" 
            :produtos="produtos" 
            @close="closeCart"
          />
              
          <RegisterCard
            v-if="isRegisterOpen"
            :isVisible="isRegisterOpen"
            :produtos="produtos"
            @close="closeRegister"
            @submit="addItem"
          />

          <InativeItemCard
            :isVisible="showInactivationModal"
            :item="selectedItem"
            @close="showInactivationModal = false"
            @confirm="inactivateItem"
          />
        </div>
      </div>
  </div>

    <table class="items-table">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Preço</th>
          <th style="text-align: center;">Quantidade</th>
          <th style="text-align: center;">Ativo</th>
          <th>Criado em</th>
          <th>Atualizado em</th>
          <th style="text-align: center;">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in produtos" :key="item.productID">
          <td>
            <div class="product-name">
              <span>{{ item.name }}</span>
              <span v-if="item.is_new === 1" class="new-label">Novo</span>
            </div>
          
          </td>
          <td>R$ {{ parseFloat(item.price).toFixed(2) }}</td>
          <td style="text-align: center;" >{{ item.quantidade }}</td>
          <td style="text-align: center;">
            <span :class="item.active ? 'status-label-active' : 'status-label-inactive'">
              {{ item.active ? 'Sim' : 'Não' }}
            </span>
          </td>
          <td>{{ formatarData(item.createdAt) }}</td>
          <td>{{ formatarData(item.updatedAt) }}</td>
          <td >
            <div class="actions">
              <i class="fas fa-edit edit-icon"></i>
              <i 
                class="fas fa-ban inactive-icon" 
                @click="openInactivationModal(item)" 
                title="Desativar item">
              </i>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    </div>




  </div>
</template>


<script>

import axios from "axios";
import RegisterCard from "../components/RegisterCard.vue";
import SaleCard from "../components/SaleCard.vue";
import Header from "../components/Header.vue"
import InativeItemCard from "../components/InativeItemCard.vue";

export default {
  components: {
    RegisterCard,
    SaleCard,
    Header,
    InativeItemCard
  },
  data() {
    return {
      isRegisterOpen: false,
      produtos: [],
      user: localStorage.getItem("user") || { name: "Usuário" },
      showCart: false,
      showInactivationModal: false,
      selectedItem: {},
    };
  },

  methods: {
    async inactivateItem(item) {
      let data = new URLSearchParams();
      data.append('productID', item.productID);
      try {
        const response = await axios.post('http://localhost/estoque_conexa_php/index.php?r=produto/InactiveProduto', data);

        console.log(data)

        if (response.data.success) {
          window.location.reload();
        } else {
          console.log(response)
          alert("Erro ao inativar o produto: " + response.data.message);
        }
      } catch (error) {
        console.error("Erro ao inativar o produto:", error);
      }

      this.showInactivationModal = false;
    },

    openInactivationModal(item) {
      this.selectedItem = item;
      this.showInactivationModal = true;
    },

    changeSalePage(){
      localStorage.setItem('currentPage', 'SalesPage')
      window.location.reload();
    },

    formatarData(data) {
      const dataObj = new Date(data);
      const dia = String(dataObj.getDate()).padStart(2, '0');
      const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
      const ano = dataObj.getFullYear();
      const horas = String(dataObj.getHours()).padStart(2, '0');
      const minutos = String(dataObj.getMinutes()).padStart(2, '0');
      return `${dia}/${mes}/${ano} às ${horas}:${minutos}`;
    },

    showCartCart() {
      this.showCart = true;
    },

    closeCart() {
      this.showCart = false;
    },

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
        console.log(this.produtos)

      } catch (error) {

        console.error('Erro ao buscar os produtos:', error);
      }
    },

    async fetchProdutosBD(){
      try {
        
        const response = await axios.get('http://localhost/estoque_conexa_php/index.php?r=produto/getproductsbd');
        this.produtos = response.data.data;
        
      } catch (error) {

        console.error('Erro ao buscar os produtos:', error);
      }
    }

  },

  mounted() {
    this.fetchProdutosAPI();
  },
};
</script>

<style scoped>

.status-label-active {
  background-color: rgb(51, 189, 51);
  color: white;
  padding: 2px 8px;
  font-size: 12px;
  border-radius: 5px;
  margin-left: 10px;
}

.status-label-inactive{
  background-color: rgb(236, 73, 44);
  color: white;
  padding: 2px 8px;
  font-size: 12px;
  border-radius: 5px;
  margin-left: 10px;
}

.product-name {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.new-label {
  background-color: rgb(51, 189, 51);
  color: white;
  padding: 2px 8px;
  font-size: 12px;
  border-radius: 5px;
  margin-left: 10px;
}

.welcome {
  font-size: 1.4rem; 
  font-weight: 600; 
  color: #333;
  margin: 10px 0;
  font-family: 'Montserrat', Arial, sans-serif;
}

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

.inactive-icon {
  color: gray; /* cor que simboliza inatividade */
  font-size: 18px;
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
