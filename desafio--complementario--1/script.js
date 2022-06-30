//Pequeño programa que indica cuantas ventas bulk puedo tener con un stock determinado

let inventarioTotal = 900;
let cantidadVendidaProducto = 150;
let numeroDeVentas = 0;

while( inventarioTotal > cantidadVendidaProducto){
    inventarioTotal = inventarioTotal - cantidadVendidaProducto;
    numeroDeVentas++;
}

console.log(`Nuestro suministro de existencias soportará ${numeroDeVentas} ventas a granel`);