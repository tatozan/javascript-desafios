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
-cantidad de usdt invertidos en primera compra (montoInvertido)

*/

/*
proceso

1. voy a entrar a una moneda con 5 usdt (montoInvertido)
2. Cotizacion moneda al momento de comprarla (precioMoneda)
3. Cantidad de monedas en la primera compra:
    montoInvertido / precioMoneda = cantidadMonedasPrimeraCompra
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
    constructor(numeroOperacion = 0, tipoOperacion, distanciaPorcentajeRecompraReventa = 0, aumentoPorcentajeRecompraReventa = 0, sl, precioMoneda = 0, cantidadMonedas = 0, montoInvertido = 0){
        this.numeroOperacion = numeroOperacion;
        this.tipoOperacion = tipoOperacion;
        this.distanciaPorcentajeRecompraReventa = distanciaPorcentajeRecompraReventa;
        this.aumentoPorcentajeRecompraReventa = aumentoPorcentajeRecompraReventa;
        this.sl = sl;
        this.precioMoneda = precioMoneda;
        this.cantidadMonedas = cantidadMonedas;
        this.montoInvertido = montoInvertido;
    }

    //metodos de la clase
    calcularMontoInvertido(precioMoneda, cantidadMonedas){
        this.montoInvertido = precioMoneda * cantidadMonedas;
    }
    
    mostrarDatosOperacion(){
            console.log(`
        Precio de compra: $${this.precioMoneda}
        Monto invertido en dolares: $${this.montoInvertido.toFixed(3)}
        Tamaño compra: ${this.cantidadMonedas} monedas
        Tipo de operacion: ${this.tipoOperacion}
        
        `)
    }

}

let tipoOperacion, distanciaPorcentajeRecompraReventa, aumentoPorcentajeRecompraReventa, sl, precioMoneda, cantidadMonedas;
let montoInvertido;
let numeroRecomprasTotales;
//contiene las operaciones, de recompra o reventa, incluida compra/venta incial
const operaciones = [];

//contiene todas las operaciones promediadas
const operacionesProm = [];

tipoOperacion = prompt("Ingrese tipo de operacion short / long").toLowerCase();
distanciaPorcentajeRecompraReventa = parseInt(prompt("Ingrese el porcentaje de distancia de recompra, sin el %"));
aumentoPorcentajeRecompraReventa = parseInt(prompt("Ingrese el porcentaje de aumento por c/ recompra, sin el %"));
sl = parseInt(prompt("Ingrese el monto en USDT que desea perder como maximo en la operacion"));
precioMoneda = parseFloat(prompt("Ingrese precio de compra de moneda, la coma es con '.' "));
cantidadMonedas = parseFloat(prompt("Ingrese el tamaño de la compra en monedas, la coma es con '.' "));

//creo objeto operacion0
const operacion0 = new Operacion(0, tipoOperacion, distanciaPorcentajeRecompraReventa, aumentoPorcentajeRecompraReventa, sl, precioMoneda, cantidadMonedas);
operaciones.push(operacion0);

operaciones[0].montoInvertido = precioMoneda * cantidadMonedas;
//operaciones[0].calcularRecomprasReventas(sl, distanciaPorcentajeRecompraReventa);

//La calculadora no permite mas que calcular 8 recompras, mas recompras, no se recomienda

let precioMonedaAcum = 0;
let cantidadMonedasAcum = 0;
let montoInvertidoAcum = 0;
let precioMonedaEnSl = 0;
let porcentajeDistanciaSl = 0;
let porcentajeTotalOperaciones = 0;
let i = 0;
let pnl = 0;

if(operaciones[0].tipoOperacion === "short"){

    operaciones[0].mostrarDatosOperacion();

    console.log(`#--------PRECIO--------MONEDAS--------USDT`);

    do{
        i += 1; 
        //creo una variable nroOperacion y nroOperacionAnterior para que sea mas legible
        let nroOperacion = i;
        let nroOperacionAnterior = i-1;
        let nroOperacionProm = i;

        //datos Recompras
        let precioMoneda = ((operaciones[nroOperacionAnterior].precioMoneda * operaciones[nroOperacionAnterior].distanciaPorcentajeRecompraReventa) / 100) + operaciones[nroOperacionAnterior].precioMoneda;
        let cantidadMonedas = ((operaciones[nroOperacionAnterior].cantidadMonedas * operaciones[nroOperacionAnterior].aumentoPorcentajeRecompraReventa) / 100) + operaciones[nroOperacionAnterior].cantidadMonedas;
        let inversion =  precioMoneda * cantidadMonedas;

        //Datos operaciones Promediadas
        let cantidadMonedasProm;
        let precioMonedaProm;
        let inversionProm;
        
        if(i === 1){
            pnl = operaciones[0].cantidadMonedas * (precioMoneda - operaciones[nroOperacionAnterior].precioMoneda);

        } else {
            nroOperacionProm = nroOperacionAnterior - 1;
            pnl = operacionesProm[nroOperacionProm].cantidadMonedas * (precioMoneda - operacionesProm[nroOperacionProm].precioMoneda);
          
        }

        if(pnl <= operaciones[0].sl){
            const operacion = new Operacion(nroOperacion, "short", operaciones[0].distanciaPorcentajeRecompraReventa, operaciones[0].aumentoPorcentajeRecompraReventa, operaciones[0].sl, precioMoneda, cantidadMonedas, inversion);    
            operaciones.push(operacion);

            if(i === 1){
                precioMonedaProm = (operaciones[nroOperacionAnterior].montoInvertido + operaciones[nroOperacion].montoInvertido) / (operaciones[nroOperacionAnterior].cantidadMonedas + operaciones[nroOperacion].cantidadMonedas);
                cantidadMonedasProm = operaciones[nroOperacionAnterior].cantidadMonedas + operaciones[nroOperacion].cantidadMonedas;
                inversionProm = precioMonedaProm * cantidadMonedasProm;

            } else{
                precioMonedaProm = (operacionesProm[nroOperacionProm].montoInvertido + operaciones[nroOperacion].montoInvertido) / (operacionesProm[nroOperacionProm].cantidadMonedas + operaciones[nroOperacion].cantidadMonedas);
                cantidadMonedasProm = operacionesProm[nroOperacionProm].cantidadMonedas + operaciones[nroOperacion].cantidadMonedas;
                inversionProm = precioMonedaProm * cantidadMonedasProm;
            }

            const operacionProm = new Operacion(nroOperacion, "short", operaciones[0].distanciaPorcentajeRecompraReventa, operaciones[0].aumentoPorcentajeRecompraReventa, operaciones[0].sl, precioMonedaProm, cantidadMonedasProm, inversionProm);
            operacionesProm.push(operacionProm);
            
            console.log(`${nroOperacion}        $${operaciones[nroOperacion].precioMoneda.toFixed(3)}        ${operaciones[nroOperacion].cantidadMonedas.toFixed(3)}        $${operaciones[nroOperacion].montoInvertido.toFixed(2)}`);
 
        }
        
        
    } while(pnl <= operaciones[0].sl && i < 8);

    let operacionPromUltima = operacionesProm.length - 1;
    //formula calculo precio de moneda cuando toca SL que elegi como dato de entrada en USDT.
    precioMonedaEnSl = operacionesProm[operacionPromUltima].precioMoneda + (operaciones[0].sl / operacionesProm[operacionPromUltima].cantidadMonedas);

    //formula calculo distancia de mi operacion #0 al monto de SL que quiero perder, en porcentaje
    porcentajeDistanciaSl = ((precioMonedaEnSl - operaciones[0].precioMoneda) / operaciones[0].precioMoneda) * 100;

    console.log(`
    SL(${porcentajeDistanciaSl.toFixed(2)}%)
    Precio moneda al tocar SL: ${precioMonedaEnSl.toFixed(3)}
    Cantidad de monedas compradas utilizando todas las recompras: ${operacionesProm[operacionPromUltima].cantidadMonedas.toFixed(3)}
    Monto total invertido utilizando todas las recompras: ${operacionesProm[operacionPromUltima].montoInvertido.toFixed(3)}`);

} else if(tipoOperacion === "long"){
    operaciones[0].mostrarDatosOperacion();

    console.log(`#--------PRECIO--------MONEDAS--------USDT`);

    do{
        i += 1; 
        //creo una variable nroOperacion y nroOperacionAnterior para que sea mas legible
        let nroOperacion = i;
        let nroOperacionAnterior = i-1;
        let nroOperacionProm = i;

        //datos Recompras
        let precioMoneda = operaciones[nroOperacionAnterior].precioMoneda - ((operaciones[nroOperacionAnterior].precioMoneda * operaciones[nroOperacionAnterior].distanciaPorcentajeRecompraReventa) / 100);
        let cantidadMonedas = ((operaciones[nroOperacionAnterior].cantidadMonedas * operaciones[nroOperacionAnterior].aumentoPorcentajeRecompraReventa) / 100) + operaciones[nroOperacionAnterior].cantidadMonedas;
        let inversion =  precioMoneda * cantidadMonedas;

        //Datos operaciones Promediadas
        let cantidadMonedasProm;
        let precioMonedaProm;
        let inversionProm;
        
        if(i === 1){
            pnl = operaciones[0].cantidadMonedas * (precioMoneda - operaciones[nroOperacionAnterior].precioMoneda);

        } else {
            nroOperacionProm = nroOperacionAnterior - 1;
            pnl = operacionesProm[nroOperacionProm].cantidadMonedas * (precioMoneda - operacionesProm[nroOperacionProm].precioMoneda);
          
        }

        if(pnl <= operaciones[0].sl){
            const operacion = new Operacion(nroOperacion, "long", operaciones[0].distanciaPorcentajeRecompraReventa, operaciones[0].aumentoPorcentajeRecompraReventa, operaciones[0].sl, precioMoneda, cantidadMonedas, inversion);    
            operaciones.push(operacion);

            if(i === 1){
                precioMonedaProm = (operaciones[nroOperacionAnterior].montoInvertido + operaciones[nroOperacion].montoInvertido) / (operaciones[nroOperacionAnterior].cantidadMonedas + operaciones[nroOperacion].cantidadMonedas);
                cantidadMonedasProm = operaciones[nroOperacionAnterior].cantidadMonedas + operaciones[nroOperacion].cantidadMonedas;
                inversionProm = precioMonedaProm * cantidadMonedasProm;

            } else{
                precioMonedaProm = (operacionesProm[nroOperacionProm].montoInvertido + operaciones[nroOperacion].montoInvertido) / (operacionesProm[nroOperacionProm].cantidadMonedas + operaciones[nroOperacion].cantidadMonedas);
                cantidadMonedasProm = operacionesProm[nroOperacionProm].cantidadMonedas + operaciones[nroOperacion].cantidadMonedas;
                inversionProm = precioMonedaProm * cantidadMonedasProm;
            }

            const operacionProm = new Operacion(nroOperacion, "short", operaciones[0].distanciaPorcentajeRecompraReventa, operaciones[0].aumentoPorcentajeRecompraReventa, operaciones[0].sl, precioMonedaProm, cantidadMonedasProm, inversionProm);
            operacionesProm.push(operacionProm);
            
            console.log(`${nroOperacion}        $${operaciones[nroOperacion].precioMoneda.toFixed(3)}        ${operaciones[nroOperacion].cantidadMonedas.toFixed(3)}        $${operaciones[nroOperacion].montoInvertido.toFixed(2)}`);
 
        }
        
        
    } while(pnl <= operaciones[0].sl && i < 8);

    let operacionPromUltima = operacionesProm.length - 1;
    //formula calculo precio de moneda cuando toca SL que elegi como dato de entrada en USDT.
    precioMonedaEnSl = operacionesProm[operacionPromUltima].precioMoneda - (operaciones[0].sl / operacionesProm[operacionPromUltima].cantidadMonedas);

    //formula calculo distancia de mi operacion #0 al monto de SL que quiero perder, en porcentaje
    porcentajeDistanciaSl = ((operaciones[0].precioMoneda - precioMonedaEnSl) / operaciones[0].precioMoneda) * 100;

    console.log(`
    SL(${porcentajeDistanciaSl.toFixed(2)}%)
    Precio moneda al tocar SL: ${precioMonedaEnSl.toFixed(3)}
    Cantidad de monedas compradas utilizando todas las recompras: ${operacionesProm[operacionPromUltima].cantidadMonedas.toFixed(3)}
    Monto total invertido utilizando todas las recompras: ${operacionesProm[operacionPromUltima].montoInvertido.toFixed(3)}`);

}


