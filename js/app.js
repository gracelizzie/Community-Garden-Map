fetch("assets/garden.svg")
    .then(response => response.text())
    .then(svg => {

        document.getElementById("map").innerHTML = svg;

        console.log("SVG loaded");

        enableZoom();

        initialiseMap();

        initialiseLayers();

        initialisePopup();

    });