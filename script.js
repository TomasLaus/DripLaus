// ------ CARRITO -------------------
const cards = document.getElementById('cards') 
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const table = document.getElementsByClassName('table').content
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}




document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        printCarrito()
    }
})
cards.addEventListener('click', e => {
    agregarCarrito(e)
})
items.addEventListener('click', e => {
    btnAccion(e)
})




const fetchData = async () => {
    try {
        const respuesta = await fetch('api.json')
        const datos = await respuesta.json()
        printCards(datos)
    } catch (error) {
        console.log(error)
    }
}

const printCards = datos => {
    datos.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.title
        templateCard.querySelector('p').textContent = producto.precio
        templateCard.querySelector('img').setAttribute('src', producto.thumbnailUrl)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id

        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

const agregarCarrito = e => {

    if (e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }

    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = {
        ...producto
    }

    printCarrito()
}

const printCarrito = () => {
    items.innerHTML = ''

    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio


        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    printFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const printFooter = () => {
    footer.innerHTML = ''


    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío</th>
        `
        return
    }

    const nCantidad = Object.values(carrito).reduce((acc, {
        cantidad
    }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {
        cantidad,
        precio
    }) => acc + cantidad * precio, 0)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        carrito = {}
        printCarrito()
    })
}

const btnAccion = e => {
    //Boton de aumentar
    if (e.target.classList.contains('btn-info')) {

        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {
            ...producto
        }
        printCarrito()
    }

    //Boton de restar
    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        }
        printCarrito()
    }

    e.stopPropagation()
}


const btnComprar = () => {
    const delay = alertify.get('notifier','delay');
    alertify.set('notifier','delay', 2);
    alertify.set('notifier','delay', delay);
    alertify.set('notifier','position', 'top-left');
    alertify.success('Agregado al carrito');
}



//Ver carrito
$("#BtnVerCarro").click(function() {
    $("#template-footer").fadeIn(1000);
    $("#template-carrito").fadeIn(1000);
    $(".table").fadeIn(1000);
    $("#iconCerrarCarro").fadeIn(1000);
    $("#aCerrarCarro").fadeIn(1000);
});


//Cerrar carrito
$("#aCerrarCarro").click(function() {
    $("#template-footer").fadeOut("2000");
    $("#template-carrito").fadeOut("2000");
    $(".table").fadeOut("2000");
});


                                       
//Confirmar compra
$("#FinalizarCompra").click(function() {
    
    if(Object.keys(carrito).length === 0){
        swal('Error', 'Su carrito está vacio', 'error')
    } else{
        carrito = {}
        printCarrito()
        swal('Gracias', 'Su compra ha sido realizada', 'success')
    }

})


