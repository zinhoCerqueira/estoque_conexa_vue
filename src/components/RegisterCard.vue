<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-card">
      <div class="register-header">
        <h2>Selecione um item</h2>
        <button class="close-button" @click="closeModal">X</button>
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="itemSelect">Produto</label>
          <select
            id="itemSelect"
            v-model="selectedProductId"
            required
            class="search-input"
          >
            <option value="" disabled selected>Selecione um produto</option>
            <option
              v-for="produto in produtos"
              :key="produto.productID"
              :value="produto.productID"
            >
              {{ produto.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="itemQuantidade">Quantidade</label>
          <input
            id="itemQuantidade"
            type="text"
            v-model="itemQuantidade"
            placeholder="Digite a quantidade de entrada"
            required
          />
        </div>
        <div class="form-group">
          <label for="itemNovoPreco">Novo Preço</label>
          <input
            id="itemNovoPreco"
            type="text"
            v-model="itemNovoPreco"
            placeholder="Caso não mude, deixe em branco"
          />
        </div>
        <button type="submit" class="submit-button">Cadastrar</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    produtos: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      selectedProductId: "",
      itemQuantidade: "",
      itemNovoPreco:""
    };
  },

  methods: {

    closeModal() {
      this.$emit("close");
    },
    async handleSubmit() {
      const selectedProduct = this.produtos.find(
        (produto) => produto.productID === this.selectedProductId
      );

      if (!selectedProduct) {
        alert("Produto não encontrado.");
        return;
      }

      const produto = new URLSearchParams();
      produto.append("productID", selectedProduct.productID);
      produto.append("quantidade", this.itemQuantidade);

      if (this.itemNovoPreco) {
        produto.append("novoPreco", this.itemNovoPreco);
      }

      try {
        const response = await axios.post(
          "http://localhost/estoque_conexa_php/index.php?r=produto/updateProduto",
          produto,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        console.log(response)
        // Verifica a resposta
        if (response.status === 200) {
          alert("Produto atualizado com sucesso!");
          window.location.reload();
        } else {
          alert("Erro ao atualizar o produto: " + response.data.message);
        }
      } catch (error) {
        console.error("Erro ao enviar os dados:", error);
        alert("Erro na requisição. Verifique os logs.");
      }

      // Limpa os campos e fecha o modal
      this.selectedProductId = "";
      this.itemQuantidade = "";
      this.itemNovoPreco = "";
      this.closeModal();
    },
  },
};
</script>

<style scoped>
.search-input {
    padding: 10px;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 10px;
    box-sizing: border-box;
  }

  .register-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal-card {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    width: 400px;
    position: relative;
  }
  
  .close-button {
    border: none;
    background-color: rgb(201, 19, 19);
    color: white;
    font-size: 16px;
    cursor: pointer;
    border-radius: 8px;
    width: 35px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  .close-button:hover {
      background-color: darkred;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box; /* Inclui padding e bordas no tamanho total */
  }

  
  .submit-button {
    background-color: #d8781e;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .submit-button:hover {
    background-color: #bd6514;
  }
</style>
