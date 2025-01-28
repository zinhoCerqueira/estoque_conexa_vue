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
              <td>{{ Number(produto.price).toFixed(2) }}</td>
              <td>{{ produto.quantidade }}</td>
              <td>{{ Number(produto.price * produto.quantidade).toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>

        <div class="total-container">

          <button class="finish-buy-button" @click="enviaPedido()">
            Finalizar Compra
            <i class="fa-solid fa-wallet" style="margin-left: 5px;"></i>
          </button>

          <div class="dual-pill">
            <span class="left">Total a ser pago:</span>
            <span class="right">R$ {{ totalCarrinho }}</span>
          </div>
        </div>
  
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
                  <tr 
                    v-for="produto in produtosFiltrados.filter(p => p.quantidade > 0)" 
                    :key="produto.id"
                  >
                    <td>{{ produto.name }}</td>
                    <td>{{ produto.quantidade }}</td>
                    <td>R$ {{ Number(produto.price).toFixed(2) }}</td>
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

  import axios from "axios";

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
        customerId : 59,
        requesterId : 13
      };
    },
    watch: {
      isCartVisible(newVal) {
        if (!newVal) {
          this.carrinhoAtual = [];
        }
      },
    },
    computed: {
      totalCarrinho() {
        return this.carrinhoAtual.reduce(
          (total, produto) => total + produto.price * produto.quantidade,
          0
        );
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
          this.produtosFiltrados = this.produtos;
        }
      },

      adicionarAoCarrinho(produto, quantidade) {
        const produtoNoCarrinho = this.carrinhoAtual.find(
          (item) => item.productID === produto.productID
        );

        console.log(produto);

        if (!produtoNoCarrinho && quantidade < 0) {
          console.warn("Tentativa de remover um item que não está no carrinho.");
          return; // Impede remoções de itens que não existem no carrinho
        }

        // Atualizar estoque (somente para adição de itens)
        if (quantidade > 0) {
          const produtoNoEstoque = this.produtos.find(
            (item) => item.productID === produto.productID
          );

          if (produtoNoEstoque && produtoNoEstoque.quantidade >= quantidade) {
            produtoNoEstoque.quantidade -= quantidade;
          } else {
            console.warn("Estoque insuficiente para o produto.");
            return; // Não permitir adicionar se não houver estoque suficiente
          }
        }

        // Atualizar carrinho
        if (produtoNoCarrinho) {
          produtoNoCarrinho.quantidade += quantidade;

          // Remover item do carrinho se a quantidade final for <= 0
          if (produtoNoCarrinho.quantidade <= 0) {
            this.carrinhoAtual = this.carrinhoAtual.filter(
              (item) => item.productID !== produto.productID
            );
          }
        } else if (quantidade > 0) {
          // Adicionar novo item ao carrinho apenas se a quantidade for positiva
          this.carrinhoAtual.push({ ...produto, quantidade });
        }

        console.log(this.carrinhoAtual);
      },

      closeModal() {
        this.$emit("close");
      },

      async enviaPedido() {
        // Verificar se o carrinho tem produtos
        if (this.carrinhoAtual.length === 0) {
          console.warn("O carrinho está vazio. Não é possível finalizar a compra.");
          return;
        }

        // Preparar os dados a serem enviados
        const formData = new URLSearchParams();
        formData.append('customerId', this.customerId); // ID do cliente
        formData.append('requesterId', this.requesterId); // ID do solicitante
        formData.append('authToken', localStorage.getItem('accessToken'));

        // Preparar o carrinho no formato correto
        const produtosCarrinho = this.carrinhoAtual.map(produto => ({
          productID: produto.productID,
          quantidade: produto.quantidade,
          price: produto.price
        }));
        
        formData.append('productList', JSON.stringify(produtosCarrinho)); // Lista de produtos no carrinho

        try {
          const response = await axios.post(
            "http://localhost/estoque_conexa_php/index.php?r=pedido/create", // URL do endpoint
            formData,
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded', // Definir o tipo de conteúdo como URL-encoded
              },
            }
          );

          // Verificar resposta
          if (response.data.success) {
            console.log("Compra realizada com sucesso!");
            // Você pode adicionar alguma lógica de sucesso aqui, como redirecionar ou limpar o carrinho
          } else {
            console.error("Erro ao realizar compra:", response);
          }

        } catch (error) {
          console.error("Erro na requisição:", error);
        }
      }
    },
  };
  </script>
  
  <style scoped>
  .finish-buy-button {
    padding: 10px 20px;
    background-color: #d8781e;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 9px;
  }

      .total-container {
      align-items: center;
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
      font-size: 16px;
      font-weight: bold;
    }

    .dual-pill {
      white-space: nowrap;
      display: inline-flex;
      border-radius: 4px;
      overflow: hidden;
      border: 1px solid #d8781e;
      font-size: 14px;
      font-weight: bold;
      text-align: center;
      line-height: 1.5em;
    }

    .dual-pill span {
      display: inline-block;
      padding: 0 15px;
      line-height: 34px;
      text-align: center;
    }

    .dual-pill .left {
      background-color: white;
      color: #d8781e;
      flex: 2; 
    }

    .dual-pill .right {
      background-color: #d8781e;
      color: white;
      flex: 1; 
    }


  .search-input {
    padding: 10px;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 10px;
    box-sizing: border-box;
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
  