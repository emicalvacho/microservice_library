var express = require('express');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var util = require('util');
var cors = require("cors");

app.use(bodyParser.urlencoded({ extended: true })); ///////
app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(cors({
    origin: ['http://localhost:8081'],
    methods: ['GET', 'POST'],
    credentials: true // enable set cookie
}));

var con = mysql.createConnection({
    host: "localhost",
    user: "emi",
    password: "emiliano311",
    database: "BIBLIOTECA"
});
con.connect(function (err) {
    if (err) throw err;
    console.log("Database Connected!");
});

const DIAS_MILI_SEG = 1000 * 60 * 60 * 24;

const query = util.promisify(con.query).bind(con);

/////////////////////////////////////
// ## Relacionado con la sesion ## //
/////////////////////////////////////

// LOGIN
app.post('/login', async function (request, response) {
    var username = request.body.username;
    var password = request.body.password;
    console.log(request.body.username);
    console.log(password);
    const queryAuth = 'SELECT * FROM usuarios WHERE username = ? AND pass = ?';
    var results = await query(queryAuth, [username, password]);
    if (username && password) {
        if (results.length > 0) {
            request.session.loggedin = true;
            request.session.id_user = results[0].id;
            request.session.rol = results[0].rol;
            response.status(200);
            response.json("User Logged");
        } else {
            response.status(404);
            response.json("User or Password incorrect");
        }
    } else {
        response.status(400);
        response.json('Please enter Username and Password!');

    }
});

// Registro de usuarios (socios, el admin se carga a mano en la BD)
app.post('/usuarios',async function(req, res){
    if(req.body.nombre == null){
        res.status(400).json("Debe completar el campo nombre");
    }
    else if(req.body.username == null){
        res.status(400).json("Debe completar el campo username");
    }
    else if(req.body.username == "admin"){
        res.status(401).json("Este username esta reservado");
    }
    else if(req.body.password == null){
        res.status(400).json("Debe completar el campo password");
    }
    else if(req.body.rol == null){
        res.status(400).json("Debe completar el campo rol");
    }
    else{
        const queryUser = `select * from usuarios where username = (?)`;
        var queryUsername = await query(queryUser,req.body.username);

        if(queryUsername.length > 0){
            res.status(400).json("Username ya existente!");
        }
        else{
            const queryStr = `insert into usuarios (id,nombre,username,pass,rol) values (?,?,?,?,?)`;   
            var querySocios = await query(queryStr, [getNewID(), req.body.nombre, req.body.username, req.body.password, req.body.rol]);
            res.status(200).json("Socio agregado correctamente");
        }
    }
})

// AUTORIZACION (solo bibliotecario)
var auth = function(req, res, next) {
    if (req.session && req.session.user === "admin" && req.session.admin)
        return next();
    return res.sendStatus(401);
};

//////////////////////////////////////////////////////
// ## Autorizado solo el "admin" (Bibliotecario) ## //
//////////////////////////////////////////////////////

// GET usuarios : listar todos los usuarios cargados
app.get('/usuarios',auth, async function(req,res){
    var queryResult = await query(`select * from usuarios`);
    console.log(queryResult);
    res.status(200).json(queryResult);
})

// POST libro : agregar un nuevo libro a la BD
app.post('/libros',auth, async function(req, res){
    if(req.body.cantidad < 0){
        res.status(400).json("Debe ingresar una cantidad mayor a cero");
    }
    else if(!Number.isInteger(req.body.cantidad)){
        res.status(400).json("Debe ingresar un entero");
    }   
    else if(req.body.cantidad == null){
        res.status(400).json("Debe completar el campo cantidad");
    }
    else if(req.body.titulo == null){
        res.status(400).json("Debe completar el campo titulo");
    }
    else{
        const queryStr = `insert into libros (id_libro, titulo, cantidad) values (?, ?, ?)`;
        var queryLibros = await query(queryStr, [getNewID(), req.body.titulo, req.body.cantidad]);
        res.status(200).json("Libro agregado correctamente");
    }
})

