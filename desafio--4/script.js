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
    constructor(numeroOperacion = 0, tipoOperacion, par = "predeterminado", distanciaPorcentajeRecompraReventa = 0, aumentoPorcentajeRecompraReventa = 0, sl, precioMoneda = 0, cantidadMonedas = 0, montoInvertido = 0){
        this.numeroOperacion = numeroOperacion;
        this.tipoOperacion = tipoOperacion;
        this.par = par
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
    
    mostrarDatosOperacionInicial(){
        const divDatosCompraInicial = document.getElementById('divDatosCompraInicial');

        divDatosCompraInicial.innerHTML += `
        <p> Moneda: ${this.par} </p>
        <p> Precio de compra: $${this.precioMoneda} </p>
        <p> Monto invertido en dolares: $${this.montoInvertido.toFixed(3)} </p>
        <p> Tamaño compra: ${this.cantidadMonedas} monedas </p>
        <p> Tipo de operacion: ${this.tipoOperacion} </p>    `
    }

}

function mostrarOperaciones(operaciones, gridOperaciones){
    gridOperaciones.innerHTML += `
  
    <div class="row">
        <div class="col"> # </div>
        <div class="col"> PRECIO </div>
        <div class="col"> MONEDA </div>
        <div class="col"> USDT </div>
    </div>
    `
    console.log(operaciones);
    operaciones.forEach(operacion => {
        console.log(`precio moneda operacion: ${operacion.precioMoneda}`);
        gridOperaciones.innerHTML += `  
        <div class="row">
        <div class="col"> ${operacion.numeroOperacion} </div>
        <div class="col"> $${operacion.precioMoneda.toFixed(3)} </div>
        <div class="col"> ${operacion.cantidadMonedas.toFixed(3)} </div>
        <div class="col"> $${operacion.montoInvertido.toFixed(2)} </div>
        </div>
        `
    });
}

function calcularPnL(cantidadMonedas, precioMonedaInicial, precioMonedaFinal, tipoOperacion){
    let pnl;

    if(tipoOperacion == "short"){
        pnl = cantidadMonedas * (precioMonedaFinal - precioMonedaInicial);
    } else if(tipoOperacion == "long"){
        pnl = (cantidadMonedas * (precioMonedaFinal - precioMonedaInicial)) * -1;
    }
    
    return pnl;
        //pnl = operaciones[0].cantidadMonedas * (operaciones[nroOperacionAnterior].precioMoneda - precioMoneda);
        
}

//compruebo si esta creado mi localStorage, si no esta creado lo creo, y si esta, le envio las operaciones que tenia previamente
const operacionesIniciales = JSON.parse(localStorage.getItem("operacionesIniciales")) ?? [];
//console.log(operacionesIniciales);

const form = document.getElementById('idForm');
const idBtnDropDown = document.getElementById("idBtnDropDown");
const idOperacionesInicialesLista = document.getElementById("idOperacionesInicialesLista");
const gridOperaciones = document.getElementById("gridOperaciones");

idBtnDropDown.addEventListener("click", () => {

    //elimino todos los hijos de la lista, para cuando lo clickee no se repitan
    idOperacionesInicialesLista.innerHTML = "";
    console.log(`Operaciones iniciales lista: ${idOperacionesInicialesLista}`);

    operacionesIniciales.forEach(operacion => {
        idOperacionesInicialesLista.innerHTML += `
        <li><p>${operacion} - ${operacion.par}</p></li>  
        `
    });
});

