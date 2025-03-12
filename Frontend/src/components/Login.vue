<template>
  <!-- Display a message to the user while redirecting -->
  <div>
    <h1>Redirecting to login page...</h1>
  </div>
</template>

<script>
export default {
  // Name the component as 'Login'
  name: 'Login',
  mounted() {
    // Automatically redirect the user to the specified login page URL
    window.location.href = "http://127.0.0.1:8080/login";
  }
}
</script>

<style scoped>

</style>