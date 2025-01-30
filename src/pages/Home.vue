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

            <div>
              <input
                type="text"
                v-model="termoBusca"
                @input="buscarProduto"
                placeholder="Busque um item"
                class="search-input"
              />
            </div>

            <SaleCard v-if="showCart" :isCartVisible="showCart" :produtos="produtos" @close="closeCart" />
            <RegisterCard v-if="isRegisterOpen" :isVisible="isRegisterOpen" :produtos="produtos" @close="closeRegister"/>
            <InativeItemCard :isVisible="showInactivationModal" :item="selectedItem" @close="showInactivationModal = false" @confirm="inactivateItem" />
          </div>
        </div>
      </div>

      <!-- Loading Spinner -->
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Carregando produtos...</p>
      </div>

      <!-- Tabela de produtos -->
      <table v-else class="items-table">
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
          <tr v-for="item in produtosFiltrados" :key="item.productID">
            <td>
              <div class="product-name">
                <span>{{ item.name }}</span>
                <span v-if="item.is_new === 1" class="new-label">Novo</span>
              </div>
            </td>
            <td>R$ {{ parseFloat(item.price).toFixed(2) }}</td>
            <td style="text-align: center;">{{ item.quantidade }}</td>
            <td style="text-align: center;">
              <span :class="item.active ? 'status-label-active' : 'status-label-inactive'">
                {{ item.active ? 'Sim' : 'Não' }}
              </span>
            </td>
            <td>{{ formatarData(item.createdAt) }}</td>
            <td>{{ formatarData(item.updatedAt) }}</td>
            <td>
              <div class="actions">
                <i class="fas fa-edit edit-icon"></i>
                <i 
                  v-if="item.active" 
                  class="fas fa-ban inactive-icon" 
                  @click="openInactivationModal(item)" 
                  title="Desativar item">
                </i>
                <i 
                  v-else 
                  class="fas fa-check-circle inactive-icon" 
                  @click="openInactivationModal(item)" 
                  title="Ativar item">
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
import Header from "../components/Header.vue";
import InativeItemCard from "../components/InativeItemCard.vue";

export default {
  components: {
    RegisterCard,
    SaleCard,
    Header,
    InativeItemCard,
  },
  data() {
    return {
      isRegisterOpen: false,
      produtos: [],
      user: localStorage.getItem("user") || "Usuário",
      showCart: false,
      showInactivationModal: false,
      selectedItem: {},
      loading: false,
      produtosFiltrados: [],
      termoBusca: "",
    };
  },

  methods: {

    buscarProduto() {
      if (this.termoBusca.length >= 3) {
        const termo = this.termoBusca.toLowerCase();
        this.produtosFiltrados = this.produtos.filter((produto) =>
          produto.name.toLowerCase().includes(termo)
        );
      } else {
        this.produtosFiltrados = this.produtos;
      }
    },

    async inactivateItem(item) {
      let data = new URLSearchParams();
      data.append("productID", item.productID);
      try {
        const response = await axios.post(
          "http://localhost/estoque_conexa_php/index.php?r=produto/InactiveProduto",
          data
        );
        if (response.status === 200) {
          window.location.reload();
        } else {
          alert("Erro ao inativar o produto: " + response.data.message);
        }
      } catch (error) {
        console.error("Erro ao inativar o produto:", error);
      }
      this.showInactivationModal = false;
    },

    openInactivationModal(item) {
      if (!item.active && item.quantidade === 0) {
        alert("O item não pode ser ativado, pois sua quantidade é 0.");
        return;
      }
      this.selectedItem = item;
      this.showInactivationModal = true;
    },

    changeSalePage() {
      localStorage.setItem("currentPage", "SalesPage");
      window.location.reload();
    },

    formatarData(data) {
      const dataObj = new Date(data);
      return dataObj.toLocaleString("pt-BR");
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

    async fetchProdutosAPI() {
      this.loading = true;
      try {
        let data = new URLSearchParams();
        data.append("authToken", localStorage.getItem("accessToken"));
        const response = await axios.post(
          "http://localhost/estoque_conexa_php/index.php?r=produto/getproductsapi",
          data
        );
        this.produtos = response.data.data;
        this.produtosFiltrados = this.produtos
      } catch (error) {
        console.error("Erro ao buscar os produtos:", error);
      } finally {
        this.loading = false;
      }
    },

  },

  mounted() {
    this.fetchProdutosAPI();
  },
};
</script>

<style scoped>

.search-input {
  background-color: white;
  color: #333; 
  border: 1px solid #f4a261; 
  padding: 10px 20px;
  border-radius: 4px;
  outline: none; 
  cursor: text;
  margin-bottom: 5px;
  font-size: 16px;
  margin-left: 7px;
}

.search-input:focus {
  border-color: #e76f51; /* Cor mais escura da borda ao focar */
}

.status-label-active {
  background-color: rgb(51, 189, 51);
  color: white;
  padding: 2px 8px;
  font-size: 12px;
  border-radius: 5px;
}

.status-label-inactive{
  background-color: rgb(236, 73, 44);
  color: white;
  padding: 2px 8px;
  font-size: 12px;
  border-radius: 5px;
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

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #ccc;
  border-top: 5px solid #d8781e;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>
