/*
variables:
//visibles en calculadora
-tipo de operacion: short o long (tipoOperacion)
-% recompra/reventa: porcentaje de recompra-distancia (distanciaRecompra)
-% monedas: porcentaje de aumento por cada recompra (montoPorRecompra)
-$ stop loss: sl en usdt (slUSDT)
-$ precio de entrada: precio de compra de la moneda, en usdt (precioMoneda)
-cantidad de monedas: cantidad de monedas en la primera compra (cantidadMonedasPrimeraCompra)

//no visibles
-cantidad de usdt invertidos en primera compra (montoInvertidoEnUSDT)

*/

/*
proceso

1. voy a entrar a una moneda con 5 usdt (montoInvertidoEnUSDT)
2. Cotizacion moneda al momento de comprarla (precioMoneda)
3. Cantidad de monedas en la primera compra:
    montoInvertidoEnUSDT / precioMoneda = cantidadMonedasPrimeraCompra
4. Calculo de las recompras:



*/

/*function redondear(numero, numeroDecimales){
    if (typeof numero != 'number' || typeof numeroDecimales != 'number'){
        return null;
    }

    let signo = numero >= 0? 1 : -1;

    return (Math.round((numero * Math.pow(10, numeroDecimales)) + (signo * 0.0001)) / Math.pow(10, numeroDecimales)).toFixed(numeroDecimales);
}
*/

//declaro objeto operacion
class Operacion{
    //constructor de la clase
    constructor(numeroOperacion = 0, tipoOperacion, distanciaPorcentajeRecompraReventa = 0, aumentoPorcentajeRecompraReventa = 0, sl, precioMoneda = 0, cantidadMonedas = 0){
        this.numeroOperacion = numeroOperacion;
        this.tipoOperacion = tipoOperacion;
        this.distanciaPorcentajeRecompraReventa = distanciaPorcentajeRecompraReventa;
        this.aumentoPorcentajeRecompraReventa = aumentoPorcentajeRecompraReventa;
        this.sl = sl;
        this.precioMoneda = precioMoneda;
        this.cantidadMonedas = cantidadMonedas;
        this.montoInvertidoEnUSDT = montoInvertidoEnUSDT;
        this.numeroRecomprasTotales = numeroRecomprasTotales;
    }

    //metodos de la clase
    calcularRecomprasReventas(sl, distanciaPorcentajeRecompraReventa){
        this.numeroRecomprasTotales =  sl / distanciaPorcentajeRecompraReventa;
    }

    calcularMontoTotalInvertido(precioMoneda, cantidadMonedas){
        this.montoInvertidoEnUSDT = precioMoneda * cantidadMonedas;
    }

    mostrarDatosOperacion(){
            console.log(`
        Precio de compra: $${this.precioMoneda}
        Monto invertido en dolares: $${this.montoInvertidoEnUSDT.toFixed(3)}
        Tamaño compra: ${this.cantidadMonedas} monedas
        Tipo de operacion: ${this.tipoOperacion}
        
        `)
    }

}

let tipoOperacion, distanciaPorcentajeRecompraReventa, aumentoPorcentajeRecompraReventa, sl, precioMoneda, cantidadMonedas;
let montoInvertidoEnUSDT;
let numeroRecomprasTotales;


tipoOperacion = prompt("Ingrese tipo de operacion short / long").toLowerCase();
distanciaPorcentajeRecompraReventa = parseInt(prompt("Ingrese el porcentaje de distancia de recompra, sin el %"));
aumentoPorcentajeRecompraReventa = parseInt(prompt("Ingrese el porcentaje de aumento por c/ recompra, sin el %"));
sl = parseInt(prompt("Ingrese el porcentaje de SL en numeros, sin el %"));
precioMoneda = parseFloat(prompt("Ingrese precio de compra de moneda, la coma es con '.' "));
cantidadMonedas = parseFloat(prompt("Ingrese el tamaño de la compra en monedas, la coma es con '.' "));

//creo objeto operacion0
const operacion0 = new Operacion(0, tipoOperacion, distanciaPorcentajeRecompraReventa, aumentoPorcentajeRecompraReventa, sl, precioMoneda, cantidadMonedas);
const operaciones = [operacion0];

