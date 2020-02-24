<template>
    <v-container style="height: 100%" grid-list-md>
        <TabNav></TabNav>
        <v-spacer></v-spacer>
        <v-card height="500" color="#42a5f5">
            <v-card-title primary-title class="justify-center black--text pt-5">
                Welcome Admin
            </v-card-title>
            <v-card-text style="height: 80%">
                <v-row style="height: 100%" align-content="center" justify="center">
                    <div class="white--text">
                        En esta plataforma podrás administrar y ver las movimientos de la biblioteca
                    </div>
                </v-row>
            </v-card-text>
        </v-card> 
    </v-container>
</template>

<script>
// import { mapState, mapActions} from 'vuex'

export default{
    data(){
        return {
            headersPartner: [{text: "Name", value: "nombre"},
                             {text: "Username", value: "username"}],
            searchPartner: '',
            messageResponse: '',
            snackbar: false,
            timeout: 2000,
        }
    },
    computed: {
    },
    methods: {
    },
    created() {
    }
}
    
</script>