<template>
  <div>
    <component :is="currentPage"></component>
  </div>
</template>

<script>
import LoginPage from "./pages/LoginPage.vue";
import HomePage from "./pages/Home.vue";

export default {
  data() {
    return {
      // isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
      isLoggedIn: false,
    };
  },
  computed: {
    currentPage() {
      return this.isLoggedIn ? "HomePage" : "LoginPage";
    },
  },
  components: {
    LoginPage,
    HomePage,
  },
};
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}
</style>
