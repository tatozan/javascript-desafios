/*
variables:
//visibles en calculadora
-tipo de operacion: short o long (tipoOperacion)
-% recompra/reventa: porcentaje de recompra-distancia (distanciaRecompra)
-% monedas: porcentaje de aumento por cada recompra (montoPorRecompra)
-$ stop loss: sl en usdt (slUSDT)
-$ precio de entrada: precio de compra de la moneda, en usdt (cotizacionMoneda)
-cantidad de monedas: cantidad de monedas en la primera compra (cantidadMonedasPrimeraCompra)

//no visibles
-cantidad de usdt invertidos en primera compra (montoInvertidoEnUSDT)

*/

/*
proceso

1. voy a entrar a una moneda con 5 usdt (montoInvertidoEnUSDT)
2. Cotizacion moneda al momento de comprarla (cotizacionMoneda)
3. Cantidad de monedas en la primera compra:
    montoInvertidoEnUSDT / cotizacionMoneda = cantidadMonedasPrimeraCompra
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
    constructor(numeroOperacion = 0, tipoOperacion, distanciaPorcentajeRecompraReventa = 0, aumentoPorcentajeRecompraReventa = 0, sl, cotizacionMoneda = 0, cantidadMonedas = 0){
        this.numeroOperacion = numeroOperacion;
        this.tipoOperacion = tipoOperacion;
        this.distanciaPorcentajeRecompraReventa = distanciaPorcentajeRecompraReventa;
        this.aumentoPorcentajeRecompraReventa = aumentoPorcentajeRecompraReventa;
        this.sl = sl;
        this.cotizacionMoneda = cotizacionMoneda;
        this.cantidadMonedas = cantidadMonedas;
        this.montoInvertidoEnUSDT = montoInvertidoEnUSDT;
        this.numeroRecomprasTotales = numeroRecomprasTotales;
    }

    //metodos de la clase
    calcularRecomprasReventas(sl, distanciaPorcentajeRecompraReventa){
        this.numeroRecomprasTotales =  sl / distanciaPorcentajeRecompraReventa;
    }

    calcularMontoTotalInvertido(cotizacionMoneda, cantidadMonedas){
        this.montoInvertidoEnUSDT = cotizacionMoneda * cantidadMonedas;
    }

    mostrarDatosOperacion(){
            console.log(`
        Precio de compra: $${this.cotizacionMoneda}
        Monto invertido en dolares: $${this.montoInvertidoEnUSDT.toFixed(3)}
        Tamaño compra: ${this.cantidadMonedas} monedas
        Tipo de operacion: ${this.tipoOperacion}
        
        `)
    }

}

/*
function calculoRecompras(pSlPorcentaje, pDistanciaRecompra){
    return pSlPorcentaje / pDistanciaRecompra;
}

function montoTotalInvertido(pCotizacionMoneda, pCantidadMonedaPrimeraCompra){
    return pCotizacionMoneda * pCantidadMonedaPrimeraCompra;
}*/

let tipoOperacion, distanciaPorcentajeRecompraReventa, aumentoPorcentajeRecompraReventa, sl, cotizacionMoneda, cantidadMonedas;
let montoInvertidoEnUSDT;
let numeroRecomprasTotales;


tipoOperacion = prompt("Ingrese tipo de operacion short / long").toLowerCase();
distanciaPorcentajeRecompraReventa = parseInt(prompt("Ingrese el porcentaje de distancia de recompra, sin el %"));
aumentoPorcentajeRecompraReventa = parseInt(prompt("Ingrese el porcentaje de aumento por c/ recompra, sin el %"));
sl = parseInt(prompt("Ingrese el porcentaje de SL en numeros, sin el %"));
cotizacionMoneda = parseFloat(prompt("Ingrese precio de compra de moneda, la coma es con '.' "));
cantidadMonedas = parseFloat(prompt("Ingrese el tamaño de la compra en monedas, la coma es con '.' "));

//creo objeto operacion1
const operacion0 = new Operacion(0, tipoOperacion, distanciaPorcentajeRecompraReventa, aumentoPorcentajeRecompraReventa, sl, cotizacionMoneda, cantidadMonedas);
const operaciones = [operacion0];

