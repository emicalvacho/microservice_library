<template>
    <v-container grid-list-md>
        <v-layout row wrap>
            <v-flex md6 class="mb-5">
                <v-card>
                    <v-toolbar  color="error">
                        Expired books
                    </v-toolbar>
                    <v-card-text>
                        <v-card-title primary-title v-if="noBooks">
                            There are no expired books  
                        </v-card-title>
                        <v-list dense v-for="book in books" :key="book.titulo">
                            <v-list-item v-if="okBooks">
                                <v-list-item-content>
                                    <v-list-item-title>
                                        Title: {{book.titulo}}
                                    </v-list-item-title>
                                </v-list-item-content>
                                
                                <v-list-item-content>
                                    <v-list-item-title>
                                        Expired: {{book.fecha_vto}}
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex md6>
                <v-card>
                    <v-toolbar color="orange">
                        Books that expire soon
                    </v-toolbar>
                    <v-card-text>
                        <v-card-title primary-title v-if="noBooks">
                            There are no books that expire soon
                        </v-card-title>
                        <v-list dense v-for="book in books" :key="book.titulo">
                            <v-list-item v-if="okBooks">
                                <v-list-item-content>
                                    <v-list-item-title>
                                        Title: {{book.titulo}}
                                    </v-list-item-title>
                                </v-list-item-content>
                                
                                <v-list-item-content>
                                    <v-list-item-title>
                                        Expired: {{book.fecha_vto}}
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>

            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex md12>
                <v-card>
                    <v-card-title primary-title>
                        My rented Books
                    </v-card-title>
                    <v-card-text>
                        <v-data-table
                    
                        :headers="headers"
                        :items="books"
                        :items-per-page="5"
                        class="elevation-1"
                    ></v-data-table>
                    </v-card-text>
                    <!-- <v-card-actions>
                            <v-btn @click="getBooks" color="success">text</v-btn>
                    </v-card-actions> -->
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    data(){
        return {
            loans: [],
            books: [],
            loaded: false,
            noBooks: false,
            okBooks: false,
            headers: [
                {text: "Title", value: "titulo"},
                {text: "Due date", value: "fecha_vto"},
                ]
        }
    },
    methods: {
        getLoans(){
            this.$axios.get('http://localhost:8080/prestamos')
            .then(data => {
                this.loaded = true;
                this.loans = data.data;
                console.log(this.loans);
            })
            .catch(() => {
                // this.$router.push('login');
                this.loaded = true;
                console.log("debes registrarte");

            })
        },
        getBooks(){
            this.$axios.get('http://localhost:8080/prestamos/socios/user')
            .then(data => {
                var f = new Date(data.data[0].fecha_vto).toLocaleDateString()
                console.log(data.data)
                data.data[0].fecha_vto = f;
                this.books = data.data;
                console.log(this.books);
                this.okBooks = true;
            })
            .catch(() => {
                // this.$router.push('login');
                this.noBooks = true;
                console.log("No tiene permisos");
            })
        }
    },
    created() {
        this.getLoans();
        this.getBooks();
    }
}
</script>

<style>
</style>

