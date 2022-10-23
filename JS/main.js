//inicializacion de variables
const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let suma = 0;
let mostrarCarrito = false;
const carro = document.querySelector("#carro");
const divProductos = document.querySelector("#divProductos");
const divCarrito = document.querySelector("#divCarrito");
const btnCarrito = document.querySelector("#enviar");
const cartelCarrito = document.querySelector("#cartelCarrito");
//productos de la tienda

async function contenidoTienda() {
    try {
        const URL = './data/data.json';
        const response = await fetch(URL);
        const data = await response.json();

        cargaTienda(data);
        comprar(data);
        carritoInicial();

    } catch (error) {
        console.log(error)
    }
}



//funcion para cargar en la pagina de los productos
function cargaTienda(tienda) {
    for (const element of tienda) {
        let { img, codigo, largo, ancho, prof, precio } = element;

        divProductos.innerHTML +=
            `<div class="card">
        <div class="card_art">
            <img src="./images/${img}" alt="">
            <h3>${codigo}</h3>
        </div> 
        <div class="card_carrito">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
            <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l1.25 5h8.22l1.25-5H3.14zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/>
            </svg>
            <input type="checkbox" id="carrito${codigo}">
        </div>  
    <p>Medidas: ${largo} x ${ancho} x ${prof} cm</p>
    <p class="card_precio">$${precio}</p>
    </div>
    `
    }
}

//Funcion para permitir agregar y quitar productos del parrito
function comprar(tienda) {
    for (const maceta of tienda) {
        let valor = document.querySelector(`#carrito${maceta.codigo}`)
        valor.addEventListener("change", () => {
            carga(valor, maceta);
            localStorage.setItem("carrito", JSON.stringify(carrito));
            if (mostrarCarrito == true) { verCarrito() };

        })
    }

}

//Funcion utilizada en comprar() para agregar o quitar dependiendo del check
function carga(check, prod) {
    check.checked ? carrito.push(prod) : carrito.splice(carrito.indexOf(prod), 1);
    carritoInicial()
}

//funcion para cargar el carrito guardado en el local storage
function carritoInicial() {
    let suma = 0;
    for (const art of carrito) {
        suma = suma + art.precio
        document.querySelector(`#carrito${art.codigo}`).checked = true;
    }
    carro.innerHTML = `${carrito.length} Articulos <br> $ ${suma}`;
}

function news() {
    document.querySelector("#sub").addEventListener("click", () => {
        let mail = document.querySelector("#email");
        mail.value.includes("@") ? Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Gracias por inscribirte!',
            showConfirmButton: false,
            timer: 2500
        }) : Swal.fire({
            icon: 'error',
            title: 'Ingrese un e-mail valido',
            confirmButtonColor: '#181818'
        });
    })
}

function confirm() {
    btnCarrito.addEventListener("click", () => {
        carrito.length == 0 ? (
            Swal.fire({
                position: 'center',
                title: 'Su carrito esta vacio',
                showConfirmButton: false,
                timer: 2500
            })) :
            (verCarrito(),
                mostrarCarrito == false ?
                    (mostrarCarrito = true,
                        btnCarrito.innerHTML = "Ocultar") :
                    (mostrarCarrito = false,
                        btnCarrito.innerHTML = "Ver carrito",
                        divCarrito.innerHTML = ""))

    }
    );
}

function verCarrito() {
    divCarrito.innerHTML = "";
    divCarrito.innerHTML +=
        `<h2>Carrito</h2>
    <div id="divArticulo" class="verCarrito">
    </div>
    <divclass="container">
    <button id="comprar" type="comprar" class="confirm">Comprar</button>
    </div>`
    const divArticulo = document.querySelector("#divArticulo");
    for (const cArt of carrito) {
        let { img, codigo, largo, ancho, prof, precio } = cArt;

        divArticulo.innerHTML +=
            `<div class="tarjetaArt">
                    <div>
                        <img src="./images/${img}" alt="">    
                    </div>
                    <div>                
                        <p> ${codigo}<br>Medidas: ${largo} x ${ancho} x ${prof} cm<br>$${precio}</p>
                        <button id="quitar${codigo}" type="quitar">quitar</button>
                        </div>

                </div> `
    }
    quitar()
    finalizarCompra()
}

