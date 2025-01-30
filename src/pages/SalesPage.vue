<template>
    <div>
        <div>
            <Header></Header>
        </div>

        
        <div class="home">
            <div style="display: flex; justify-content: space-between;">
                <p class="title-page">Lista de Compras</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <button class="back-button" @click="backToHome()">
                        <i class="fa-solid fa-angles-left" style="margin-right: 5px;"></i>
                        Voltar
                    </button>                
                </div>
            </div>

            <div v-if="loading" class="loading-container">
              <div class="spinner"></div>
              <p>Carregando a lista de pedidos...</p>
            </div>

            <div v-else>
                <table class="items-table">
                    <thead>
                        <tr>
                        <th>ID</th>
                        <th>ClienteID</th>
                        <th style="text-align: center;">PessoaID</th>
                        <th style="text-align: center;">Valor Final</th>
                        <th>Data e Hora</th>
                        
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in pedidos" :key="item.pedidoID">
                        <td>{{ item.pedidoID }}</td>
                        <td>{{ item.nameCustomer}} ({{ item.customerId }})</td>
                        <td>{{ item.nameRequester }} ({{ item.requesterId }})</td>
                        <td>{{ formatCurrency(item.totalPrice) }}</td>
                        <td>{{ formatarData(item.createdAt) }}</td>
                        
                        </tr>
                    </tbody>
                    </table>
            </div>    
        </div>
    </div>

    
</template>

<script>
import axios from 'axios';
import Header from '../components/Header.vue';

export default{
    components:{
        Header
    },
    data(){
        return{
            pedidos:[],
            loading: false,
        }
    },
    methods:{
      backToHome(){
          localStorage.setItem("currentPage", "HomePage")
          window.location.reload();
      },

      async fetchPedidosBD(){
        this.loading = true;
        try {      
            let data = new URLSearchParams();
            data.append("authToken", localStorage.getItem("accessToken"));      
            const response = await axios.post('http://localhost/estoque_conexa_php/index.php?r=pedido/getPedidosBD', data);
            this.pedidos = response.data.data;  
            console.log(this.pedidos);
        } catch (error) {
            console.error('Erro ao buscar os produtos:', error);
        }
        finally {
          this.loading = false;
        }
      },

      logout() {
          localStorage.clear();
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

      formatCurrency(value) {
        if (!value) return "R$ 0,00"; 
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(value);
      },

    },
    mounted() {
        this.fetchPedidosBD();
    },
}


</script>


<style scoped>

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

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
}

.back-button{
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


.title-page {
    font-size: 1.4rem; 
    font-weight: 600; 
    color: #333;
    margin: 10px 0;
    font-family: 'Montserrat', Arial, sans-serif;
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

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between; 
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

</style>