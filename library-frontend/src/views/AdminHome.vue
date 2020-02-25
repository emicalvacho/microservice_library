<template>
  <div>
    <v-app>
      <v-container grid-list-md>
        <NavBar></NavBar>
        <TabNav></TabNav>
        <v-spacer></v-spacer>
        <v-card height="500" color="#42a5f5">
          <v-card-text style="height: 80%" class="box">
            <v-hover v-slot:default="{ hover }">
              <v-img height="460" :aspect-ratio="16/9" src="../assets/images/image-home_admin.jpg">
                <v-expand-transition>
                  <div
                    v-if="hover"
                    class="d-flex transition-fast-in-fast-out blue darken-2 v-card--reveal display-3 white--text"
                    style="height: 100%;"
                  >
                    <p style="padding: 50px 50px; text-align: center;">
                      <strong>En esta plataforma podrás administrar y ver las movimientos de la biblioteca</strong>
                    </p>
                  </div>
                </v-expand-transition>
              </v-img>
            </v-hover>
          </v-card-text>
        </v-card>
      </v-container>
    </v-app>
  </div>
</template>

<script>
// import { mapState, mapActions} from 'vuex'

export default {
  data() {
    return {
      headersPartner: [
        { text: "Name", value: "nombre" },
        { text: "Username", value: "username" }
      ],
      searchPartner: "",
      messageResponse: "",
      snackbar: false,
      timeout: 2000
    };
  },
  computed: {},
  methods: {},
  created() {}
};
</script>

<style scope>
.lightbox {
  box-shadow: 0 0 20px inset rgba(0, 0, 0, 0.2);
  background-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.4) 0%,
    transparent 72px
  );
}
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.8;
  position: absolute;
  width: 100%;
}
</style>