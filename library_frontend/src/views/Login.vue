<template>
    <v-containter>
        <v-layout wrap ma-5 justify-center align-center style="height: 90%">
            <v-flex xs8 md6>
                <v-card elevation="12">

                    <v-toolbar color="blue darken-1 white--text">
                        <v-spacer></v-spacer>
                        <v-toolbar-title>
                            Login
                        </v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                    
                    <v-card-text>
                        <v-text-field v-model="username" label="Username" color="blue darken-1"/>
                        <v-text-field v-model="password" type="password" label="Password" color="blue darken-1"/>
                    </v-card-text>

                    <v-card-actions>
                        
                        <p class="ma-1">No account?<v-btn color="blue" class="subheading mx-3 white--text" to="/signup">Create account</v-btn></p>
                        <v-spacer></v-spacer>
                        <v-btn @click="auth" class="pl-10 pr-10" outlined large color="blue darken-1 white--text">Sign in</v-btn>
                    </v-card-actions>

                </v-card>

            </v-flex>
        </v-layout>
    </v-containter>

</template>

<script>

export default {
    data(){
        return{
            username: '',
            password: '',
            myColor: 'white',
            borderActive: 'none',
            msgError: false
        }
    },
    methods: {
        auth(){
            //e.preventDefault();
            this.$axios.post('http://localhost:8080/login', {
                username: this.username,
                password: this.password
            })
            .then(data => {
                console.log(data);
                this.$router.push('home');
                }
            )
            .catch(() => {
                this.msgError = true;

                console.log("Incorrect credentials");
            })
        },

    }
}
</script>

<style>
</style>