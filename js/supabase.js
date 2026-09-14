
const supabaseClient = window.supabase.createClient(
    "https://okvhhwhuuovhguzzdsxf.supabase.co",
    "sb_publishable_LKUAmGlURhtVHk0X7o1V0w_zXwLtqZf"
);

console.log("Supabase script loaded!");

async function testSupabase() {

    const { data, error } = await supabaseClient
        .from("garden_features")
        .select("*");

    console.log("Supabase data:", data);
    console.log("Supabase error:", error);
}

testSupabase();

async function testUpdates() {

    const { data, error } = await supabaseClient
        .from("garden_updates")
        .select("*");

    console.log("Garden updates:", data);
    console.log("Updates error:", error);
}

testUpdates();

async function testUpdates() {

    const { data, error } = await supabaseClient
        .from("garden_updates")
        .select("*");

    console.log("Garden updates:", data);
    console.log("Updates error:", error);
}

testUpdates();