var boolean = false; // Cambia esto a false para probar el otro caso

// Abre el menú cuando se hace clic en el ícono del menú
document.querySelector('.menu').addEventListener('click', function() {
    console.log('le dio click al menu');

    if(!boolean){
        document.getElementById('popupMenu').style.left = '0';
        boolean = true; // Cambia el valor de boolean a false
    }else{
        document.getElementById('popupMenu').style.left = '-100%';
        boolean = false; // Cambia el valor de boolean a true
    }
    
});

// Cierra el menú si se hace clic fuera del aside
document.addEventListener('click', function(e) {
    const popupMenu = document.getElementById('popupMenu');
    const menuButton = document.querySelector('.menu');
    
    // Si el clic no fue dentro del menú ni en el botón del menú
    if (!popupMenu.contains(e.target) && !menuButton.contains(e.target)) {
        popupMenu.style.left = '-100%';
        boolean = false; // Cambia el valor de boolean a true
    }
});
