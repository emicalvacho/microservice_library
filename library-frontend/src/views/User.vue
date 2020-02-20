<template>

    <v-container style="height: 100%" grid-list-md>
        
     <v-data-table :headers="headers" :items="loans" class="elevation-1">
        <template v-slot:top>
        <v-toolbar flat color="white">
            <v-toolbar-title>Loans</v-toolbar-title>

            <v-divider class="mx-4" inset vertical></v-divider>

            <v-spacer></v-spacer>

            <v-dialog v-model="dialog" persistent max-width="500px">
            <template v-slot:activator="{ on }">
                <v-btn color="blue darken-1" dark class="mb-2" v-on="on">New Loan</v-btn>
            </template>

            <v-card>
                <v-card-title>
                <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12" sm="6" md="4">
                            <v-autocomplete v-model="selectedBook" class="mt-1 pt-4" color="blue darken-1" :items="booksLocal" label="Book" dense item-text="titulo" return-object></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-autocomplete v-model="selectedPartner" class="mt-1 pt-4" color="blue darken-1" :items="partnersLocal" label="Partner" dense item-text="nombre" return-object></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field v-if="editedIndex == -1" v-model="days" label="Days" type="number" color="blue darken-1"/>
                            <v-menu v-if="editedIndex >= 0" ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="date" transition="scale-transition" offset-y min-width="290px">
                                <template v-slot:activator="{ on }">
                                    <v-text-field v-model="date" label="Due date" hint="YYYY/MM/DD format" prepend-icon="" readonly v-on="on"></v-text-field>
                                </template>
                                <v-date-picker v-model="date" no-title scrollable>
                                    <v-spacer></v-spacer>
                                    <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                                    <v-btn text color="primary" @click="$refs.menu.save(date)">OK</v-btn>
                                </v-date-picker>
                            </v-menu>
                            <!-- <v-text-field v-model="editedItem.fecha_vto" label="Due date"></v-text-field> -->
                        </v-col>
                    </v-row>
                </v-container>
                </v-card-text>

                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                </v-card-actions>
            </v-card>
            </v-dialog>
        </v-toolbar>
        </template>
        <template v-slot:item.action="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">fas fa-edit</v-icon>
            <v-icon small @click="deleteItem(item)">fas fa-trash</v-icon>
        </template>
    </v-data-table>

    </v-container>
</template>

<script>
import { mapState, mapActions} from 'vuex'
export default{
    // el id del prestamo lo obtengo del datatable
    data(){
        return {
            date: new Date().toISOString().substr(0, 10),
            menu: false,
            dialog: false,
            headers: [{text: "Book", value:"titulo"},
                       {text: "Partner", value:"nombre"},
                       {text: "Due Date", value:"fecha_vto"},
                       {text: "Actions", value:"action"}],
            partnersLocal: [],
            booksLocal: [],
            loansLocal: [],
            selectedPartner: [],
            selectedBook: [],
            days: 0,

            editedIndex: -1,
            editedItem: {
                id_prestamo: '',
                id_libro: '',
                titulo: '',
                id_socio: '',
                nombre: '',
                fecha_vto: ''
            },
        }
    },
    computed: {
        ...mapState(['partners', 'books', 'loans']),
        formTitle () {
        return this.editedIndex === -1 ? 'New Loan' : 'Edit Loan'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },


    methods: {
        loadEditedItem(){
            this.editedItem.id_prestamo = this.selectedBook.id_prestamo;
            this.editedItem.id_libro = this.selectedBook.id_libro;
            this.editedItem.id_socio = this.selectedBook.id_socio;
            this.editedItem.titulo = this.selectedBook.titulo;
            this.editedItem.nombre = this.selectedBook.nombre;
            this.editedItem.fecha_vto = this.selectedBook.fecha_vto;
        },
        ...mapActions(['getBooks', 'getPartners', 'getLoans']),
        addLoan(){
            this.$axios.post('http://localhost:8080/prestamos' , {
                        idLibro: this.selectedBook.id_libro,
                        idSocio: this.selectedPartner.id_socio,
                        cantidadDias: this.days
                    })
                    .then ( () => {
                                console.log("PRESTAMO ENVIADO");
                                this.getLoans();
                            })
                    .catch(e => {
                        console.log(e)
                    })
        },
      editItem (item) {
        this.editedIndex = this.loansLocal.indexOf(item)
        this.editedItem.id_prestamo = item.id_prestamo;
        this.selectedBook = item;
        this.selectedPartner = item;
        this.date = (item.fecha_vto).replace(/\//g, '-');
        this.dialog = true
      },

      deleteItem (item) {
          console.log(item.id_prestamo);
          const index = this.loansLocal.indexOf(item);
          confirm('Are you sure you want to delete this item?') && this.loansLocal.splice(index, 1);
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.selectedPartner = [];
          this.selectedBook = [];
          this.editedIndex = -1;
        }, 300)
      },

      save () {
        if (this.editedIndex > -1) {
          this.editedItem.titulo = this.selectedBook.titulo;
          this.editedItem.id_libro = this.selectedBook.id_libro;
          this.editedItem.id_socio = this.selectedPartner.id_socio;
          this.editedItem.nombre = this.selectedPartner.nombre;
          this.editedItem.fecha_vto = (this.date).replace(/-/g, '/');
          Object.assign(this.loansLocal[this.editedIndex], this.editedItem)
        } else {
            //this.loansLocal.push(this.editedItem);
            this.addLoan();
        }
        this.close()
      },
    },
    created() {
        this.partnersLocal = this.partners;
        this.booksLocal = this.books;
        this.loansLocal = this.loans;
    }
}

</script>