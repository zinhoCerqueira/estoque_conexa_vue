<template>
    <div v-if="isCartVisible" class="modal-overlay">
      <div class="modal-card">
        <div class="register-header">
          <h2>Carrinho Atual</h2>
          <button class="close-button" @click="closeModal">X</button>
        </div>
  
        <!-- Tabela do Carrinho Atual -->
        <table class="items-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Produto</th>
              <th>Preço</th>
              <th>Quantidade</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(produto, index) in carrinhoAtual" :key="produto.id">
              <td>{{ index + 1 }}</td>
              <td>{{ produto.name }}</td>
              <td>{{ produto.price }}</td>
              <td>{{ produto.quantidade }}</td>
              <td>{{ produto.price * produto.quantidade }}</td>
            </tr>
          </tbody>
        </table>
  
        <div class="line-division"></div>
  
        <!-- Campo de Busca -->
        <div>
          <h2>Busca</h2>
          <input
            type="text"
            v-model="termoBusca"
            @input="buscarProduto"
            placeholder="Digite para buscar produtos..."
            class="search-input"
          />
        </div>
  
        <div class="line-division"></div>
  
        <!-- Tabela de Estoque Atual -->
        <div>
          <h2>Estoque Atual</h2>
          <div class="table-container">
            <table class="items-table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Quantidade</th>
                  <th>Preço</th>
                  <th>Ações</th>
                </tr>
              </thead>
            </table>
            <div class="table-body-container">
              <table class="items-table">
                <tbody>
                  <tr v-for="produto in produtosFiltrados" :key="produto.id">
                    <td>{{ produto.name }}</td>
                    <td>{{ produto.quantidade }}</td>
                    <td>{{ produto.price }}</td>
                    <td>
                      <div style="display: flex; align-items: center; justify-content: center;">
                        <button
                          class="btn-remover"
                          @click="adicionarAoCarrinho(produto, -1)"
                        >
                          -
                        </button>
                        <button
                          class="btn-adicionar"
                          @click="adicionarAoCarrinho(produto, 1)"
                        >
                          +
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "SaleCard",
    props: {
      isCartVisible: {
        type: Boolean,
        required: true,
      },
      produtos: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        termoBusca: "",
        produtosFiltrados: this.produtos, // Inicialmente exibe todos os produtos
        carrinhoAtual: [],
      };
    },
    watch: {
      isCartVisible(newVal) {
        if (!newVal) {
          this.carrinhoAtual = [];
        }
      },
    },
    methods: {
      buscarProduto() {
        if (this.termoBusca.length >= 3) {
          const termo = this.termoBusca.toLowerCase();
          this.produtosFiltrados = this.produtos.filter((produto) =>
            produto.name.toLowerCase().includes(termo)
          );
        } else {
          this.produtosFiltrados = this.produtos; // Redefine a lista para o estoque completo
        }
      },
      adicionarAoCarrinho(produto, quantidade) {
        const produtoNoCarrinho = this.carrinhoAtual.find(
          (item) => item.id === produto.id
        );
  
        // Atualizar estoque
        const produtoNoEstoque = this.produtos.find(
          (item) => item.id === produto.id
        );
        if (produtoNoEstoque && produtoNoEstoque.quantidade >= quantidade) {
          produtoNoEstoque.quantidade -= quantidade;
        } else {
          return; // Não permitir adicionar se não houver estoque suficiente
        }
  
        // Atualizar carrinho
        if (produtoNoCarrinho) {
          produtoNoCarrinho.quantidade += quantidade;
          if (produtoNoCarrinho.quantidade <= 0) {
            this.carrinhoAtual = this.carrinhoAtual.filter(
              (item) => item.id !== produto.id
            );
          }
        } else {
          this.carrinhoAtual.push({ ...produto, quantidade });
        }
      },
      closeModal() {
        this.$emit("close");
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
  }
  
  .table-container {
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .table-body-container {
    max-height: 420px;
    overflow-y: auto;
  }
  
  .btn-remover {
    background-color: transparent;
    border: 1px solid lightcoral;
    color: lightcoral;
    padding: 5px 12px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 18px;
    margin-right: 3px;
  }
  
  .btn-adicionar {
    background-color: transparent;
    border: 1px solid lightblue;
    color: lightblue;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 18px;
    margin-left: 3px;
  }
  
  .line-division {
    border-bottom: 1px solid #d8781e;
    margin: 20px 0;
  }
  
  .items-table {
    width: 100%;
    margin-top: 5px;
    border-collapse: collapse;
    text-align: left;
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
    table-layout: fixed;
  }
  
  .items-table th,
  .items-table td {
    border: 1px solid #ddd;
    padding: 10px 12px;
    font-weight: normal;
    text-align: left;
    word-wrap: break-word;
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
    width: 800px;
    height: 800px;
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
  </style>
  