function quitar() {

    carrito.forEach(obj => {
        document.querySelector(`#quitar${obj.codigo}`).addEventListener("click", () => {
            carrito.splice(carrito.indexOf(obj), 1);

            document.querySelector(`#carrito${obj.codigo}`).checked = false;
            verCarrito();
            carritoInicial()
            if (carrito.length == 0) {
                divCarrito.innerHTML = "";
                mostrarCarrito = false;
                btnCarrito.innerHTML = "Ver carrito";
            }

        })
    })
}

function finalizarCompra() {
    document.querySelector("#comprar").addEventListener("click", () => {
        document.querySelector("#titulo").innerHTML = "Compra";
        
        divCarrito.innerHTML = "";

        divProductos.innerHTML = "";
        divProductos.innerHTML = `
        <div class="seccionComprar">
            <h3>Seleccione la forma de envío</h3>
            <div>
                <input type="radio" id="domicilio" name="formaEnvio">
                <label for="domicilio">Envío a domicilio (Con costo adicional)</label>
            </div>
            <div>
                <input type="radio" id="sucursal" name="formaEnvio" checked>
                <label for="sucursal">Retiro personalmente en Rosario (Sin costo adicional)</label>
            </div>
            <div class="botonesCompra">
            <button id="botonAtrasEnvio">Atrás</button>
            <button id="botonSiguienteEnvio">Siguiente</button>
            </div>
        </div>`

        btnCarrito.innerHTML = "";
        btnCarrito.disabled = true;

        agregarFuncionBotonAtrasEnvio();
        agregarFuncionBotonSiguienteEnvio();
    })
}


//Funcionalidad del boton "atrás" para retornar al carrito de compras
function agregarFuncionBotonAtrasEnvio() {
    botonAtrasEnvio = document.querySelector("#botonAtrasEnvio").addEventListener("click", () => {
        divProductos.innerHTML = "";
        verCarrito();
        contenidoTienda();
        btnCarrito.disabled = false;
        mostrarCarrito = false
        btnCarrito.innerHTML = "Ver carrito";
        divCarrito.innerHTML = "";
    });
}

//Funcionalidad del boton avanzar en el proceso de compras 
function agregarFuncionBotonSiguienteEnvio() {
    botonSiguienteEnvio = document.querySelector("#botonSiguienteEnvio").addEventListener("click", () => {
        const radioBotones = document.querySelectorAll('input[name="formaEnvio"]');
        for (const radioBoton of radioBotones) {
            if (radioBoton.checked) {
                seleccionEnvio = radioBoton.id;
            }
        }
        datosEnvio();
    })
}

//Función para pintar en el DOM la sección donde se cargan los datos para el envío o retiro en tienda
function datosEnvio() {
    if (seleccionEnvio == "domicilio") {
        divProductos.innerHTML = `
        <div class="seccionComprar2">
            <h3>Complete los datos para la entrega</h3>
            <div>
            <label for="nombre" class="textoDireccion">Nombre</label>
            <input type="text" id="nombre">
            </div>
            <div>
                <label for="apellido" class="textoDireccion">Apellido</label>
                <input type="text" id="apellido">
            </div>
            <div>
                <label for="dni" class="textoDireccion">DNI</label>
                <input type="text" id="dni">
            </div>
            <div>
                <label for="email" class="textoDireccion">Email de contacto</label>
                <input type="email" id="email">
            </div>
            <div>
                <label for="provincia" class="textoDireccion">Provincia</label>
                <input type="text" id="provincia">
            </div>
            <div>
                <label for="ciudad" class="textoDireccion">Ciudad</label>
                <input type="text" id="ciudad">
            </div>
            <div>
                <label for="codigo" class="textoDireccion">Código Postal</label>
                <input type="text" id="codigo">
            </div>
            <div>
                <label for="calle" class="textoDireccion">Calle</label>
                <input type="text" id="calle">
            </div>
            <div>
                <label for="altura" class="textoDireccion">Altura</label>
                <input type="text" id="altura">
            </div>
            <div>
                <label for="piso" class="textoDireccion">Piso y departamento</label>
                <input type="text" id="piso">
            </div>
            <div class="botonesCompra">
                <button id="botonAtrasDireccion">Atrás</button>
                <button id="botonSiguienteDireccion">Siguiente</button>
            </div>
        </div>
        `
    } else {
        divProductos.innerHTML = `
        <div class="seccionComprar2">
            <h3>Ingrese los datos para el retiro</h3>
            <div>
                <label for="nombre" class="textoDireccion">Nombre</label>
                <input type="text" id="nombre">
            </div>
            <div>
                <label for="apellido" class="textoDireccion">Apellido</label>
                <input type="text" id="apellido">
            </div>
            <div>
                <label for="dni" class="textoDireccion">DNI</label>
                <input type="text" id="dni">
            </div>
            <div>
                <label for="email" class="textoDireccion">Email de contacto</label>
                <input type="email" id="email">
            </div>
            <div class="botonesCompra">
                <button id="botonAtrasDireccion">Atrás</button>
                <button id="botonSiguienteDireccion">Siguiente</button>
            </div>
        </div>
        `
    }
    agregarFuncionBotonAtrasDireccion();
    agregarFuncionBotonSiguienteDireccion();
}