// PUT libro : actualizo la cantidad de ejemplares de un libro
app.put('/libros/:idLibro',auth, async function(req,res){
    const queryExisteLibro = `select * from libros where id_libro = (?)`;
    var queryResultExisteLibro = await query(queryExisteLibro, req.params.idLibro);
    
    if (req.body.cantidad >= 0){
        if (queryResultExisteLibro.length <= 0){
          res.status(404).json("Libro not found");
        } 
        else {
            const queryCantPrestada = `select count(*) as cant_prestada from prestamos where id_libro = (?)`;
            var queryResultCantPrestada = await query(queryCantPrestada, req.params.idLibro);
            if (queryResultCantPrestada[0].cant_prestada > req.body.cantidad){
                res.status(400).json("La cantidad a ingresar debe ser mayor a la cantidad prestada");
            }
            else{
                const queryStr = `update libros set cantidad = (?) where id_libro = (?)`;
                var queryResult = await query(queryStr,[req.body.cantidad,req.params.idLibro]);
                res.status(200).json("La cantidad ha sido actualizada correctamente");
            }
        } 
    }
    else{
      res.status(400).json("Se espera un entero mayor a 0");
    }
})

// DELETE libro : elimino un libro de la BD
app.delete('/libros/:idLibro',auth, async function(req, res){
    const queryLibros = `select * from libros where id_libro = (?)`;
    var queryResultLibros = await query(queryLibros, req.params.idLibro);

    console.log(queryResultLibros);

    if(queryResultLibros.length <= 0){
        res.status(404).json("Libro no encontrado");
    }
    else{
        const queryPrestamos = `select * from prestamos where id_libro = (?)`;
        var queryResultPrestamos= await query(queryPrestamos, req.params.idLibro);

        if(queryResultPrestamos.length > 0){
            res.status(400).json("El libro tiene ejemplares prestados");
        }
        else{
            const queryEliminar = `delete from libros where id_libro = (?)`;
            var queryResultEliminar = await query(queryEliminar, req.params.idLibro);
            res.status(204).json("Se elimino el libro correctamente");
        }
    }
})

// GET cantidad libro : obtener la cantidad de ejemplares disponibles
app.get('/libros/:idLibro',auth, async function(req,res){
    const queryStr = `select cantidad from libros where id_libro = (?)`;
    var queryResult = await query(queryStr,req.params.idLibro);
    if (queryResult.length <= 0){
      res.status(404).json("Libro not found");
    } 
    else {
        const queryCantPrestada = `select count(*) as cant_prestada from prestamos where id_libro = (?)`;
        var queryResultCantPrestada = await query(queryCantPrestada, req.params.idLibro);
        var disponibles = queryResult[0].cantidad - queryResultCantPrestada[0].cant_prestada;
        res.status(200).json("Cantidad de ejemplares: " + disponibles);
    } 
})

// GET prestamo por socio : obtener libros prestados a un socio
app.get('/prestamos/:idSocio',auth, async function(req, res){
    const querySocio = `select * from usuarios where id = (?)`;
    var queryidSocio = await query(querySocio,req.params.idSocio);

    if(queryidSocio.length<=0){
        res.status(404).json("Socio no encontrado");
    }
    else{
        const queryPrestamos = `select * from prestamos where id_socio = (?)`;
        var queryPrestamosSocios = await query(queryPrestamos,req.params.idSocio);
        if(queryPrestamosSocios.length <= 0){
            res.status(404).json("No se encontraron libros prestado al socio");
        }
        else{
            res.status(200).json(queryPrestamosSocios);
        }
    }
})

// DELETE prestamos por id : eliminar un prestamo
app.delete('/prestamos/:idPrestamo',auth, async function(req, res){
    const queryPrestamos = `select * from prestamos where id_prestamo = (?)`;
    var queryidPrestamos = await query(queryPrestamos, req.params.idPrestamo);

    if(queryidPrestamos.length <= 0){
        res.status(404).json("Prestamo no encontrado");
    }
    else{
        const queryStr = `delete from prestamos where id_prestamo = (?)`;
        var queryEliminar = await query(queryStr, req.params.idPrestamo);
        res.status(204).json("Prestamo eliminado");
    }
})

//////////////////////////////////////////////
// ## Autorizado para todos los usuarios ## //
//////////////////////////////////////////////

// GET libros : listar todos los libros
app.get('/libros', async function(req,res){
    var queryResult = await query(`select * from libros`);
    console.log(queryResult);
    res.status(200).json(queryResult);
})

// GET prestamos : listar todos los prestamos (admin)
app.get('/prestamos', async function(req,res){
    if(req.session.rol == "s" || req.session.rol == "S"){
        const queryStr = `select * from prestamos where id_socio = (?)`;
        var queryResult = await query(queryStr,req.session.id_socio);
        console.log(queryResult);
        res.status(200).json(queryResult);
    }
    else{
        var queryResult = await query(`select id_prestamo, libros.id_libro, usuarios.id, libros.titulo, usuarios.nombre, fecha_vto
                                        from prestamos join usuarios join libros 
                                        where prestamos.id_socio = usuarios.id && 
                                              prestamos.id_libro = libros.id_libro`);
        for(p of queryResult){
            p.fecha_vto = (new Date(p.fecha_vto)).toLocaleDateString('eu-ES');
        }
        console.log(queryResult);
        res.status(200).json(queryResult);
    }
})

