function initialiseLayers() {

    const treeLayer = document.getElementById("Trees");

    const button = document.getElementById("toggleTrees");

    let visible = true;

    button.addEventListener("click", () => {

        visible = !visible;

        treeLayer.style.display =
            visible ? "inline" : "none";

        button.textContent =
            visible ? "Hide trees" : "Show trees";

    });

}