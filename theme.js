// Código para gestionar el sistema de temas al estilo GitHub
document.addEventListener('DOMContentLoaded', function() {
    // Sistema de temas
    const htmlElement = document.documentElement;
    const syncOption = document.getElementById('syncOption');
    const lightTheme = document.getElementById('lightTheme');
    const darkTheme = document.getElementById('darkTheme');
    const lightSelect = document.getElementById('lightSelect');
    const darkSelect = document.getElementById('darkSelect');
    const syncDescription = document.getElementById('syncDescription');
    
    // Verificar preferencia guardada
    const savedTheme = localStorage.getItem('theme');
    const savedSync = localStorage.getItem('syncWithSystem');
    
    // Función para actualizar la UI basada en el tema
    function updateThemeUI(theme) {
        if (theme === 'dark') {
            htmlElement.setAttribute('data-theme', 'dark');
            lightSelect.classList.remove('active');
            darkSelect.classList.add('active');
        } else {
            htmlElement.removeAttribute('data-theme');
            lightSelect.classList.add('active');
            darkSelect.classList.remove('active');
        }
    }
    
    // Función para detectar preferencia del sistema
    function getSystemTheme() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    // Inicializar tema
    if (savedSync === 'true') {
        // Sincronizar con sistema
        syncOption.classList.add('active');
        syncDescription.textContent = 'Penny Juice se adaptará automáticamente a la configuración de tu sistema.';
        updateThemeUI(getSystemTheme());
    } else {
        // Usar preferencia guardada o tema claro por defecto
        updateThemeUI(savedTheme || 'light');
        syncOption.classList.remove('active');
        syncDescription.textContent = 'Selecciona manualmente tu tema preferido.';
    }
    
    // Evento para sincronizar con sistema
    syncOption.addEventListener('click', function() {
        const isSync = syncOption.classList.toggle('active');
        localStorage.setItem('syncWithSystem', isSync);
        
        if (isSync) {
            syncDescription.textContent = 'Penny Juice se adaptará automáticamente a la configuración de tu sistema.';
            updateThemeUI(getSystemTheme());
        } else {
            syncDescription.textContent = 'Selecciona manualmente tu tema preferido.';
        }
    });
    
    // Eventos para selección manual de tema
    lightTheme.addEventListener('click', function() {
        if (syncOption.classList.contains('active')) {
            syncOption.classList.remove('active');
            localStorage.setItem('syncWithSystem', false);
            syncDescription.textContent = 'Selecciona manualmente tu tema preferido.';
        }
        localStorage.setItem('theme', 'light');
        updateThemeUI('light');
    });
    
    darkTheme.addEventListener('click', function() {
        if (syncOption.classList.contains('active')) {
            syncOption.classList.remove('active');
            localStorage.setItem('syncWithSystem', false);
            syncDescription.textContent = 'Selecciona manualmente tu tema preferido.';
        }
        localStorage.setItem('theme', 'dark');
        updateThemeUI('dark');
    });
    
    // Detectar cambios en la preferencia del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (syncOption.classList.contains('active')) {
            updateThemeUI(e.matches ? 'dark' : 'light');
        }
    });
});