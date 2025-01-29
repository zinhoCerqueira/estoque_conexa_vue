<template>
    <div v-if="isVisible" class="modal-overlay">
      <div class="modal-card">
        <div class="modal-header">
          <h2>Confirmar Inativação</h2>
          <button class="close-button" @click="closeModal">X</button>
        </div>
        <p>Tem certeza que deseja inativar o item "{{ item.name }}"?</p>
        <div class="modal-actions">
          <button class="confirm-button" @click="confirmInactivation">Sim</button>
          <button class="cancel-button" @click="closeModal">Cancelar</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      isVisible: {
        type: Boolean,
        required: true
      },
      item: {
        type: Object,
        required: true
      }
    },
    methods: {
      closeModal() {
        this.$emit("close");
      },
      confirmInactivation() {
        this.$emit("confirm", this.item);
        this.closeModal();
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
    width: 400px;
    text-align: center;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .close-button {
    border: none;
    background-color: red;
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
  
  .modal-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  
  .confirm-button {
    background-color: #d8781e;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .confirm-button:hover {
    background-color: #bd6514;
  }
  
  .cancel-button {
    background-color: #ccc;
    color: black;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .cancel-button:hover {
    background-color: #999;
  }
  </style>
  