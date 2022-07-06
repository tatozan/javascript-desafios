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
function calculoRecompras(pSlPorcentaje, pDistanciaRecompra){
    return pSlPorcentaje / pDistanciaRecompra;
}

function montoTotalInvertido(pCotizacionMoneda, pCantidadMonedaPrimeraCompra){
    return pCotizacionMoneda * pCantidadMonedaPrimeraCompra;
}

let tipoOperacion, distanciaRecompra, montoPorRecompra, slUSDT, cotizacionMoneda, cantidadMonedaPrimeraCompra;
let montoInvertidoEnUSDT;
let slPorcentaje;
let numeroRecomprasTotales;

tipoOperacion = prompt("Ingrese tipo de operacion short / long").toLowerCase();
distanciaRecompra = parseInt(prompt("Ingrese el porcentaje de distancia de recompra, sin el %"));
montoPorRecompra = parseInt(prompt("Ingrese el porcentaje de aumento por c/ recompra, sin el %"));
slPorcentaje = parseInt(prompt("Ingrese el porcentaje de SL en numeros, sin el %"));
cotizacionMoneda = parseFloat(prompt("Ingrese precio de compra de moneda, la coma es con '.' "));
cantidadMonedaPrimeraCompra = parseFloat(prompt("Ingrese el tamaño de la compra en monedas, la coma es con '.' "));

montoInvertidoEnUSDT = montoTotalInvertido(cotizacionMoneda, cantidadMonedaPrimeraCompra);
numeroRecomprasTotales = calculoRecompras(slPorcentaje, distanciaRecompra);

//La calculadora no permite mas que calcular 8 recompras, mas recompras, no se recomienda
if(numeroRecomprasTotales >= 8){
    numeroRecomprasTotales = 8;
}


let cotizacionMonedaRecompraActual = cotizacionMoneda;
let cantidadMonedasRecompraActual = cantidadMonedaPrimeraCompra;
let montoInvertidoEnUSDTActual = montoInvertidoEnUSDT;
//let slPorcentajeDistancia;

if(tipoOperacion === "short"){

    console.log(`
    Precio de compra: $${cotizacionMoneda}
    Monto invertido en dolares: $${montoInvertidoEnUSDT}
    Tamaño compra: ${cantidadMonedaPrimeraCompra} monedas
    Tipo de operacion: ${tipoOperacion}
    
    `)

    console.log(`#--------PRECIO--------MONEDAS--------USDT`);

    for(let i = 1; i <= numeroRecomprasTotales; i++){
        cotizacionMonedaRecompraActual = ((cotizacionMonedaRecompraActual * distanciaRecompra) / 100) + cotizacionMonedaRecompraActual;
        cantidadMonedasRecompraActual = ((cantidadMonedasRecompraActual * montoPorRecompra) / 100) + cantidadMonedasRecompraActual;
        montoInvertidoEnUSDTActual = montoTotalInvertido(cotizacionMonedaRecompraActual, cantidadMonedasRecompraActual);

        console.log(`${i}        $${cotizacionMonedaRecompraActual.toFixed(3)}        ${cantidadMonedasRecompraActual.toFixed(3)}        $${montoInvertidoEnUSDTActual.toFixed(2)}`);
    }
} else if(tipoOperacion === "long"){

    slPorcentajeDistancia = cotizacionMoneda - (cotizacionMoneda * slPorcentaje);
    console.log(`
    Precio de compra: $${cotizacionMoneda}
    Monto invertido en dolares: $${montoInvertidoEnUSDT}
    Tamaño compra: ${cantidadMonedaPrimeraCompra} monedas
    Tipo de operacion: ${tipoOperacion}

    `)

    console.log(`#--------PRECIO--------MONEDAS--------USDT`);

    for(let i = 1; i <= numeroRecomprasTotales; i++){
        cotizacionMonedaRecompraActual = cotizacionMonedaRecompraActual - ((cotizacionMonedaRecompraActual * distanciaRecompra) / 100);
        cantidadMonedasRecompraActual = ((cantidadMonedasRecompraActual * montoPorRecompra) / 100) + cantidadMonedasRecompraActual;
        montoInvertidoEnUSDTActual = montoTotalInvertido(cotizacionMonedaRecompraActual, cantidadMonedasRecompraActual);

        console.log(`${i}        $${cotizacionMonedaRecompraActual.toFixed(3)}        ${cantidadMonedasRecompraActual.toFixed(3)}        $${montoInvertidoEnUSDTActual.toFixed(2)}`);

    }
}

