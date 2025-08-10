document.querySelectorAll('.ellipsis-btn').forEach(btn => {
    btn.addEventListener('click', e => {
        const popup = btn.nextElementSibling;
        const isVisible = popup.style.display === 'block';

        // Cerrar todos los popups abiertos
        document.querySelectorAll('.action-popup').forEach(p => p.style.display = 'none');

        if (!isVisible) popup.style.display = 'block';
        else popup.style.display = 'none';
    });
});

// Cerrar popup si se hace click afuera
document.addEventListener('click', e => {
    if (!e.target.closest('.action-cell')) {
        document.querySelectorAll('.action-popup').forEach(p => p.style.display = 'none');
    }
});