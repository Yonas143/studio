import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
    const images = JSON.stringify([
        '/bale/IMAGE 2026-03-28 17:28:33.jpg',
        '/bale/IMAGE 2026-03-28 17:28:41.jpg',
        '/bale/IMAGE 2026-03-28 17:28:46.jpg',
        '/bale/IMAGE 2026-03-28 17:28:51.jpg',
        '/bale/IMAGE 2026-03-28 17:28:55.jpg',
        '/bale/IMAGE 2026-03-28 17:28:59.jpg',
    ]);

    const content = `
<p>Bale Mountains National Park is located in the south eastern part of Ethiopia, 400 km southeast of Addis Ababa. The park stretches over 2,400 sq kms primarily featuring the Harenna Escarpment and Forest and the Sanetti Plateau.</p>

<p>The area is well known for its incredible diversity of wildlife. The most well known animal that calls Bale home is the endangered Red and White Ethiopian Wolf. There are great diversity of other animals, which include the Mountain Nyala — a large horned antelope — the Bale Monkey, and the Forest Hog, allegedly the world's largest swine.</p>

<p>Bale is also recognized as one of the African continent's top five places to find exotic birds, with six endemic species and 11 other geographically unique species. Bale is known to support the only known sub-Saharan birding populations of Golden Eagle, Ruddy Shelduck, and Red-billed Chough.</p>

<p>In addition to its wonderful range of wildlife, Bale Mountains National Park is an extremely important area of biodiversity. The area is also known for its lush evergreen forests and woodland, bamboo groves, moorlands, rivers and waterfalls, as well as an abundance of grassland providing the ideal habitat for a range of animals and birds.</p>

<p>Bale's 1,300-plus plant species include 160 Ethiopian endemics and 23 unique to the park. Bale is an excellent place for hiking and mule or horseback treks as part of a unique and colorful Safari across this beautiful and diverse region.</p>
    `.trim();

    const { data, error } = await supabase
        .from('CulturalInsight')
        .insert([{
            title: 'Bale Mountains National Park',
            content,
            imageUrl: images,
            isPublished: true,
        }])
        .select()
        .single();

    if (error) {
        console.error('Error:', error.message);
    } else {
        console.log('✅ Bale Mountains insight created:', data.id);
    }
}

main();
