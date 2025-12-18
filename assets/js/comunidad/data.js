// --- DATOS DE PRUEBA ---
// Aquí simulamos la información que normalmente vendría de una base de datos real.
// Usamos "export" para poder usar esta variable en otros archivos.

export const usuariosSeguidos = [
    { id: 101, nombre: "Madelaine Reyes", avatar: "https://i.pravatar.cc/150?img=32" },
    { id: 102, nombre: "Noemí Bontá", avatar: "https://i.pravatar.cc/150?img=9" },
    { id: 103, nombre: "Oscar Chávez", avatar: "https://i.pravatar.cc/150?img=59" },
    { id: 104, nombre: "Dev Team", avatar: "https://i.pravatar.cc/150?img=60" }
];

export const baseDeDatos = [
    {
        id: 1,
        usuario: "Madelaine Reyes",
        avatar: "https://i.pravatar.cc/150?img=32",
        // Restamos tiempo al Date.now() para simular que fue hace 2 horas
        timestamp: Date.now() - (2 * 60 * 60 * 1000), 
        contenido: "¡Hola equipo! Acabo de subir los nuevos wireframes. 🚀",
        imagen: null,
        likes: 12,
        meGusta: false, // Indica si yo le di like
        comentarios: [
            { 
                usuario: "Roberto", 
                texto: "¡Genial, los reviso ahora!", 
                timestamp: Date.now() - (1 * 60 * 60 * 1000) 
            },
            { 
                usuario: "Ana", 
                texto: "Quedaron muy buenos Made.", 
                timestamp: Date.now() - (30 * 60 * 1000) 
            }
        ]
    },
    {
        id: 2,
        usuario: "Oscar Chávez",
        avatar: "https://i.pravatar.cc/150?img=59",
        timestamp: Date.now() - (5 * 60 * 1000), // Hace 5 min
        contenido: "Estuve revisando la API de aduanas. ¡Tiene buena pinta! 📦",
        imagen: null,
        likes: 5,
        meGusta: true,
        comentarios: [] 
    }
];