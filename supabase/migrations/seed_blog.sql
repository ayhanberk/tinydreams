-- Seed Blog Posts for TinyDreams
-- Run this in Supabase SQL Editor

INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, is_published, published_at) VALUES
(
    'Bebek Odası Dekorasyon Fikirleri', 
    'bebek-odasi-dekorasyon-fikirleri', 
    'Bebeğiniz için hem şık hem de fonksiyonel bir yaşam alanı yaratmanın püf noktaları.', 
    '# Bebek Odası Dekorasyon Fikirleri\n\nBebeğinizin odasını dekore ederken dikkat etmeniz gereken en önemli nokta, hem estetik hem de işlevsel bir alan yaratmaktır. Pastel tonlar, doğal ahşap mobilyalar ve yumuşak dokulu tekstil ürünleri ile bebeğinize huzurlu bir ortam hazırlayabilirsiniz.\n\n## 1. Renk Seçimi\nDoğal ve sakinleştirici renkler tercih edin. Bej, mint yeşili ve pudra pembesi gibi tonlar...', 
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1600&auto=format&fit=crop',
    true,
    now()
),
(
    'Bebeklerde Uyku Düzeni Nasıl Oluşturulur?', 
    'bebeklerde-uyku-duzeni', 
    'Yenidoğan ve bebeklerde sağlıklı uyku alışkanlıkları kazandırmak için ipuçları.', 
    '# Bebeklerde Uyku Düzeni\n\nUyku, bebeğinizin gelişimi için kritik öneme sahiptir. Düzenli bir uyku rutini oluşturmak, hem bebeğinizin hem de sizin yaşam kalitenizi artırır.\n\n## Uyku Arkadaşları\nGüvenli ve yumuşak uyku arkadaşları, bebeğinizin kendini güvende hissetmesine yardımcı olabilir.', 
    'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=1600&auto=format&fit=crop',
    true,
    now()
),
(
    'Organik Giyim Neden Önemli?', 
    'organik-giyim-neden-onemli', 
    'Bebeğinizin hassas cildi için neden sertifikalı organik ürünler tercih etmelisiniz?', 
    '# Organik Giyim ve Bebek Sağlığı\n\nBebek cildi yetişkinlere göre çok daha ince ve geçirgendir. Bu nedenle kimyasal içerikli boyalar ve sentetik kumaşlar, alerjik reaksiyonlara sebep olabilir.\n\nOrganik pamuk, üretiminde hiçbir zararlı kimyasal kullanılmadığı için bebeğinizin cildine dosttur.', 
    'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1600&auto=format&fit=crop',
    true,
    now()
);
