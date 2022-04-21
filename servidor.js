import express, {Router} from 'express';
import productosLista from './productos.js'

let productos =productosLista
const routerApiProductos=Router()
const app= express();

app.use('/api/productos', routerApiProductos)

app.use(express.static('public'))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

routerApiProductos.use(express.json())
routerApiProductos.use(express.urlencoded({extended: true}))

//-----------------------GET-----------------------

routerApiProductos.get('/',(req, res) => {
    console.log('peticion GET');
    res.json(productos)
})
routerApiProductos.get('/:id',(req, res) => {
    const id = req.params.id
    const prodById =productos.find(p=>p.id==id)
    console.log('peticion GET BY ID');

    if (!prodById) {
        const error = { error: 'producto no encontrado'}
        return res.send(error)
    }
    res.json(prodById)
})

//----------------------POST-----------------------

routerApiProductos.post('/',(req, res) => {
    const prodAgregado=req.body
    prodAgregado.id = productos.length + 1
    productos.push(prodAgregado)
    res.json(req.body)
    console.log('peticion POST');
})

//-------------------------PUT-----------------------

routerApiProductos.put('/:id',(req, res) => {
    const idProdAnterior= req.params.id;
    const prodActualizado=req.body;
    prodActualizado.id=Number(idProdAnterior)

    productos = productos.map(producto=>{
        if (producto.id==idProdAnterior) {
            producto= prodActualizado; 
        }
        return producto
    })
    console.log('peticion PUT');
    res.json(prodActualizado)
})

//---------------------------DELETE-----------------------

routerApiProductos.delete('/:id',(req, res) => {
    const id = Number(req.params.id)

    let productoEliminado= JSON.stringify(productos.find(producto=> producto.id == id))
    productos= productos.filter(producto=> producto.id != id)
    res.send(`Producto eliminado: ${productoEliminado}`)
})

//--------------------------------------------------------------
//             SERVER LISTEN

const server= app.listen(8080, ()=>{
    console.log(`Escuchando en el puerto ${server.address().port}`);
})
server.on('error',error=>console.log(`El error fue el siguiente ${error}`))
