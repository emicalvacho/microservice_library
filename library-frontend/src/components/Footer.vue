<template>
  <v-footer dark padless class="footer">
    <v-card flat tile class="info white--text">
      <v-card-text>
        <nav class="nav redes-sociales">
          <a href="https://www.facebook.com/" target="_blank">
            <i class="fab fa-facebook-f"></i>
          </a>
          <a href="https://twitter.com/" target="_blank">
            <i class="fab fa-twitter"></i>
          </a>
          <a href="https://ar.pinterest.com/" target="_blank">
            <i class="fab fa-pinterest-p"></i>
          </a>
          <a href="https://www.youtube.com/" target="_blank">
            <i class="fab fa-youtube"></i>
          </a>
          <a href="https://www.instagram.com/" target="_blank">
            <i class="fab fa-instagram"></i>
          </a>
        </nav>
      </v-card-text>

      <v-card-text
        class="white--text pt-0 text-center"
      >La biblioteca de Juan Pereyra es reconocida por su amplio catálogo a nivel internacional, usted podrá pedir prestado libros de ediciones exclusivas y disfrutarlos en el transcurso de 30 días. No se olvide de devolverlos o sino no podrá disfrutar más nuestro servicio. Solamente debe crear una cuenta de usario e ingresar. Que disfrute de una buena lectura!!!</v-card-text>

      <v-divider></v-divider>

      <v-card-text class="white--text text-center">
        <p class="white--text">
          <strong>Juan Pereyra's Library</strong> | By Rodriguez & Calvacho | Todos los derechos reservados &copy; 2020
        </p>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    icons: [
      { name: "fab fa-facebook", url: "https://www.facebook.com/" },
      { name: "fab fa-twitter", url: "https://www.twitter.com/" },
      { name: "fab fa-pinterest", url: "https://www.pinterest.com/" },
      { name: "fab fa-linkedin", url: "https://www.linkedin.com/" },
      { name: "fab fa-instagram", url: "https://www.instagram.com/" }
    ]
  })
};
</script>

<style scoped>
.footer {
  margin-top: 30px;
}
nav.redes-sociales {
  text-align: center !important;
}
nav.redes-sociales a {
  color: #ffffff;
  font-size: 2em;
  margin-right: 20px;
}
nav.redes-sociales a:hover {
  color: #326fc4;
}
nav.redes-sociales a:last-child {
  margin-right: 0;
}
</style>