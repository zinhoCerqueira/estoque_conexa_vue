<template>
  <div>
    <component :is="currentPage"></component>
  </div>
</template>

<script>
import LoginPage from "./pages/LoginPage.vue";
import HomePage from "./pages/Home.vue";
import SalesPage from "./pages/SalesPage.vue";

export default {
  data() {
    return {
      isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
    };
  },
  computed: {
    currentPage() {
      if (this.isLoggedIn) {
        return localStorage.getItem('currentPage')
      } else {
        return "LoginPage";
      }
    },
  },

  methods:{
  },

  components: {
    LoginPage,
    HomePage,
    SalesPage
  },
};
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}
</style>