//Funcionalidad del boton para volver. Llama a la función para pintar nuevamente las opciones de "forma de envío"
function agregarFuncionBotonAtrasDireccion() {
    botonAtrasDireccion = document.querySelector("#botonAtrasDireccion").addEventListener("click", () => {
        document.querySelector("#titulo").innerHTML = "Compra";
        divCarrito.innerHTML = "";

        divProductos.innerHTML = "";
        divProductos.innerHTML = `
        <div class="seccionComprar">
            <h3>Seleccione la forma de envío</h3>
            <div>
                <input type="radio" id="domicilio" name="formaEnvio">
                <label for="domicilio">Envío a domicilio (Con costo adicional)</label>
            </div>
            <div>
                <input type="radio" id="sucursal" name="formaEnvio" checked>
                <label for="sucursal">Retiro personalmente en Rosario (Sin costo adicional)</label>
            </div>
            <div class="botonesCompra">
            <button id="botonAtrasEnvio">Atrás</button>
            <button id="botonSiguienteEnvio">Siguiente</button>
            </div>
        </div>`
        agregarFuncionBotonAtrasEnvio();
        agregarFuncionBotonSiguienteEnvio();;
    })
}

//Funcionalidad  del boton para avanzar en el proceso de compras
function agregarFuncionBotonSiguienteDireccion() {
    botonSiguienteDireccion = document.querySelector("#botonSiguienteDireccion").addEventListener("click", () => {
        nombreComprador = document.querySelector("#nombre").value;
        metodoPago();
    })
}

//Función que pinta en el DOM la seccion correspondiente al método de pago
function metodoPago() {
    if (seleccionEnvio == "domicilio") {
        divProductos.innerHTML = `
        <div class="seccionComprar">
            <h3>Seleccione un método de pago</h3>
            <div>
                <input type="radio" id="credito" name="formaPago">
                <label for="credito">Tarjeta de crédito</label>
            </div>
            <div>
                <input type="radio" id="debito" name="formaPago" checked>
                <label for="debito">Tarjeta de débito</label>
            </div>
            <div class="botonesCompra">
            <button class="btn boton" id="botonAtrasPago">Atrás</button>
            <button class="btn boton" id="botonSiguientePago">Siguiente</button>
            </div>
        </div>
        `
    } else {
        divProductos.innerHTML = `
            <div class="seccionComprar">
                <h3>Seleccione un método de pago</h3>
                <div>
                    <input type="radio" id="credito" name="formaPago">
                    <label for="credito">Tarjeta de crédito</label>
                </div>
                <div>
                    <input type="radio" id="debito" name="formaPago">
                    <label for="debito">Tarjeta de débito</label>
                </div>
                <div>
                    <input type="radio" id="efectivo" name="formaPago" checked>
                    <label for="efectivo">Efectivo (solo si retira en sucursal)</label>
                </div>
                <div class="botonesCompra">
                <button class="btn boton" id="botonAtrasPago">Atrás</button>
                <button class="btn boton" id="botonSiguientePago">Siguiente</button>
                </div>
            </div>
        `
    }

    agregarFuncionBotonAtrasPago();
    agregarFuncionBotonSiguientePago();
}

//Funcionalidad del boton retornar. Llama a la función que pinta los campos de datos de envío o retiro en tienda
function agregarFuncionBotonAtrasPago() {
    botonAtrasPago = document.querySelector("#botonAtrasPago").addEventListener("click", () => {
        datosEnvio();
    })
}

