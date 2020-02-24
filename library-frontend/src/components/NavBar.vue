<template>
  <v-toolbar dark color="info">
    <v-toolbar-title>Library</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn @click="logout" icon>
      <v-icon>mdi-export</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$axios
        .post("http://localhost:8080/logout", {})
        .then(data => {
          console.log(data);
          this.$router.push("/");
        })
        .catch(() => {
          console.log("Error logout");
        });
    }
  }
};
</script>