// --- INITIALISATION & STOCKAGE DE SESSiON ---
let logs = [];
// Simulation d'un fichier chiffré en mémoire globale pour l'exemple du bouton
window.resultatFichierTraite = "Données cryptées de session générées par l'algorithme AES-256...";

// --- SYSTEME DE NAVIGATION DU MENU LATÉRAL ---
const navItems = document.querySelectorAll('.nav-links li');
const sections = document.querySelectorAll('.tab-content');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        // Désactiver tous les onglets du menu
        navItems.forEach(nav => nav.classList.remove('active'));
        // Cacher toutes les vues de l'interface
        sections.forEach(sec => sec.style.display = 'none');

        // Activer l'onglet sélectionné
        item.classList.add('active');
        const targetId = item.getAttribute('data-target');
        document.getElementById(targetId).style.display = 'block';
    });
});

// --- PERMETTRE LE CLIC POUR SÉLECTIONNER UN VRAI FICHIER LOCAL ---
const dropZone = document.getElementById('drop-zone');
const filePicker = document.getElementById('file-picker');
const fileStatusText = document.getElementById('file-status-text');

dropZone.addEventListener('click', () => {
    filePicker.click();
});

filePicker.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        const nomFichier = e.target.files[0].name;
        fileStatusText.textContent = "Fichier chargé : " + nomFichier;
        ajouterLog("Import Fichier", "Fichier prêt (" + nomFichier + ")");
    }
});

// --- ENCLENCHEMENT DU TRAITEMENT CRYPTO ---
const btnProcess = document.getElementById('btn-process');
const resultStatusText = document.getElementById('result-status-text');

btnProcess.addEventListener('click', () => {
    const key = document.getElementById('secret-key').value.trim();

    if (!key) {
        alert("Veuillez saisir votre clé secrète de chiffrement !");
        return;
    }

    // Affichage de la réussite sur l'IHM
    resultStatusText.textContent = "Fichier traité avec succès (AES-256) !";
    resultStatusText.style.color = "#00b0ff";
    
    // Remplissage simulé pour le téléchargement
    window.resultatFichierTraite = "Fichier sécurisé avec succès via la clé de session.\n[Données de l'algorithme d'entreprise AES-256 bits]";

    ajouterLog("Exécution Crypto", "Succès");
    alert("Le traitement de fichier a été effectué ! Vous pouvez maintenant le télécharger.");
});

// --- REPARATION CRITIQUE : FONCTIONNEMENT DU BOUTON TÉLÉCHARGER ---
const btnDownload = document.getElementById('btn-download');

btnDownload.addEventListener('click', () => {
    const data = window.resultatFichierTraite;

    if (!data) {
        alert("Aucun fichier traité n'est disponible pour le téléchargement.");
        return;
    }

    // 1. Création du conteneur Blob virtuel en mémoire
    const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
    
    // 2. Attribution d'une adresse de téléchargement locale temporaire
    const url = URL.createObjectURL(blob);
    
    // 3. Liaison automatique à un élément HTML d'ancrage masqué
    const dummyLink = document.createElement('a');
    dummyLink.href = url;
    dummyLink.download = "export_sec_traite.txt"; // Nom du fichier qui sera créé dans les téléchargements Windows
    
    // 4. Déclenchement matériel du clic de téléchargement
    document.body.appendChild(dummyLink);
    dummyLink.click();
    
    // 5. Nettoyage et destruction de l'élément devenu inutile
    document.body.removeChild(dummyLink);
    URL.revokeObjectURL(url);

    ajouterLog("Téléchargement", "Fichier exporté");
});

// --- CRÉATION EN TEMPS RÉEL DE L'HISTORIQUE (LOGS) ---
function ajouterLog(action, statut) {
    const maintenant = new Date();
    const heureStr = maintenant.getHours().toString().padStart(2, '0') + ":" + maintenant.getMinutes().toString().padStart(2, '0');
    
    // Ajout dans la liste javascript
    logs.unshift({ heure: heureStr, user: "Admin", action: action, statut: statut });

    // Mise à jour visuelle du tableau HTML dans la section Historique
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

// Bouton Quitter (Recharge la session)
document.getElementById('btn-logout').addEventListener('click', () => {
    location.reload();
});

// Générer un premier log de démarrage à l'ouverture de la page
ajouterLog("Ouverture Session", "Initialisé");