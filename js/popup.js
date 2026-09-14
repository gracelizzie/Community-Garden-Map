function initialisePopup() {

    document.getElementById("overlay")
        .addEventListener("click", (event) => {

            if (event.target.id === "overlay") {
                closePopup();
            }

        });

}


// Keep track of which feature is currently open
let currentFeatureId = null;


async function openPopup(featureId) {

    const popup = document.getElementById("popup");

    // Remember which feature we are editing
    currentFeatureId = featureId;

    // Get feature information
    const { data: feature, error: featureError } = await supabaseClient
        .from("garden_features")
        .select("*")
        .eq("id", featureId)
        .single();

    if (featureError) {
        console.error("Error loading feature:", featureError);
        return;
    }


    // Get updates for this feature
    const { data: updates, error: updatesError } = await supabaseClient
        .from("garden_updates")
        .select("*")
        .eq("feature_id", featureId)
        .order("created_at", { ascending: false });

    if (updatesError) {
        console.error("Error loading updates:", updatesError);
        return;
    }


    // Popup style
    popup.className = "";
    popup.classList.add(feature.type);


    // Emoji
    document.getElementById("popupEmoji").textContent =
        feature.emoji || "🌱";


    // Title
    document.getElementById("popupTitle").textContent =
        feature.name;


    // Currently growing
    const currentContents =
        document.getElementById("currentContents");

    if (feature.type === "bed") {

        currentContents.textContent =
            feature.current_contents
                ? `Currently growing: ${feature.current_contents}`
                : "Currently growing: Nothing added yet";

        currentContents.style.display = "block";

    } else {

        currentContents.style.display = "none";

    }


    // Description
    document.getElementById("popupContent").innerHTML = `
        <p>${feature.description || "No information has been added yet."}</p>
    `;


    // Updates
    if (updates.length > 0) {

        const recentUpdates = updates.slice(0, 3);
        const olderUpdates = updates.slice(3);


        const createUpdateHTML = (update) => {

            const date = new Date(update.created_at)
                .toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                });


            return `
                <div class="update">

                    <div class="update-text">

                        <span class="update-date">
                            ${date}
                        </span>

                        ${update.content ? `
                            <span class="update-content">
                                ${update.content}
                            </span>
                        ` : ""}

                    </div>


                    ${update.photo_path ? `
                        <img
                            class="update-photo"
                            src="${supabaseClient.storage
                                .from("garden-photos")
                                .getPublicUrl(update.photo_path)
                                .data.publicUrl}"
                            alt="Garden update"
                        >
                    ` : ""}

                </div>
            `;
        };


        const recentHTML = recentUpdates
            .map(createUpdateHTML)
            .join("");


        const olderHTML = olderUpdates
            .map(createUpdateHTML)
            .join("");


        document.getElementById("popupContent").innerHTML += `

            <div id="popupUpdates">

                <h3>Recent updates</h3>

                ${recentHTML}

                ${olderUpdates.length > 0 ? `

                    <button id="olderUpdatesButton">
                        View older updates
                    </button>

                    <div id="olderUpdates" class="hidden">
                        ${olderHTML}
                    </div>

                ` : ""}

            </div>

        `;


        // Older updates button
        const olderButton =
            document.getElementById("olderUpdatesButton");


        if (olderButton) {

            olderButton.addEventListener("click", () => {

                const older =
                    document.getElementById("olderUpdates");

                older.classList.remove("hidden");

                olderButton.classList.add("hidden");

            });

        }

    }


    // Make sure update form is hidden
    document.getElementById("updateForm")
        .classList.add("hidden");


    // Make sure normal popup is visible
    document.getElementById("popupContent")
        .classList.remove("hidden");

    document.getElementById("popupActions")
        .classList.remove("hidden");


    // Show popup
    document.getElementById("overlay")
        .classList.remove("hidden");
}



// Add update button

document.getElementById("addUpdateButton")
    .addEventListener("click", () => {

        // Just show the form over the popup.
        // Do NOT hide the popup underneath.

        document.getElementById("updateForm")
            .classList.remove("hidden");

    });



// Cancel update

document.getElementById("cancelUpdateButton")
    .addEventListener("click", () => {

        document.getElementById("updateForm")
            .classList.add("hidden");

        // Clear form
        document.getElementById("updateText").value = "";
        document.getElementById("updatePhoto").value = "";

    });



// SAVE UPDATE

document.getElementById("saveUpdateButton")
    .addEventListener("click", async () => {

        const saveButton =
            document.getElementById("saveUpdateButton");

        const text =
            document.getElementById("updateText")
                .value
                .trim();

        const photoInput =
            document.getElementById("updatePhoto");

        const photo =
            photoInput.files[0];


        // Require either text or photo
        if (!text && !photo) {

            alert("Please add some text or choose a photo.");

            return;
        }


        // Make sure we know which feature this update belongs to
        if (!currentFeatureId) {

            console.error("No feature selected.");

            return;
        }


        // Prevent double-clicking
        saveButton.disabled = true;
        saveButton.textContent = "Saving...";


        let photoPath = null;


        try {

            // Upload photo if one was selected
            if (photo) {

                const fileExtension =
                    photo.name.split(".").pop();

                const fileName =
                    `${Date.now()}-${Math.random()
                        .toString(36)
                        .substring(2)}.${fileExtension}`;


                photoPath = fileName;


                const { error: uploadError } =
                    await supabaseClient.storage
                        .from("garden-photos")
                        .upload(photoPath, photo);


                if (uploadError) {

                    throw uploadError;
                }

            }


            // Save update to database
            const { error: insertError } =
                await supabaseClient
                    .from("garden_updates")
                    .insert({

                        feature_id: currentFeatureId,

                        content: text || null,

                        photo_path: photoPath

                    });


            if (insertError) {

                throw insertError;
            }


            // Clear form
            document.getElementById("updateText").value = "";
            document.getElementById("updatePhoto").value = "";


            // Hide form
            document.getElementById("updateForm")
                .classList.add("hidden");


            // Reload popup so the new update appears
            await openPopup(currentFeatureId);


        } catch (error) {

            console.error("Error saving update:", error);

            alert(
                "Sorry, the update could not be saved. " +
                "Please check the console for more information."
            );

        } finally {

            saveButton.disabled = false;
            saveButton.textContent = "Save update";

        }

    });



function closePopup() {

    // Close popup
    document.getElementById("overlay")
        .classList.add("hidden");


    // Close update form
    document.getElementById("updateForm")
        .classList.add("hidden");


    // Clear form
    document.getElementById("updateText").value = "";
    document.getElementById("updatePhoto").value = "";

}
