const express = require("express");

const productosRoutes = require("./routes/productos")
const app = express()



app.use(express.json())
app.use("/static",express.static(__dirname + "/public"))
app.use("/api/productos", productosRoutes)

app.get("/",(req,res)=>{
    res.send("Pagina principal /")
})

app.get("/", (req,res)=>{
    res.sendFile("public/index.html")
})


app.listen(8080, ()=>{
    console.log("Servidor corriendo en 8080")
})