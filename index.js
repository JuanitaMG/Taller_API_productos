
import express from 'express';
import {read, write} from './src/utils/files.js'

const app = express();
app.use(express.json());

//GET
app.get('/products',(req, res) => {
    const products = read();
    console.log('products', products);
    res.setHeader('Content-Type', 'aplication/json');
    res.end(JSON.stringify(products));
})  

//GET
app.get('/products/:id', (req, res) => {
    const data = read();
    const products = data.product;
    const product = products.find(product => product.id === parseInt(req.params.id));
    if(product){
        res.json(product);
    }else{
        res.status(404).end();
    }
})

//POST
app.post('/products', (req, res) => {
    const products = read();
    const product = {
        ...req.body,
        id: products.length + 1
    };
    products.push(product);
    write(products);
    res.status(201).json(products);
});


//PUT
app.put('/products/:id', (req, res) => {
    const products = read();
    let product = products.find(product => product.id === parseInt(req.params.id));
    if (product) {
        //Actualizar task
        product = {
            ...product,
            ...req.body
        }
        //Actualizar task en el array
        products[
            products.findIndex(product => product.id === parseInt(req.params.id)) 
        ] = product;
        write(products);
        res.json(product);
    } else {
        res.status(404).end();
    }
})

//DELETE
app.delete('/products/:id', (req, res) => {
    const products = read();
    const product = products.find(product => product.id === parseInt(req.params.id));
    if (product) {
        //Eliminar task
        products.splice(
            products.findIndex(product => product.id === parseInt(req.params.id)),
            1
        );
        write(products);
        res.json(product);
    }else {
        res.status(404).end();  
    }
})

app.listen(5000, () => {
    console.log('Server listening on port 5000');
});