form.addEventListener('submit', (event) => {
    event.preventDefault();

    let tipoOperacion, par, distanciaPorcentajeRecompraReventa, aumentoPorcentajeRecompraReventa, sl, precioMoneda, cantidadMonedas;
    let montoInvertido;
    //let numeroRecomprasTotales;
    //let mostrarListaInvertida;

    //compruebo si mi localStorage hay almacenadas operaciones, sino creo una nueva
    //la coloco aqui tambien porque si
    const operacionesIniciales = JSON.parse(localStorage.getItem("operacionesIniciales")) ?? [];

    //contiene las operaciones, de recompra o reventa, incluida compra/venta incial
    const operaciones = [];
    //contiene todas las operaciones promediadas
    const operacionesProm = [];

    const divDatosCompraInicial = document.getElementById("divDatosCompraInicial");
    divDatosCompraInicial.innerHTML ="";

    const gridOperaciones = document.getElementById("gridOperaciones");
    gridOperaciones.innerHTML = "";

    //metodo de js que extrae la informacion de los campos de un formulario objetivo
    let dataForm = new FormData(event.target);

    //hago este paso para que sea mas legible pero podria directamente crear el objeto con los datos que vengan del objeto dataForm
    tipoOperacion = dataForm.get("operacion");
    par = dataForm.get("parName");
    distanciaPorcentajeRecompraReventa = parseFloat(dataForm.get("distanciaPorcentajeRecompraReventaName"));
    aumentoPorcentajeRecompraReventa = parseFloat(dataForm.get("aumentoPorcentajeRecompraReventaName"));
    sl = parseFloat(dataForm.get("slName"));
    precioMoneda = parseFloat(dataForm.get("precioMonedaName"));
    cantidadMonedas = parseFloat(dataForm.get("cantidadMonedasName"));

    //almaceno el valor de los input del html en variables let
    /*tipoOperacion = (document.getElementById('tipoOperacion').value);
    par = (document.getElementById('par').value).toUpperCase();
    distanciaPorcentajeRecompraReventa = parseFloat(document.getElementById('distanciaPorcentajeRecompraReventa').value);
    aumentoPorcentajeRecompraReventa = parseFloat(document.getElementById('aumentoPorcentajeRecompraReventa').value);
    sl = parseFloat(document.getElementById('sl').value);
    precioMoneda = parseFloat(document.getElementById('precioMoneda').value);

    cantidadMonedas = parseFloat(document.getElementById('cantidadMonedas').value);*/

    //creo el objeto inicial, con los datos que me ingresaron en el html
    const operacion0 = new Operacion(0, tipoOperacion, par, distanciaPorcentajeRecompraReventa, aumentoPorcentajeRecompraReventa, sl, precioMoneda, cantidadMonedas);
    operaciones.push(operacion0);

    operaciones[0].calcularMontoInvertido(precioMoneda, cantidadMonedas);

    //operaciones[0].calcularRecomprasReventas(sl, distanciaPorcentajeRecompraReventa);

    //La calculadora no permite mas que calcular 8 recompras, mas recompras, no se recomienda

    //let precioMonedaAcum = 0;
    //let cantidadMonedasAcum = 0;
    //let montoInvertidoAcum = 0;
    let precioMonedaEnSl = 0;
    let porcentajeDistanciaSl = 0;
    //let porcentajeTotalOperaciones = 0;
    let i = 0;
    let pnl = 0;

    if(operaciones[0].tipoOperacion === "short"){

        operaciones[0].mostrarDatosOperacionInicial();

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
                pnl = calcularPnL(operaciones[0].cantidadMonedas, operaciones[nroOperacionAnterior].precioMoneda, precioMoneda, operaciones[0].tipoOperacion);

            } else {
                nroOperacionProm = nroOperacionAnterior - 1;

                pnl = calcularPnL(operacionesProm[nroOperacionProm].cantidadMonedas, operacionesProm[nroOperacionProm].precioMoneda, precioMoneda, operaciones[0].tipoOperacion);
                //pnl = operacionesProm[nroOperacionProm].cantidadMonedas * (precioMoneda - operacionesProm[nroOperacionProm].precioMoneda);

            }

            if(pnl <= operaciones[0].sl){
                const operacion = new Operacion(nroOperacion, "short", par, operaciones[0].distanciaPorcentajeRecompraReventa, operaciones[0].aumentoPorcentajeRecompraReventa, operaciones[0].sl, precioMoneda, cantidadMonedas, inversion);    
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

                const operacionProm = new Operacion(nroOperacion, "short", par, operaciones[0].distanciaPorcentajeRecompraReventa, operaciones[0].aumentoPorcentajeRecompraReventa, operaciones[0].sl, precioMonedaProm, cantidadMonedasProm, inversionProm);
                operacionesProm.push(operacionProm);
            }
            
            
        } while(pnl <= operaciones[0].sl && i < 8);
            
        //guardo datos de mis operaciones para localStorage
        operacionesIniciales.push(operacion0);

        localStorage.setItem("operacionesIniciales", JSON.stringify(operacionesIniciales));

        mostrarOperaciones(operaciones, gridOperaciones);

        /*gridOperaciones.innerHTML += `
  
        <div class="row">
            <div class="col"> # </div>
            <div class="col"> PRECIO </div>
            <div class="col"> MONEDA </div>
            <div class="col"> USDT </div>
        </div>
        `

        operaciones.forEach(operacion => {
            gridOperaciones.innerHTML += `  
            <div class="row">
                <div class="col"> ${operacion.numeroOperacion} </div>
                <div class="col"> $${operacion.precioMoneda.toFixed(3)} </div>
                <div class="col"> ${operacion.cantidadMonedas.toFixed(3)} </div>
                <div class="col"> $${operacion.montoInvertido.toFixed(2)} </div>
            </div>
            `
        });
        */

        let operacionPromUltima = operacionesProm.length - 1;
        //formula calculo precio de moneda cuando toca SL que elegi como dato de entrada en USDT.
        precioMonedaEnSl = operacionesProm[operacionPromUltima].precioMoneda + (operaciones[0].sl / operacionesProm[operacionPromUltima].cantidadMonedas);

        //formula calculo distancia de mi operacion #0 al monto de SL que quiero perder, en porcentaje
        porcentajeDistanciaSl = ((precioMonedaEnSl - operaciones[0].precioMoneda) / operaciones[0].precioMoneda) * 100;

        console.log(`
        SL(${porcentajeDistanciaSl.toFixed(2)}%)
        Precio moneda al tocar SL: $${precioMonedaEnSl.toFixed(3)}
        Cantidad de monedas compradas utilizando todas las recompras: ${operacionesProm[operacionPromUltima].cantidadMonedas.toFixed(3)}
        Monto total invertido utilizando todas las recompras: $${operacionesProm[operacionPromUltima].montoInvertido.toFixed(3)}`);

    } else if(tipoOperacion === "long"){
        operaciones[0].mostrarDatosOperacionInicial();

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
                pnl = calcularPnL(operaciones[0].cantidadMonedas, operaciones[nroOperacionAnterior].precioMoneda, precioMoneda, operaciones[0].tipoOperacion);
                //pnl = operaciones[0].cantidadMonedas * (operaciones[nroOperacionAnterior].precioMoneda - precioMoneda);

            } else {
                nroOperacionProm = nroOperacionAnterior - 1;
                pnl = calcularPnL(operacionesProm[nroOperacionProm].cantidadMonedas, operacionesProm[nroOperacionProm].precioMoneda, precioMoneda, operaciones[0].tipoOperacion);
                //pnl = operacionesProm[nroOperacionProm].cantidadMonedas * (operacionesProm[nroOperacionProm].precioMoneda - precioMoneda);
            
            }

            if(pnl <= operaciones[0].sl){
                const operacion = new Operacion(nroOperacion, "long", par, operaciones[0].distanciaPorcentajeRecompraReventa, operaciones[0].aumentoPorcentajeRecompraReventa, operaciones[0].sl, precioMoneda, cantidadMonedas, inversion);    
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

                const operacionProm = new Operacion(nroOperacion, "long", par, operaciones[0].distanciaPorcentajeRecompraReventa, operaciones[0].aumentoPorcentajeRecompraReventa, operaciones[0].sl, precioMonedaProm, cantidadMonedasProm, inversionProm);
                operacionesProm.push(operacionProm);    
            }
            
        } while(pnl <= operaciones[0].sl && i < 8);

        //guardo datos de mis operaciones para localStorage
        operacionesIniciales.push(operacion0);

        localStorage.setItem("operacionesIniciales", JSON.stringify(operacionesIniciales));

        gridOperaciones.innerHTML += `
  
        <div class="row">
            <div class="col"> # </div>
            <div class="col"> PRECIO </div>
            <div class="col"> MONEDA </div>
            <div class="col"> USDT </div>
        </div>
        `

        operaciones.forEach(operacion => {
            gridOperaciones.innerHTML += `  
            <div class="row">
                <div class="col"> ${operacion.numeroOperacion} </div>
                <div class="col"> $${operacion.precioMoneda.toFixed(3)} </div>
                <div class="col"> ${operacion.cantidadMonedas.toFixed(3)} </div>
                <div class="col"> $${operacion.montoInvertido.toFixed(2)} </div>
            </div>
            `
        });
        
        //extraigo la ultima operacion del arreglo
        let operacionPromUltima = operacionesProm.length - 1;

        //formula calculo precio de moneda cuando toca SL que elegi como dato de entrada en USDT.
        precioMonedaEnSl = operacionesProm[operacionPromUltima].precioMoneda - (operaciones[0].sl / operacionesProm[operacionPromUltima].cantidadMonedas);

        //formula calculo distancia de mi operacion #0 al monto de SL que quiero perder, en porcentaje
        porcentajeDistanciaSl = ((operaciones[0].precioMoneda - precioMonedaEnSl) / operaciones[0].precioMoneda) * 100;

        console.log(`
        SL(${porcentajeDistanciaSl.toFixed(2)}%)
        Precio moneda al tocar SL: $${precioMonedaEnSl.toFixed(3)}
        Cantidad de monedas compradas utilizando todas las recompras: ${operacionesProm[operacionPromUltima].cantidadMonedas.toFixed(3)}
        Monto total invertido utilizando todas las recompras: $${operacionesProm[operacionPromUltima].montoInvertido.toFixed(3)}`);

    }

    //reseteo el formulario
    form.reset();
});




