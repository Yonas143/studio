import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
    const images = JSON.stringify([
        '/coffee/ethiopian-coffee.jpg',
        '/coffee/5348888b3542c098d80e0a1e5e4e7cf8_ethiopian_coffee_ceremony_the_coffee.jpg',
    ]);

    const content = `
<p>Ethiopian coffee is more than just a drink, it's a cultural treasure and a warm welcome to visitors passing through Addis Ababa. As the birthplace of coffee, Ethiopia offers travelers a chance to experience the rich aromas, bold flavors, and centuries-old traditions that define its coffee heritage.</p>

<p>Even during a short stopover, visitors can immerse themselves in the famous Ethiopian coffee ceremony, where freshly roasted beans are ground, brewed, and served with a sense of ritual and hospitality that reflects the heart of the nation.</p>

<p>Addis Ababa, with its vibrant cafés and traditional coffee houses, makes it easy for travelers to savor this experience between flights. From modern coffee lounges serving single-origin brews to bustling local spots where the air is filled with the scent of roasting beans, the city offers a perfect taste of Ethiopia's coffee culture.</p>

<p>A stopover here isn't just a pause in your journey, it's an opportunity to sip history, connect with locals, and carry a piece of Ethiopia's warmth with you.</p>
    `.trim();

    const { data, error } = await supabase
        .from('CulturalInsight')
        .insert([{
            title: 'Ethiopian Coffee as a Stopover Experience in Addis Ababa',
            content,
            imageUrl: images,
            isPublished: true,
        }])
        .select()
        .single();

    if (error) {
        console.error('Error:', error.message);
    } else {
        console.log('✅ Ethiopian Coffee insight created:', data.id);
    }
}

main();