/////////////////////////////////////////
// ## Autorizado solo para el socio ## //
/////////////////////////////////////////

// POST prestamo : agregar un prestamo
app.post('/prestamos', async function(req, res){
    if(req.session.rol == "s" || req.session.rol == "S"){
        const queryLibro = `select * from libros where id_libro = (?)`;
        var queryidLibro = await query(queryLibro,req.body.idLibro);

        var idSocio = req.session.id_socio;

        const queryCantidad = `select count(*) cant from prestamos where id_libro = (?)`;
        var queryCantidadLibros = await query(queryCantidad,req.body.idLibro);

        var f = new Date();
        var fechaMiliseg = f.getTime();
        const queryPrestamos = `select * from prestamos where id_socio = (?) and fecha_vto < (?)`;
        var queryPrestamosSocios = await query(queryPrestamos,[idSocio, fechaMiliseg]);

        if(queryidLibro.length<=0){
            res.status(404).json("Libro no encontrado");
        }
        else if(req.body.cantidadDias <= 0){
            res.status(400).json("Cantidad de dias debe ser mayor a cero");
        }
        else{
            disponibles = queryidLibro[0].cantidad - queryCantidadLibros[0].cant;
            
            if (disponibles <= 0){
                res.status(400).json("No hay ejemplares disponibles");
            }
            else if(queryPrestamosSocios.length > 0){
                res.status(400).json("El socio tiene prestamos vencidos");
            }
            else{
                const queryStr = `insert into prestamos (id_prestamo, id_libro, id_socio, fecha_vto) values (?, ?, ?, ?)`;
                var queryResult = await query(queryStr, [getNewID(), req.body.idLibro, idSocio, obtenerFechaVto(req.body.cantidadDias)]);
                console.log(queryResult);
                res.status(201).json("Se agrego el prestamo correctamente");
            }
        }
    }
    else{
        res.status(401).json("El adminstrador no puede pedir prestamo");
    }
})

// REQ Obtener libros prestados a un socio
// app.get('/prestamos/socios/:idSocio', async function(req, res){
//     const querySocio = `select * from usuarios where id = (?)`;
//     var queryidSocio = await query(querySocio,req.params.idSocio);

//     if(queryidSocio.length<=0){
//         res.status(404).json("Socio no encontrado");
//     }
//     else{
//         const queryPrestamos = `select * from prestamos where id = (?)`;
//         var queryPrestamosSocios = await query(queryPrestamos,req.params.idSocio);
//         if(queryPrestamosSocios.length <= 0){
//             res.status(404).json("No se encontraron libros prestado al socio");
//         }
//         else{
//             res.status(200).json(queryPrestamosSocios);
//         }
//     }
// })
// app.get('/prestamos/socios/user', async function (req, res) {
//     const querySocio = `select * from usuarios where id = (?)`;
//     console.log("sesion id " + req.session.id_user)
//     var queryidSocio = await query(querySocio, req.session.id_user);

//     if (queryidSocio.length <= 0) {
//         res.status(404).json("Socio no encontrado");
//     }
//     else {
//         const queryPrestamos = `select * from prestamos inner join libros where id_socio = (?)`;
//         var queryPrestamosSocios = await query(queryPrestamos, req.session.id_user);
//         if (queryPrestamosSocios.length <= 0) {
//             res.status(404).json("No se encontraron libros prestado al socio");
//         }
//         else {
//             res.status(200).json(queryPrestamosSocios);
//         }
//     }
// })

app.get('/prestamos/vencidos', async function (req, res) {
    var fechaMiliseg = (new Date()).getTime();
    const queryPrestamos = `select * from prestamos where fecha_vto < ?`;
    var queryPrestamosGeneral = await query(queryPrestamos, [fechaMiliseg]);
    if (queryPrestamosGeneral <= 0) {
        res.status(400).json("No hay prestamos vencidos");
    } else {
        res.status(200).json(queryPrestamosGeneral);
    }
})


////////////////////////////////
// ## Funciones auxiliares ## //
////////////////////////////////

function getNewID() {
    return Math.random().toString(36).substr(2, 9);
}

function obtenerFechaVto(dias) {
    var f = new Date();
    var fechaMiliseg = f.getTime();
    var fecVto = fechaMiliseg + (DIAS_MILI_SEG * dias);
    return fecVto;
}

var server = app.listen(8080, '127.0.0.1', function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
})