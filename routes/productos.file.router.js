import express from "express";
import {read, write } from "../src/utils/files.js";
import { aggRegistro } from "../middleware/middleware.js";
export const productosFileRouter = express.Router();



productosFileRouter.use(aggRegistro);

productosFileRouter.get('/',(req, res) => {
    let productos = read();

    const {Dato, DatoV, limit } = req.query;

    //Filtramos
    if (Dato && DatoV){
        productos = productos.filter(producto => producto[Dato] && producto[Dato].toString().toLowerCase() === DatoV.toLowerCase());
    }

    if(limit){
        productos = productos.slice(0, parseInt(limit));
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(productos));
})

/*productosFileRouter.get('/', (req, res) => {
    const productos = read();
    console.log('productos', productos);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(productos));
});*/

productosFileRouter.get('/:id', (req, res) => {
    const productos = read();
    const producto = productos.find(producto => producto.id === parseInt(req.params.id));
    if (producto) {
        res.json(producto);
    } else {
        res.status(404).end();
    }
});

//POST
productosFileRouter.post('/', (req, res) => {
    const productos = read();
    const producto ={
        ...req.body,
        id: productos.length + 1
    }
    productos.push(producto);
    write(productos);
    res.status(201).json(productos);
})

productosFileRouter.put('/:id', (req, res) => {
    const { error } = validarProducto(req.body);
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }

    const productos = read();
    let producto = productos.find(producto => producto.id === parseInt(req.params.id));
    if (producto) {
        producto = {
            ...producto,
            ...req.body
        };
        productos[productos.findIndex(producto => producto.id === parseInt(req.params.id))] = producto;
        write(productos);
        res.json(producto);
    } else {
        res.status(404).end();
    }
});

productosFileRouter.delete('/:id', (req, res) => {
    const productos = read();
    const producto = productos.find(producto => producto.id === parseInt(req.params.id));

    if (producto) {
        productos.splice(
            productos.findIndex(producto => producto.id === parseInt(req.params.id)),
            1
        );
        write(productos);

    } else {
        res.status(404).end();
    }
});


// PUT: Actualizar un campo de todos los registros
productosFileRouter.put('/actualizar', (req, res) => {
    const productos = read(); // Leer todos los registros
    const { field, value } = req.body; // Extraer el campo y el valor del cuerpo de la solicitud

    // Validar que el campo y el valor sean proporcionados
    if (!field || value === undefined) {
        return res.status(400).json({ message: 'El campo y el valor son requeridos.' });
    }

    // Actualizar cada registro y agregar el campo updated_at
    productos.forEach(producto => {
        producto[field] = value; // Actualizar el campo especificado
        producto.updated_at = dayjs().format('HH:mm DD-MM-YYYY'); // Agregar la fecha y hora actual
    });

    write(productos); // Guardar los registros actualizados
    res.status(200).json(productos); // Enviar los registros actualizados como respuesta
});


