const fs = require("fs");

const encodingFile = "utf-8"; 


class Contenedor {
    constructor (name){
        this.name = name;
        this.path = `./${name}`;
    }

    getAll(){
        try{
            if (fs.existsSync(this.path)){
                let readFile = fs.readFileSync(this.path, encodingFile);
                return JSON.parse(readFile);
            }
            else {
                return `El archivo ${this.name} no existe`
            }
        } catch(err){
            console.log("Error en getAll");
            console.log(err);
            // throw(err);
        }
    }

    getAllAsync(){
        try{
            if (fs.existsSync(this.path)){
                let readFile = fs.promises.readFile(this.path, encodingFile);
                return readFile.then((data)=>    
                    JSON.parse(data))
                .catch((err)=>{
                    console.log("Error getAllAsync")
                    console.log(err)})
            }
            else {
                return `El archivo ${this.name} no existe`
            }
        } catch(err){
            console.log("Error en getAll");
            console.log(err);
            // throw(err);
        }
    }
    
    save(obj){
        try{
            let datos = this.getAll();
            if (typeof datos != "object"){
                obj.id = 1;
                fs.writeFileSync(this.path,JSON.stringify([obj]), encodingFile);
                return 1; // 1 === obj.id
            }
            else {
                obj.id = datos.length === 0 ? 1 : datos[datos.length-1].id + 1;
                datos.push(obj);
                fs.writeFileSync(this.path,JSON.stringify(datos),encodingFile);
                return obj.id;
            }
        }
        catch(err){
            console.log("Error en Save");
            console.log(err);
        }
    }

    async saveAsync(obj){
        try{
            let datos = this.getAll();
            if (typeof datos != "object"){
                obj.id = 1;
                await fs.promises.writeFile(this.path,JSON.stringify([obj]), encodingFile);
                return 1; // 1 === obj.id
            }
            else {
                obj.id = datos.length === 0 ? 1 : datos[datos.length-1].id + 1;
                datos.push(obj);
                await fs.promises.writeFile(this.path,JSON.stringify(datos),encodingFile);
                return obj.id;
            }
        }
        catch(err){
            console.log("Error en SaveAsync");
            console.log(err);
        }
    }

    getById(id){
        try {
            let datos = this.getAll();
            if (typeof datos != "object"){
                console.log(datos); // `El archivo ${this.name} no existe` --> retornado por getAll()
                return datos;
            }
            else {
                if(typeof id === 'number' && id <= datos[datos.length-1].id && id > 0  ){
                    if (datos.length == 0) {
                        return "No existe ningun dato en el archivo"
                    }
                    else {
                        let dato = datos.find((dato) => dato.id === id);
                        return dato ? dato : `Producto con id: ${id} no encontrado`
                    }
                }
                else return "El id es invalido"
            }
        } catch (err) {
            console.log("Error en getById");
            console.log(err);  
        }
    }

    modifyById(obj,id){
        try {
            let datos = this.getAll();
            if (typeof datos != "object"){
                console.log(datos); // `El archivo ${this.name} no existe` --> retornado por getAll()
                return datos;
            }
            else {
                if(typeof id === 'number' && id <= datos[datos.length-1].id && id > 0  ){
                    if (datos.length == 0) {
                        return "No existe ningun dato en el archivo"
                    }
                    else {
                        let indexDato = datos.findIndex((dato) => dato.id === id);
                        console.log(indexDato);
                        if (indexDato < 0){
                            return `Producto con id: ${id} no encontrado`
                        }
                        else {  obj.id = id;
                                console.log("Datos acaaa")
                                console.log(obj);
                                datos[indexDato] = obj;
                                fs.writeFileSync(this.path,JSON.stringify(datos),encodingFile);
                                return datos[indexDato];
                        }   
                    }
                }
                else return "El id es invalido"
            }
        } catch (err) {
            console.log("Error en getById");
            console.log(err);  
        }
    }

