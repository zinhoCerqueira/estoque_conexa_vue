<template>
    <div v-if="isVisible" class="modal-overlay">
        <div class="modal-card">
            <div class="register-header">
                <h2>Cadastre um novo item</h2>
                <button class="close-button" @click="closeModal">X</button> 
            </div>
            <form @submit.prevent="handleSubmit">
                <div class="form-group">
                    <label for="itemName">Nome</label>
                    <input
                    id="itemName"
                    type="text"
                    v-model="itemName"
                    placeholder="Digite o nome do item"
                    required
                    />
                </div><div class="form-group">
                    <label for="itemPreco">Preço</label>
                    <input
                    id="itemPreco"
                    type="text"
                    v-model="itemPreco"
                    placeholder="Digite o preço do item"
                    required
                    />
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
                <button type="submit" class="submit-button">Cadastrar</button>
            </form>
        </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      isVisible: {
        type: Boolean,
        required: true,
      },
    },
    data() {
      return {
        itemName: "",
        itemPreco:"",
        itemQuantidade: "",
      };
    },
    methods: {
      closeModal() {
        this.$emit("close");
      },
      handleSubmit() {
        const newItem = {
          name: this.itemName,
          preco: this.itemPreco,
          quantidade: this.itemQuantidade
        };
        this.$emit("submit", newItem);
        this.itemName = "";
        this.itemDescription = "";
        this.closeModal();
      },
    },
  };
  </script>
  
  <style scoped>
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
  