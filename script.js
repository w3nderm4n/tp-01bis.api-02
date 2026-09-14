// ============================================
// INITIALISATION DE LA CARTE
// ============================================

const map = L.map("map").setView([46.1603, -1.1511], 14);

// ============================================
// FOND DE CARTE
// ============================================

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 20,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// ============================================
// URL DES DONNÉES
// ============================================

const url =
  "https://opendata.agglo-larochelle.fr/d4c/api/records/1.0/search/dataset=domaine_public_-_terrasses_mobiliers_structures&resource_id=9635007c-ab14-4c6c-8c3e-a00a28381d28&facet=type_surface";

// ============================================
// RÉCUPÉRATION DES DONNÉES
// ============================================

fetch(url)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Erreur HTTP : " + response.status);
    }

    return response.json();
  })

  .then((data) => {
    console.log("Données reçues :", data);

    const records = data.records;

    console.log("Nombre de données :", records.length);

    records.forEach((record) => {
      const properties = record.fields;

      console.log("Données :", properties);

      // ============================================
      // RÉCUPÉRATION DES COORDONNÉES
      // ============================================

      const coordinates = properties.coordinates.split(",");

      const latitude = parseFloat(coordinates[0]);
      const longitude = parseFloat(coordinates[1]);

      // Vérification des coordonnées
      if (isNaN(latitude) || isNaN(longitude)) {
        console.warn("Coordonnées invalides :", properties);
        return;
      }

      // ============================================
      // RÉCUPÉRATION DES INFORMATIONS
      // ============================================

      const typeSurface = properties.type_surface || "Non renseigné";

      const exploitation = properties.exploit_annuelle || "Non renseigné";

      const enseigne =
        properties.enseigne_etablissement || "Établissement non renseigné";

      // ============================================
      // CRÉATION DU MARQUEUR
      // ============================================

      const marker = L.marker([latitude, longitude]);

      marker.addTo(map);

      // ============================================
      // POPUP
      // ============================================

      marker.bindPopup(`
                <div>
                    <h5>${enseigne}</h5>

                    <p>
                        <strong>Type de surface :</strong>
                        ${typeSurface}
                    </p>

                    <p>
                        <strong>Exploitation annuelle :</strong>
                        ${exploitation}
                    </p>

                    <p>
                        <strong>Latitude :</strong>
                        ${latitude}
                    </p>

                    <p>
                        <strong>Longitude :</strong>
                        ${longitude}
                    </p>
                </div>
            `);
    });
  })

  // ============================================
  // GESTION DES ERREURS
  // ============================================

  .catch((error) => {
    console.error("Erreur lors de la récupération des données :", error);

    alert("Impossible de récupérer les données.");
  });