    getRandom(){
        try {
            let datos = this.getAll();
            if (typeof datos != "object"){
                console.log(datos); // `El archivo ${this.name} no existe` --> retornado por getAll()
                return datos;
            }
            else {
                if (datos.length == 0) {
                    return "No existe ningun dato en el archivo"
                }
                else{
                    let idRandom = Math.floor( Math.random() * datos.length )
                    return datos[idRandom];
                }
            }
        } catch (err) {
            console.log("Error en getRandom");
            console.log(err);  
        }
    }
    deleteById(id){
        try {
            let datos = this.getAll();
            if (typeof datos != "object"){
                console.log(datos); // `El archivo ${this.name} no existe` --> retornado por getAll()
                return datos;
            }
            else {
                if (datos.length === 0){
                    console.log("No hay ningun dato para eliminar");
                    return "No hay ningun dato para eliminar"
                }
                if (typeof id != "number"){ 
                    console.log("El id debe ser un numero");
                    return `El id: ${id} es invalido`
                }
                else if( id <=0 || id > datos[datos.length-1].id){
                    console.log("El id esta fuera de rango");
                    return `El id: ${id} es invalido`
                }
                else {
                    let nuevosDatos = datos.filter((dato)=> dato.id != id);
                    if (nuevosDatos.length < datos.length ){
                        fs.writeFileSync(this.path, JSON.stringify(nuevosDatos),encodingFile)
                        return `Se elimino el dato con id: ${id} correctamente`
                    }
                    else 
                        return `El dato con id: ${id} ya fue eliminado`

                }
            }
        } catch (err) {
            console.log("Error en deleteById");
            console.log(err);  
        }
    }

    deleteAll(){
        try {
            let datos = this.getAll();
            if (typeof datos != "object"){
                console.log(datos); // `El archivo ${this.name} no existe` --> retornado por getAll()
                return datos;
            }
            else {
                fs.writeFileSync(this.path, JSON.stringify([]),encodingFile);
                return "Se eliminaron todos los datos correctamente"
                }
            }
        catch (err) {
            console.log("Error en deletAll");
            console.log(err);  
        }
    }

    
    deleteAllAsync(){
        try {
            let datos = this.getAll();
            if (typeof datos != "object"){
                console.log(datos); // `El archivo ${this.name} no existe` --> retornado por getAll()
                return datos;
            }
            else {
                fs.writeFile(this.path, JSON.stringify([]),encodingFile,
                            (err)=>{
                                if (err){
                                    console.log("Error en escritura deleteAll");
                                    console.log(err);
                                }
                                else console.log("Se eliminaron todos los datos correctamente")
                                return "Se eliminaron todos los datos correctamente";
                                // Como hago para retornar despues de que se escribio sin errores???
                                // supongo q este return no sirve para nada xq seria return de la funcion cb de writeFile
                                
                            })
                // Pero si el return lo coloco aca, me hace un return antes de terminar el write,
                // si llega a ver un error yo ya retorne 
            }    
            }
        catch (err) {
            console.log("Error en deletAll");
            console.log(err);  
        }
    }

    // pruebaReturn(){
    //     fs.writeFile("./pruebaReturn.txt", "Hola aca escribio todo de lujo", "utf-8",
    //     (err)=>{
    //         if (err){
    //             console.log("Error pruebaReturn")
    //         }
    //         else return "Escritura con exito"
    //     })
    // }

}

module.exports = Contenedor;

///// PRUEBAS 
const objeto1=

{

    title: "Producto 1",

    price: 10,

    thumbnail: "url de la img"

}

const objeto2=

{

    title: "Producto 2",

    price: 20,

    thumbnail: "url de la img2"

}

const objeto3=

{

    title: "Producto 3",

    price: 33,

    thumbnail: "url de la img3"

}
// let prueba = new Contenedor("producto.txt");
// console.log(prueba.pruebaReturn());
// console.log(prueba.save(objeto1));
// console.log(prueba.getAll());

// console.log(prueba.save(objeto2));
// console.log(prueba.getAll());

// console.log(prueba.save(objeto3));
// console.log(prueba.getAll());

// console.log(prueba.deleteById(2));
// console.log(prueba.deleteById(56));
// console.log(prueba.deleteById(2));
// console.log(prueba.deleteById(-23));
// console.log(prueba.deleteById("1"));
// console.log(prueba.deleteById(1));
// console.log(prueba.getAll());

// console.log(prueba.deleteAll());
// console.log(prueba.getAll());

// console.log(prueba.getAll(prueba));


// console.log(prueba.save({para:2334344,hola:4334343434}));

// console.log(prueba.getAll());

// prueba.saveAsync({para:99999,hola:91191119111})
//     .then((data)=>console.log(data))
//     .catch((err)=>console.log(err));

// console.log(prueba.deleteAll());

// console.log(prueba.deleteAllAsync());

// prueba.getAllAsync().then((data)=>console.log(data));

// prueba.save(objeto1);
// prueba.save(objeto2);
// prueba.save(objeto3);