operaciones[0].calcularMontoTotalInvertido(precioMoneda, cantidadMonedas);
operaciones[0].calcularRecomprasReventas(sl, distanciaPorcentajeRecompraReventa);

//La calculadora no permite mas que calcular 8 recompras, mas recompras, no se recomienda

    if(operaciones[0].numeroRecomprasTotales >= 8){
        operaciones[0].numeroRecomprasTotales = 8;
    }

let precioMonedaAcum = 0;
let cantidadMonedasAcum = 0;
let montoInvertidoAcum = 0;
let precioMonedaEnSl = 0;
let porcentajeDistanciaSl = 0;

if(operaciones[0].tipoOperacion === "short"){

    operaciones[0].mostrarDatosOperacion();

    console.log(`#--------PRECIO--------MONEDAS--------USDT`);

    for(let i = 1; i <= operaciones[0].numeroRecomprasTotales; i++){   
        //creo una variable nroOperacion y nroOperacionAnterior para que sea mas legible
        let nroOperacion = i;
        let nroOperacionAnterior = i-1;
        let precioMoneda = ((operaciones[nroOperacionAnterior].precioMoneda * operaciones[nroOperacionAnterior].distanciaPorcentajeRecompraReventa) / 100) + operaciones[nroOperacionAnterior].precioMoneda;
        let cantidadMonedas = ((operaciones[nroOperacionAnterior].cantidadMonedas * operaciones[nroOperacionAnterior].aumentoPorcentajeRecompraReventa) / 100) + operaciones[nroOperacionAnterior].cantidadMonedas;

        const operacion = new Operacion(nroOperacion, "short", operaciones[0].distanciaPorcentajeRecompraReventa, operaciones[0].aumentoPorcentajeRecompraReventa, operaciones[0].sl, precioMoneda, cantidadMonedas);
        operaciones.push(operacion);
        operaciones[nroOperacion].calcularMontoTotalInvertido(precioMoneda, cantidadMonedas);

        operaciones[nroOperacion].calcularMontoTotalInvertido(operaciones[nroOperacion].precioMoneda, operaciones[nroOperacion].cantidadMonedas);
            
        console.log(`${nroOperacion}        $${operaciones[nroOperacion].precioMoneda.toFixed(3)}        ${operaciones[nroOperacion].cantidadMonedas.toFixed(3)}        $${operaciones[nroOperacion].montoInvertidoEnUSDT.toFixed(2)}`);
       
    }

} else if(operaciones[0].tipoOperacion === "long"){

    operaciones[0].mostrarDatosOperacion();

    console.log(`#--------PRECIO--------MONEDAS--------USDT`);

    for(let i = 1; i <= operaciones[0].numeroRecomprasTotales; i++){

       //creo una variable nroOperacion y nroOperacionAnterior para que sea mas legible
       let nroOperacion = i;
       let nroOperacionAnterior = i-1;
       let precioMoneda = -((operaciones[nroOperacionAnterior].precioMoneda * operaciones[nroOperacionAnterior].distanciaPorcentajeRecompraReventa) / 100) + operaciones[nroOperacionAnterior].precioMoneda;
       let cantidadMonedas = ((operaciones[nroOperacionAnterior].cantidadMonedas * operaciones[nroOperacionAnterior].aumentoPorcentajeRecompraReventa) / 100) + operaciones[nroOperacionAnterior].cantidadMonedas;

       const operacion = new Operacion(nroOperacion, "long", operaciones[0].distanciaPorcentajeRecompraReventa, operaciones[0].aumentoPorcentajeRecompraReventa, operaciones[0].sl, precioMoneda, cantidadMonedas);
       operaciones.push(operacion);
       operaciones[nroOperacion].calcularMontoTotalInvertido(precioMoneda, cantidadMonedas);

       operaciones[nroOperacion].calcularMontoTotalInvertido(operaciones[nroOperacion].precioMoneda, operaciones[nroOperacion].cantidadMonedas);
           
       console.log(`${nroOperacion}        $${operaciones[nroOperacion].precioMoneda.toFixed(3)}        ${operaciones[nroOperacion].cantidadMonedas.toFixed(3)}        $${operaciones[nroOperacion].montoInvertidoEnUSDT.toFixed(2)}`);
      
   }
}

