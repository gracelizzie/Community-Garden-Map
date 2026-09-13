function initialiseMap() {

    console.log("Initialising map...");


    const baseVectors =
        document.querySelectorAll("#base-vectors > *");


    const treeVectors =
        document.querySelectorAll("#tree-vectors > *");


    console.log(
        `Found ${baseVectors.length} base objects`
    );


    console.log(
        `Found ${treeVectors.length} tree objects`
    );


    addClickListeners(baseVectors);

    addClickListeners(treeVectors);

}



function addClickListeners(features) {


    features.forEach(feature => {


        console.log(feature.id);


        feature.style.cursor = "pointer";


        feature.addEventListener("click", () => {


            openPopup(feature.id);


        });


    });


}


function enableZoom() {

    const svg = document.querySelector("#map svg");

    const panzoom = Panzoom(svg, {
        maxScale: 5,
        minScale: 0.5,
        contain: "outside"
    });


    svg.parentElement.addEventListener(
        "wheel",
        panzoom.zoomWithWheel
    );

}