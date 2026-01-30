// find_snippets.js
const { supabase } = require("../utils/supabaseClient.js"); // adjust path if needed

async function search() {
  // Search for 'snippet' in title, tags, or filename
  const { data, error } = await supabase
    .from("tracks")
    .select("id, name, title, tags, duration")
    .or("title.ilike.%snippet%,tags.ilike.%snippet%,name.ilike.%snippet%");

  if (error) {
    console.error("Error:", error);
  } else {
    console.log(`FOUND ${data.length} SNIPPET ASSETS:`);
    data.forEach((t) =>
      console.log(`- [${t.id}] ${t.title || t.name} (Tags: ${t.tags})`)
    );
  }
}

search();
