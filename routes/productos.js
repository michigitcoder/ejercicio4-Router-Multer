const express = require("express")
const multer = require("multer")
const Contenedor = require("../contenedor");
const miArchivo = "prueba.txt";
let contenedor = new Contenedor(miArchivo);


let storage = multer.diskStorage({
    destination: function (req,res,cb){
        cb(null, "uploads")
    },
    filename: function(req,file,cb){
        cb(null, file.originalname)
    }
})



const {Router} = express

let routerP = new Router();



routerP.get("/", (req,res)=>{
    try{
        let products = contenedor.getAll();
        if (typeof products != "object"){
            // res.send(JSON.stringify({error: `El archivo ${miArchivo} no existe` }))
            res.status(400).send({message: `El archivo ${miArchivo} no existe` })
        }
        else if (products.length === 0){
            // res.send(JSON.stringify({error:"No hay productos para mostrar"}))
            res.status(400).send({message:"No hay productos para mostrar"})
        }
        else // res.send(JSON.stringify(products)); ¿¿¿ Enviar archivo en formato JSON ???
            res.send(products)
    }catch{res.status(400).send({message: "Error al buscar los productos"})}    
})

routerP.get("/:id", (req,res)=>{
    const id = parseInt(req.params.id);
    try{
        let producto = contenedor.getById(id);
        if (typeof producto == "object")
            res.json(producto)
        else res.status(400).send({message: producto})
    }catch{res.status(400).send({message: "Error al buscar producto"})}
})

let upload = multer({storage});

routerP.post("/", (req,res)=>{
    try{
        // let file = req.file;
        // console.log(req);
        // console.log(req.body)
        // if (!file) res.status(400).send({message: "Error al cargar"})
        let producto = req.body;
        // producto.thumbnail = file.path
        console.log(producto);
        let id = contenedor.save(producto);
        res.send(`El producto se agrego correctamente, id: ${id}`)
    }catch{
        res.status(400).send({message: "Error al guardar producto"})
    }
})
routerP.post("/form",upload.single("thumbnail"), (req,res)=>{
    try{
        let file = req.file;
        console.log(file);
        // console.log(req.body)
        if (!file) res.status(400).send({message: "Error al cargar"})
        let producto = req.body;
        producto.thumbnail = file.path
        console.log(producto);
        let id = contenedor.save(producto);
        res.send(`El producto se agrego correctamente, id: ${id}`)
    }catch{
        res.status(400).send({message: "Error al guardar producto"})
    }
})
routerP.put("/:id", (req,res)=>{
    try{
        const id = parseInt(req.params.id);
        let producto = req.body;
        console.log(producto);
        let nuevoProducto = contenedor.modifyById(producto,id);
        if (typeof nuevoProducto == "object") res.send(`El producto se modifico correctamente, id: ${id}`)
            else res.status(400).send({message: nuevoProducto})
    }catch{
        res.status(400).send({message: "Error al guardar producto"})
    }
    
})

routerP.delete("/:id", (req,res)=>{
    try{
        const id = parseInt(req.params.id);
        let mensaje = contenedor.deleteById(id);
        res.send(mensaje)
    }catch{
        res.status(400).send({message:"Error al guardar producto"})
    }
    
})

module.exports = routerP;