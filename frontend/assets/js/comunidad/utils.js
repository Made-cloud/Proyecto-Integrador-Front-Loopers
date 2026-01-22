// --- FUNCIONES DE AYUDA ---

// Esta función calcula cuánto tiempo pasó desde la publicación hasta ahora.
// Devuelve un texto amigable como "hace 5 minutos" o "hace 1 día".
export function calcularTiempoRelativo(fechaTimestamp) {
    const ahora = Date.now();
    const diferencia = ahora - fechaTimestamp;

    // Convertimos milisegundos a segundos, minutos, etc.
    const segundos = Math.floor(diferencia / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    const meses = Math.floor(dias / 30);
    const anios = Math.floor(dias / 365);

    if (segundos < 60) return "hace unos instantes";
    else if (minutos < 60) return `hace ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;
    else if (horas < 24) return `hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
    else if (dias < 30) return `hace ${dias} ${dias === 1 ? 'día' : 'días'}`;
    else if (meses < 12) return `hace ${meses} ${meses === 1 ? 'mes' : 'meses'}`;
    else return `hace ${anios} ${anios === 1 ? 'año' : 'años'}`;
}