operaciones[0].calcularMontoTotalInvertido(cotizacionMoneda, cantidadMonedas);
operaciones[0].calcularRecomprasReventas(sl, distanciaPorcentajeRecompraReventa);

//La calculadora no permite mas que calcular 8 recompras, mas recompras, no se recomienda
if(operaciones[0].numeroRecomprasTotales >= 8){
    operaciones[0].numeroRecomprasTotales = 8;
}

/*
let cotizacionMonedaRecompraActual = cotizacionMoneda;
let cantidadMonedasRecompraActual = cantidadMonedaPrimeraCompra;
let montoInvertidoEnUSDTActual = montoInvertidoEnUSDT;
*/

if(operaciones[0].tipoOperacion === "short"){

    operaciones[0].mostrarDatosOperacion();

    console.log(`#--------PRECIO--------MONEDAS--------USDT`);

    for(let i = 1; i <= operaciones[0].numeroRecomprasTotales; i++){   

        let nroOperacion = i;
        let nroOperacionAnterior = i-1;
        let cotizacionMoneda = ((operaciones[nroOperacionAnterior].cotizacionMoneda * operaciones[nroOperacionAnterior].distanciaPorcentajeRecompraReventa) / 100) + operaciones[nroOperacionAnterior].cotizacionMoneda;
        let cantidadMonedas = ((operaciones[nroOperacionAnterior].cantidadMonedas * operaciones[nroOperacionAnterior].aumentoPorcentajeRecompraReventa) / 100) + operaciones[nroOperacionAnterior].cantidadMonedas;

        //ESTE ES DIANA, EL DE SHORT ESTOY HACIENDO
        //const operacion1 = new Operacion(nroOperacion, "short", operaciones[0].distanciaPorcentajeRecompraReventa, operaciones[0].aumentoPorcentajeRecompraReventa, operaciones[0].sl, cotizacionMoneda, cantidadMonedas);
        //metodo eval: evalua un string que se le pasa como arguemento y lo analiza como codigo de js, luego lo ejecuta
        //eval('const operacion' + nroOperacion + ' = ' + 'new Operacion(nroOperacion, "short", operaciones[' + nroOperacionAnterior + '].distanciaPorcentajeRecompraReventa, operaciones[' + nroOperacionAnterior + '].aumentoPorcentajeRecompraReventa, operaciones[' + nroOperacionAnterior + '].sl, cotizacionMoneda, cantidadMonedas);');
        operaciones.push(eval('operacion' + nroOperacion));
        operaciones[nroOperacion].montoTotalInvertido(operaciones[nroOperacion].cotizacionMoneda, operaciones[nroOperacion].cantidadMonedas);
            
        console.log(`${nroOperacion}        $${operaciones[nroOperacion].cotizacionMoneda}        ${operaciones[nroOperacion].cantidadMonedas.toFixed(3)}        $${operaciones[nroOperacion].montoInvertidoEnUSDT.toFixed(2)}`);
    }
} else if(tipoOperacion === "long"){

    operacion1.mostrarDatosOperacion();

    console.log(`#--------PRECIO--------MONEDAS--------USDT`);

    for(let i = 1; i <= numeroRecomprasTotales; i++){

        cotizacionMonedaRecompraActual = cotizacionMonedaRecompraActual - ((cotizacionMonedaRecompraActual * distanciaPorcentajeRecompraReventa) / 100);
        /*cotizacionMonedaRecompraActual = cotizacionMonedaRecompraActual - ((cotizacionMonedaRecompraActual * distanciaRecompra) / 100);
        cantidadMonedasRecompraActual = ((cantidadMonedasRecompraActual * montoPorRecompra) / 100) + cantidadMonedasRecompraActual;
        montoInvertidoEnUSDTActual = montoTotalInvertido(cotizacionMonedaRecompraActual, cantidadMonedasRecompraActual);

        console.log(`${i}        $${cotizacionMonedaRecompraActual.toFixed(2)}        ${cantidadMonedasRecompraActual.toFixed(3)}        $${montoInvertidoEnUSDTActual.toFixed(2)}`);*/

    }
}

