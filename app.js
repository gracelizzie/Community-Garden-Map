fetch("assets/garden.svg")
    .then(response => response.text())
    .then(svg => {

        document.getElementById("map").innerHTML = svg;

        console.log("SVG loaded");

        enableZoom();

        initialiseMap();

    });


function initialiseMap() {

    console.log("Initialising map...");

    const vectors = document.querySelectorAll("#vectors > *");

    console.log(vectors);
    console.log(`Found ${vectors.length} clickable objects`);


    vectors.forEach(feature => {

        console.log(feature.id);

        feature.style.cursor = "pointer";


        feature.addEventListener("click", () => {

            openPopup(feature.id);

        });

    });


    // Close button

    document.getElementById("closePopup")
        .addEventListener("click", () => {

            closePopup();

        });


    // Click outside popup

    document.getElementById("overlay")
        .addEventListener("click", (event) => {

            if (event.target.id === "overlay") {

                closePopup();

            }

        });

}


function openPopup(featureId) {

    document.getElementById("popupTitle").textContent =
        featureId;


    document.getElementById("popupContent").innerHTML = `
        <p>to be added.</p>
        <p>empty :(</p>
    `;


    document.getElementById("overlay")
        .classList.remove("hidden");

}


function closePopup() {

    document.getElementById("overlay")
        .classList.add("hidden");

}

function enableZoom() {

    const svg = document.querySelector("#map svg");

    const panzoom = Panzoom(svg, {
        maxScale: 5,
        minScale: 0.5,
        contain: "outside"
    });


    svg.parentElement.addEventListener("wheel", panzoom.zoomWithWheel);

}