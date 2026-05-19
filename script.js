// --- INITIALISATION ---
let userRole = "employe";
let logs = [];

// --- GESTION CONNEXION ---
document.getElementById('btn-login').addEventListener('click', () => {
    const pass = document.getElementById('password-input').value;
    userRole = document.getElementById('role-select').value;

    if (pass.length < 4) {
        document.getElementById('login-error').textContent = "Clé trop courte (min 4).";
        return;
    }

    // Affichage Dashboard
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('dashboard-page').style.display = 'flex';
    document.getElementById('user-badge').textContent = userRole.toUpperCase();
    document.getElementById('param-role').textContent = userRole.toUpperCase();

    // Restriction Admin
    if (userRole === "admin") {
        document.getElementById('menu-historique').style.display = 'block';
    } else {
        document.getElementById('menu-historique').style.display = 'none';
    }

    addLog("Authentification", "Succès");
});

// --- NAVIGATION ---
const links = document.querySelectorAll('.nav-links li');
links.forEach(link => {
    link.addEventListener('click', () => {
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
        document.getElementById(link.getAttribute('data-target')).style.display = 'block';
    });
});

// --- CHIFFREMENT ---
let mode = "encrypt";
document.getElementById('mode-encrypt').onclick = () => { mode = "encrypt"; updateToggle(); };
document.getElementById('mode-decrypt').onclick = () => { mode = "decrypt"; updateToggle(); };

function updateToggle() {
    document.getElementById('mode-encrypt').classList.toggle('active', mode === "encrypt");
    document.getElementById('mode-decrypt').classList.toggle('active', mode === "decrypt");
}

document.getElementById('btn-process').onclick = () => {
    const text = document.getElementById('text-input').value;
    const key = document.getElementById('secret-key').value;

    if (!text || !key) return alert("Remplissez les champs !");

    try {
        if (mode === "encrypt") {
            const res = CryptoJS.AES.encrypt(text, key).toString();
            document.getElementById('text-output').value = res;
            addLog("Chiffrement", "OK");
        } else {
            const res = CryptoJS.AES.decrypt(text, key).toString(CryptoJS.enc.Utf8);
            if (!res) throw new Error();
            document.getElementById('text-output').value = res;
            addLog("Déchiffrement", "OK");
        }
    } catch (e) {
        document.getElementById('text-output').value = "ERREUR : Clé incorrecte.";
        addLog("Cryptanalyse", "ÉCHEC");
    }
};

// --- TÉLÉCHARGEMENT ---
document.getElementById('btn-download').onclick = () => {
    // 1. On récupère le texte chiffré/déchiffré (ajuste 'text-output' si tu as nommé ta variable autrement dans ton code)
    // Si tu stockes le résultat dans une variable globale (ex: resultatGlobal), utilise-la ici !
    const content = document.getElementById('text-output') ? document.getElementById('text-output').value : "" ;
    
    // Si le contenu est vide, on essaie de récupérer ce qui a été traité pour le fichier
    // Remplace 'resultatFichier' par le nom de la variable où tu as mis le résultat AES du PDF
    const dataToDownload = content || window.resultatFichier; 

    if (!dataToDownload) {
        alert("Aucun fichier traité à télécharger !");
        return;
    }

    // 2. Création du Blob (On force l'extension d'origine ou .txt pour le test)
    const blob = new Blob([dataToDownload], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    
    // Donne un nom dynamique au fichier téléchargé
    a.download = "fichier_traite.pdf"; // Tu peux changer l'extension selon le besoin (.txt, .pdf...)
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    addLog("Export Fichier", "Téléchargé");
};

// --- SYSTÈME DE LOGS (HISTORIQUE) ---
function addLog(action, etat) {
    const now = new Date();
    const time = now.getHours() + ":" + now.getMinutes().toString().padStart(2, '0');
    
    logs.unshift({ time, user: userRole, action, etat }); // Ajoute au début

    const tbody = document.getElementById('log-tbody');
    tbody.innerHTML = logs.map(l => `
        <tr>
            <td>${l.time}</td>
            <td style="text-transform:uppercase; font-size:12px;">${l.user}</td>
            <td>${l.action}</td>
            <td style="color: ${l.etat === 'OK' || l.etat === 'Succès' ? '#10b981' : '#ef4444'}">${l.etat}</td>
        </tr>
    `).join('');
}

// Déconnexion
document.getElementById('btn-logout').onclick = () => location.reload();