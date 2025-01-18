import Vue from 'vue';
import App from './App.vue'; // Importa o componente raiz

new Vue({
  render: (h) => h(App), // Renderiza o componente raiz
}).$mount('#app'); // Monta a aplicação no elemento com id "app"
