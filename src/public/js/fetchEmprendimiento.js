document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/businesses')
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data)) {
        alert('Error al cargar emprendimientos');
        return;
      }

      const container = document.querySelector('.emprendimientos-container');
      if (!container) return;

      data.forEach(business => {
        const name = business.name || 'Sin nombre';
        const description = business.description || 'Sin descripción';
        const image = business.image || '/default-image.jpg';
        const id = business._id;
        const date = new Date(business.date).toLocaleDateString('es-CR', {
          year: 'numeric', month: 'long', day: 'numeric'
        });
        const ownerName = business.owner_name || 'Desconocido';
        const initials = ownerName.split(' ').map(w => w[0]).join('').toUpperCase();

        const card = document.createElement('a');
        card.href = `/emprendimiento/${id}`;
        card.classList.add('emprendimiento-element', 'card');

        card.innerHTML = `
          <img src="${image}" alt="${name}" />
          <div class="emprendimiento-info">
            <h3>${name}</h3>
            <p>${description}</p>
            <div class="dueño">
              <div class="avatar">${initials}</div>
              <span>${ownerName}</span>
            </div>
            <span class="fecha">Fecha de creación: ${date}</span>
          </div>
        `;

        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error(err);
      alert('Error al obtener los emprendimientos');
    });
});
