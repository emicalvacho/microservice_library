<template>
    <v-containter>
        <v-layout wrap ma-5 justify-center align-center>
            <v-flex xs8 md6>
                <v-card elevation="12">

                    <v-toolbar color="blue darken-1 white--text">
                        <v-spacer></v-spacer>
                        <v-toolbar-title>
                            Sign Up
                        </v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                    
                    <v-form ref="form">
                        <v-card-text>
                            <v-text-field class="mt-1 pt-4" label="Name" color="blue darken-1" :rules="emptyField"/>
                            <v-text-field class="mt-1 pt-4" label="Username" color="blue darken-1" :rules="emptyField"/>
                            <v-text-field class="mt-1 pt-4" type="password" label="Password" color="blue darken-1" :rules="emptyField"/>
                            <v-text-field class="mt-1 pt-4" type="password" label="Confirm password" color="blue darken-1" :rules="emptyField"/>
                            <v-select class="mt-1 pt-4" color="blue darken-1" :items="items" label="Rol" dense :rules="emptyField"></v-select>
                        </v-card-text>
                    </v-form>
                    

                    <v-card-actions>
                        <p class="ma-1"><v-btn color="blue" class="subheading mx-3 white--text" to="/login">Login</v-btn></p>
                        <v-spacer></v-spacer>
                        <v-btn @click="sendUser" class="pl-10 pr-10 mr-2" outlined large color="blue darken-1 white--text">Create account</v-btn>
                    </v-card-actions>

                </v-card>

            </v-flex>
        </v-layout>
    </v-containter>
  
</template>

<script>
    //import axios from 'axios';

    export default {
        data() {
            return{
                items: ["Bibliotecario", "Socio"],
                name: '',
                username: '',
                password: '',
                rol: '',
                output: '',
                emptyField: [
                    v => !!v || 'You must complete the field'
                ]
            };
        },
        methods: {
            sendUser() {
                if(this.$refs.form.validate()){
                    
                    this.$axios.post('http://localhost:8080/usuarios' , {
                        name: this.name,
                        username: this.username,
                        password: this.password,
                        rol: this.rol
                        
                    })
                    .then ( () => {
                                console.log("Hola desde send user");
                                //data => (this.output = data.data)
                                this.$router.push('/login');
                            }
                            
                            )
                    .catch(e => {
                        console.log(e)
                    })
                }
                
            }
        }
    }

</script>

<style>
</style>
