document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const btnTrack = document.getElementById('btnTrack');
    const trackInput = document.getElementById('trackInput');
    const infoTracking = document.getElementById('info-tracking');
    
    if (!btnTrack || !trackInput) {
        console.error('Elementos del tracking no encontrados');
        return;
    }
    
    // Función para crear resultados de tracking
    function crearResultadosTracking(trackingNumber) {
        return `
            <div class="tracking-results visible">
                <div class="tracking-status">
                    <h4><i class="fas fa-box"></i> Envío #${trackingNumber}</h4>
                    <p class="status-actual"><strong>Estado actual:</strong> En tránsito internacional</p>
                    
                    <div class="status-timeline">
                        <div class="status-step completed">
                            <div class="step-icon"><i class="fas fa-check"></i></div>
                            <div class="step-info">
                                <h5>Envío recibido</h5>
                                <p>15/03/2024 - 10:30 AM</p>
                                <p>Centro de distribución Santiago, Chile</p>
                            </div>
                        </div>
                        
                        <div class="status-step completed">
                            <div class="step-icon"><i class="fas fa-check"></i></div>
                            <div class="step-info">
                                <h5>Procesado en aduana</h5>
                                <p>16/03/2024 - 14:15 PM</p>
                                <p>Aduana Arturo Merino Benítez</p>
                            </div>
                        </div>
                        
                        <div class="status-step active">
                            <div class="step-icon"><i class="fas fa-plane"></i></div>
                            <div class="step-info">
                                <h5>En vuelo internacional</h5>
                                <p>17/03/2024 - 08:20 AM</p>
                                <p>Vuelo LA705 a Madrid, España</p>
                            </div>
                        </div>
                        
                        <div class="status-step pending">
                            <div class="step-icon"><i class="fas fa-warehouse"></i></div>
                            <div class="step-info">
                                <h5>Llegada a destino</h5>
                                <p>Estimado: 18/03/2024</p>
                                <p>Aeropuerto Adolfo Suárez Madrid-Barajas</p>
                            </div>
                        </div>
                        
                        <div class="status-step pending">
                            <div class="step-icon"><i class="fas fa-truck"></i></div>
                            <div class="step-info">
                                <h5>Entrega final</h5>
                                <p>Estimado: 19/03/2024</p>
                                <p>Entrega al destinatario en Madrid</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="tracking-info">
                        <div class="info-card">
                            <h5><i class="fas fa-info-circle"></i> Información del envío</h5>
                            <div class="info-grid">
                                <div class="info-item">
                                    <span class="info-label">Origen:</span>
                                    <span class="info-value">Santiago, Chile</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Destino:</span>
                                    <span class="info-value">Madrid, España</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Peso:</span>
                                    <span class="info-value">15.5 kg</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Transportista:</span>
                                    <span class="info-value">Exportify Express</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Función para rastrear envío
    function rastrearEnvio() {
        const trackingNumber = trackInput.value.trim();
        
        if (!trackingNumber) {
            alert('Por favor, introduce un número de seguimiento');
            trackInput.focus();
            return;
        }
        
        // Validar formato básico
        if (trackingNumber.length < 8) {
            alert('El número de seguimiento debe tener al menos 8 caracteres');
            return;
        }
        
        // Cambiar texto del botón y deshabilitar temporalmente
        const originalText = btnTrack.textContent;
        btnTrack.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Rastreando...';
        btnTrack.disabled = true;
        
        // Simular demora de red
        setTimeout(() => {
            // Eliminar resultados anteriores
            const oldResults = document.querySelector('.tracking-results');
            if (oldResults) {
                oldResults.remove();
            }
            
            // Crear y agregar nuevos resultados
            const resultadosHTML = crearResultadosTracking(trackingNumber);
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = resultadosHTML;
            const nuevosResultados = tempDiv.firstElementChild;
            
            infoTracking.appendChild(nuevosResultados);
            
            // Restaurar botón
            btnTrack.textContent = originalText;
            btnTrack.disabled = false;
            
            // Desplazar hacia los resultados
            nuevosResultados.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
            
        }, 1500); // Simular 1.5 segundos de espera
    }
    
    // Event Listeners
    btnTrack.addEventListener('click', rastrearEnvio);
    
    trackInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            rastrearEnvio();
        }
    });


    
    // Interactividad para cursos
    const cursoButtons = document.querySelectorAll('.curso-card:not(.bloqueado) button:not(:disabled)');
    
    cursoButtons.forEach(button => {
        button.addEventListener('click', function() {
            const cursoCard = this.closest('.curso-card');
            const cursoTitle = cursoCard.querySelector('h4').textContent;
            
            alert(`Iniciando: ${cursoTitle}\n\nRedirigiendo a la plataforma de aprendizaje...`);
            
            // Aquí iría la lógica para redirigir al curso
            // window.location.href = `/curso/${cursoId}`;
        });
    });
    
    // Mostrar detalles de logros
    const logroCards = document.querySelectorAll('.logro-card');
    
    logroCards.forEach(card => {
        card.addEventListener('click', function() {
            const logroTitle = this.querySelector('h5').textContent;
            const logroDesc = this.querySelector('p').textContent;
            const isObtenido = this.classList.contains('obtenido');
            
            const status = isObtenido ? '¡Obtenido!' : 'Pendiente de obtener';
            const icon = isObtenido ? '🏆' : '🔒';
            
            alert(`${icon} ${logroTitle}\n\n${logroDesc}\n\nEstado: ${status}`);
        });
    });
});