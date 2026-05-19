let logs = [];

// 1. CHANGER DE CASE SUR LE COTÉ (Navigation des onglets)
const navItems = document.querySelectorAll('.nav-links li');
const sections = document.querySelectorAll('.tab-content');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(nav => nav.classList.remove('active'));
        sections.forEach(sec => sec.style.display = 'none');

        item.classList.add('active');
        const targetId = item.getAttribute('data-target');
        document.getElementById(targetId).style.display = 'block';
    });
});

// 2. RENDRE LE BOUTON TÉLÉCHARGER OPÉRATIONNEL
const btnDownload = document.getElementById('btn-download');
if (btnDownload) {
    btnDownload.addEventListener('click', () => {
        const contenuFichier = "Contenu sécurisé et déchiffré via l'algorithme AES-256.";
        
        const blob = new Blob([contenuFichier], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = "DEVIS_TRAITE.txt";
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        ajouterLog("Téléchargement", "Succès");
    });
}

// 3. LOGS AUTOMATIQUES POUR L'HISTORIQUE
function ajouterLog(action, statut) {
    const maintenant = new Date();
    const heureStr = maintenant.getHours().toString().padStart(2, '0') + ":" + maintenant.getMinutes().toString().padStart(2, '0');
    
    logs.unshift({ heure: heureStr, user: "ADMIN", action: action, statut: statut });

    const tbody = document.getElementById('log-tbody');
    if (tbody) {
        tbody.innerHTML = logs.map(l => `
            <tr>
                <td>${l.heure}</td>
                <td><strong>${l.user}</strong></td>
                <td>${l.action}</td>
                <td style="color: #00b0ff; font-weight: bold;">${l.statut}</td>
            </tr>
        `).join('');
    }
}

// Log initial au démarrage du site
ajouterLog("Démarrage", "OK");

// Bouton quitter
document.getElementById('btn-logout').onclick = () => location.reload();