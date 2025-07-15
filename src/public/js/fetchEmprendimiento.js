const fakeData = [
    { _id: "1", titulo: "Producto A", descripcion: "Este es el producto A" },
    { _id: "2", titulo: "Producto B", descripcion: "Este es el producto B" },
    { _id: "3", titulo: "Producto C", descripcion: "Este es el producto C" }
]

const params = new URLSearchParams(window.location.search)
const id = params.get('id')

if (!id) {
    document.getElementById('title').textContent = 'Falta el ID en la URL (?id=1)'
} else {
    const data = fakeData.find(item => item._id === id)

    if (!data) {
    document.getElementById('title').textContent = 'Contenido no encontrado'
    } else {
    document.getElementById('title').textContent = data.titulo
    document.getElementById('content').textContent = data.descripcion
    }
}