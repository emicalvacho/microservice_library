<template>
  <v-app>

    <v-navigation-drawer app v-model="drawer" dark temporary> <!-- para que quede flotando -->
      <v-list dense>
        <v-list-item>
          <v-list-item-icon>
            <v-list-item-avatar>FOTO</v-list-item-avatar>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Juan Pereyra</v-list-item-title>
            <v-list-item-subtitle>Socio</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

        <v-divider></v-divider>

      <v-list dense>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>C</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Listar prestamos</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-icon>
            <v-icon>C</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Listar libros</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

    </v-navigation-drawer>

    <div>
      <v-toolbar dark src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg">
        <v-app-bar-nav-icon @click="hideSidebar"></v-app-bar-nav-icon>

        <v-toolbar-title>Library</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon>
          <v-icon>mdi-export</v-icon>
        </v-btn>
      </v-toolbar>
    </div>

    <!-- <h2>{{ this.loans }}</h2> -->

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
  
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  export default{
    data() {
      return {
        drawer: false
      }
    },
    methods: {
      hideSidebar(){
        this.drawer = true
      },
      ...mapActions(['getPartners', 'getBooks', 'getLoans']),
    },
    computed: { // computed: se ejecutan cada vez que cambie alguna de sus dependencias
      ...mapState(['books', 'partners', 'loans'])
    },
    created() {
      this.getPartners(),
      this.getBooks();
      this.getLoans();
    }
  }
</script>

<style>

</style>
