let map;
let service;
let infowindow;

function initMap() {
    // Tenta obter a localização do usuário
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // Inicializa o mapa centrado na localização do usuário
            map = new google.maps.Map(document.getElementById("map"), {
                center: userLocation,
                zoom: 12
            });

            infowindow = new google.maps.InfoWindow();

            // Procura por hemocentros próximos usando a Places API
            const request = {
                location: userLocation,
                radius: 10000, // 10 km de raio
                keyword: 'hemocentro'
            };

            service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request, handleResults);
        }, () => {
            alert("Não foi possível obter sua localização.");
        });
    } else {
        alert("Geolocalização não é suportada pelo seu navegador.");
    }
}

function handleResults(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        results.forEach(place => {
            createMarker(place);
        });
    } else {
        alert("Não foi possível encontrar hemocentros próximos.");
    }
}

function createMarker(place) {
    const marker = new google.maps.Marker({
        map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', () => {
        infowindow.setContent(`<strong>${place.name}</strong><br>${place.vicinity}`);
        infowindow.open(map, marker);
    });
}
