function efectoLatido() {
        setInterval(() => {
            ceoName.style.transform = 'scale(1.1)';
            ceoName.style.transition = 'transform 0.3s ease';
            
            setTimeout(() => {
                ceoName.style.transform = 'scale(1)';
            }, 300);
        }, 2000);
    }