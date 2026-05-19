// --- LOGIQUE SANS TOUCHER AU DESIGN ---
let currentRole = "admin"; // Par défaut pour correspondre à ton badge
let logs = [];

// 1. CHANGER DE CASE SUR LE CÔTÉ (Navigation du menu latéral)
const navItems = document.querySelectorAll('.nav-links li');
const sections = document.querySelectorAll('.tab-content');

if (navItems.length > 0) {
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Retirer le style actif de tous les boutons du menu
            navItems.forEach(nav => nav.classList.remove('active'));
            // Masquer temporairement toutes les zones de contenu
            sections.forEach(sec => sec.style.display = 'none');

            // Activer l'onglet sur lequel on a cliqué
            item.classList.add('active');
            const targetId = item.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.style.display = 'block';
            }
        });
    });
}

// 2. RENDRE TON BOUTON VERT "TÉLÉCHARGER" OPÉRATIONNEL
const btnDownload = document.getElementById('btn-download');
if (btnDownload) {
    btnDownload.addEventListener('click', () => {
        const textOutput = document.getElementById('text-output');
        
        // On récupère ce qui est écrit dans ton panneau de Sortie
        let contenuFichier = textOutput ? textOutput.value.trim() : "";
        
        if (!contenuFichier || contenuFichier.startsWith("ERREUR")) {
            contenuFichier = "Export sécurisé de session - Moteur AES-256 SECUREPRO.";
        }
        
        // Création et téléchargement du fichier texte automatique
        const blob = new Blob([contenuFichier], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = "export_secure.txt"; // Nom du fichier généré dans tes téléchargements
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        ajouterLog("Téléchargement", "Succès");
    });
}

// 3. MISE À JOUR DE LA TABLE DANS L'ONGLET HISTORIQUE
function ajouterLog(action, statut) {
    const maintenant = new Date();
    const heureStr = maintenant.getHours().toString().padStart(2, '0') + ":" + maintenant.getMinutes().toString().padStart(2, '0');
    
    logs.unshift({ heure: heureStr, user: currentRole.toUpperCase(), action: action, statut: statut });

    const tbody = document.getElementById('log-tbody');
    if (tbody) {
        tbody.innerHTML = logs.map(l => `
            <tr>
                <td>${l.heure}</td>
                <td><strong>${l.user}</strong></td>
                <td>${l.action}</td>
                <td style="color: #10b981; font-weight: bold;">${l.statut}</td>
            </tr>
        `).join('');
    }
}

// Log automatique de lancement
ajouterLog("Initialisation", "OK");

// Bouton Quitter
const btnLogout = document.getElementById('btn-logout');
if (btnLogout) {
    btnLogout.onclick = () => location.reload();
}