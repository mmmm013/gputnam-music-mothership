const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

// CONFIGURATION
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lbzpfqarraegkghxwbah.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_KEY) {
    console.error("❌ FATAL: No SUPABASE_SERVICE_ROLE_KEY found in .env.local");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const BUCKETS = ['gpm_source', 'audio_files', 'archive']; 
const TABLE = 'gpm_tracks';

const syncBucket = async (bucketName) => {
    console.log(`\n🔍 Scanning Bucket: [${bucketName}]...`);
    const { data: files, error } = await supabase.storage.from(bucketName).list();
    
    if (error) { console.log(`   ⚠️ Error: ${error.message}`); return; }
    if (!files || files.length === 0) { console.log(`   ⚠️ Bucket is empty.`); return; }

    console.log(`   Found ${files.length} files. Syncing...`);

    for (const file of files) {
        if (file.name.startsWith('.')) continue;

        const { data: publicData } = supabase.storage.from(bucketName).getPublicUrl(file.name);
        const cleanTitle = file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ");

        const { error: dbError } = await supabase
            .from(TABLE)
            .upsert({
                title: cleanTitle,
                artist: 'G Putnam Music',
                audio_url: publicData.publicUrl,
                season: null,
                mood: 'ALL'
            }, { onConflict: 'audio_url' });

        if (dbError) console.log(`   ❌ Failed: ${file.name}`);
        else process.stdout.write('.');
    }
    console.log(`\n   ✅ Bucket [${bucketName}] Done.`);
};

const runSync = async () => {
    console.log("🚀 STARTING AUDIO SYNC...");
    for (const bucket of BUCKETS) await syncBucket(bucket);
    console.log("\n🏁 SYNC COMPLETE.");
};

runSync();