//Funcionalidad del boton para avanzar el proceso de compras.
function agregarFuncionBotonSiguientePago() {
    botonSiguientePago = document.querySelector("#botonSiguientePago").addEventListener("click", () => {
        const radioBotones = document.querySelectorAll('input[name="formaPago"]');
        for (const radioBoton of radioBotones) {
            if (radioBoton.checked) {
                seleccionPago = radioBoton.id;
                if (seleccionPago == "efectivo") {
                    resumenCompra();
                } else {
                    datosTarjeta();
                }
            }
        }
    })
}

//Funcion para pintar en el DOM los campos de "datos de la tarjeta"
function datosTarjeta() {
    divProductos.innerHTML = `
        <div class="seccionComprar2">
            <h3>Complete los datos para la entrega</h3>
            <div>
                <label for="numeroTarjeta" class="textoDireccion">Número de Tarjeta</label>
                <input type="text" id="numeroTarjeta" name="datosTarejta">
            </div>
            <div>
                <label for="codigoTarjeta" class="textoDireccion">Código de seguridad</label>
                <input type="text" id="codigoTarjeta" name="datosTarejta">
            </div>
            <div class="botonesCompra">
                <button class="btn boton" id="botonAtrasTarjeta">Atrás</button>
                <button class="btn boton" id="botonSiguienteTarjeta">Siguiente</button>
            </div>
        </div>
    `

    agregarFuncionAtrasTarjeta();
    agregarFuncionSiguienteTarjeta();
}
//Funcionalidad del boton para ir atras desde la sección de "datos de la tarjeta"
function agregarFuncionAtrasTarjeta() {
    botonAtrasTarjeta = document.querySelector("#botonAtrasTarjeta").addEventListener("click", () => {
        metodoPago();
    })
}

//Funcionalidad del boton de avanzar en el proceso de compra desde la seccion "datos de la tarjeta"
function agregarFuncionSiguienteTarjeta() {
    botonSiguienteTarjeta = document.querySelector("#botonSiguienteTarjeta").addEventListener("click", () => {
        const numeroTarjeta = document.querySelector("#numeroTarjeta").value
        numerosTarjeta = numeroTarjeta.slice(-4);
        resumenCompra();
    })
}

//Función para pintar en el DOM el resumen de la compra, con los productos, datos de envío, pago y valor total de la compra
function resumenCompra() {
    divProductos.innerHTML = `
    <div class="seccionComprar">
        <h3>¿Desea confirmar la compra?</h3>
        <div class="botonesCompra">
        <button id="botonAtrasResumen">Atrás</button>
        <button class="btnCancel" id="botoncancelCompra">Cancelar</button>
        <button class="btnFinal" id="botonFinalizarCompra">Finalizar compra</button>
        </div>
    </div>
`

    agregarFuncionAtrasResumen();
    agregarFuncionCancelarCompra();
    agregarFuncionFinalizarCompra();
}

//Funcionalidad para volver desde la sección "resumen de compra"
function agregarFuncionAtrasResumen() {
    botonAtrasResumen = document.querySelector("#botonAtrasResumen").addEventListener("click", () => {
        metodoPago();
    })
}

//Funcionalidad para volver desde la sección "resumen de compra"
function agregarFuncionCancelarCompra() {
    botoncancelCompra = document.querySelector("#botoncancelCompra").addEventListener("click", () => {
        contenidoTienda()
        divProductos.innerHTML = ""
        document.querySelector("#titulo").innerHTML = "Galeria";
        mostrarCarrito = false
        btnCarrito.disabled = false;
        btnCarrito.innerHTML = "Ver carrito";
        divCarrito.innerHTML = "";
    })
}
//Función del boton "finalizar compra". Procesa el pedido, simulando una carga, y devuelve un mensaje al ususario. Se vacia el carrito y se vuelve al inicio
function agregarFuncionFinalizarCompra() {
    botonFinalizarCompra = document.querySelector("#botonFinalizarCompra").addEventListener("click", () => {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Gracias por su compra',
            showConfirmButton: false,
            timer: 3500
        })
        divCarrito.innerHTML = "";
        divProductos.innerHTML = "";
        contenidoTienda();
        document.querySelector("#titulo").innerHTML = "Galeria";
        carrito.splice(0);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito = false
        btnCarrito.disabled = false;
        btnCarrito.innerHTML = "Ver carrito";
        divCarrito.innerHTML = "";
    })
}



//Ejecucion
contenidoTienda();
news();
confirm()