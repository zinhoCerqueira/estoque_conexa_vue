<template>
    <div v-if="isVisible" class="modal-overlay">
      <div class="modal-card">
        <div class="header">
          <h2>Detalhes do Item</h2>
          <button class="close-button" @click="closeModal">X</button>
        </div>
        <div class="content">
          <p><strong>Nome:</strong> {{ item.name }}</p>
          <p v-if="item.is_new === 1" class="new-label">Novo</p>
          <p><strong>Preço:</strong> {{ formatCurrency(item.price) }}</p>
          <p><strong>Quantidade:</strong> {{ item.quantidade }}</p>
          <p>
            <strong>Ativo:</strong>
            <span :class="item.active ? 'status-label-active' : 'status-label-inactive'">
              {{ item.active ? 'Sim' : 'Não' }}
            </span>
          </p>
          <p><strong>Criado em:</strong> {{ formatarData(item.createdAt) }}</p>
          <p><strong>Última atualização:</strong> {{ formatarData(item.updatedAt) }}</p>
          <p><strong>Descrição:</strong> {{ item.description }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      item: {
        type: Object,
        required: true,
      },
      isVisible: {
        type: Boolean,
        required: true,
      }
    },
    methods: {
      closeModal() {
        this.$emit('update:isVisible', false);
      },
      formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(value);
      },
      formatarData(date) {
        return new Date(date).toLocaleDateString('pt-BR');
      }
    }
  };
  </script>
  
  <style scoped>
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
    width: 300px;
    position: relative;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
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
  
  .new-label {
    color: green;
    font-weight: bold;
  }
  
  .status-label-active {
    color: green;
  }
  
  .status-label-inactive {
    color: red;
  }
  </style>
  