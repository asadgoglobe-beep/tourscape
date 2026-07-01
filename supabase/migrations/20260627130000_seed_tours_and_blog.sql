-- ============================================================
-- SEED DATA — Tripscape Adventures (idempotent)
-- 12 published UAE tours across all categories + blog categories
-- + sample articles. Safe to run multiple times (ON CONFLICT guards).
-- ============================================================

-- ---------- TOURS ----------
INSERT INTO public.tours
  (slug, title, summary, description, hero_image, gallery, price_adult, price_child,
   duration, location, category, highlights, inclusions, exclusions, itinerary, faqs,
   is_published, rating, reviews_count)
VALUES
-- 1. Evening Desert Safari
('evening-desert-safari',
 'Evening Desert Safari with BBQ Dinner',
 'Sunset dune bashing, camel rides, sandboarding and a live BBQ dinner under the stars.',
 'Our signature evening safari is the classic Dubai desert experience. Get picked up from your hotel in a 4×4 Land Cruiser, thunder over the red Lahbab dunes at golden hour, then settle into a Bedouin-style camp for an unlimited BBQ buffet, tanoura dance, fire show and belly dancing. Camel rides, sandboarding, henna and Arabic coffee are all included.',
 'https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1920&q=80',
 ARRAY['https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80'],
 99, 65, '6 hours', 'Lahbab Desert, Dubai', 'Desert Safari',
 ARRAY['Hotel pickup & drop-off in a 4×4','Thrilling dune bashing at sunset','Unlimited BBQ buffet (veg & non-veg)','Live tanoura, fire & belly-dance shows','Camel ride, sandboarding & henna'],
 ARRAY['Air-conditioned 4×4 transfers','Professional driver-guide','BBQ dinner buffet','Soft drinks, water, tea & coffee','All shows & desert activities'],
 ARRAY['Alcoholic beverages','Quad bike / dune buggy (add-on)','Personal expenses & tips'],
 '[{"time":"15:30","title":"Hotel pickup","desc":"Driver collects you from your Dubai hotel lobby."},{"time":"16:30","title":"Dune bashing","desc":"45 minutes of 4×4 thrills over the Lahbab dunes."},{"time":"17:30","title":"Sunset & activities","desc":"Sandboarding, camel rides and desert photos at golden hour."},{"time":"18:30","title":"Camp & dinner","desc":"BBQ buffet, henna, shisha corner and live entertainment."},{"time":"21:30","title":"Return transfer","desc":"Drop-off back at your hotel."}]'::jsonb,
 '[{"q":"Is hotel pickup included?","a":"Yes — complimentary pickup and drop-off from any Dubai city hotel. Marina, Downtown and Deira are all covered."},{"q":"Is it suitable for children?","a":"Yes, families are welcome. We recommend it for kids aged 3+. Dune bashing intensity can be adjusted on request."},{"q":"Are vegetarian meals available?","a":"Absolutely. The BBQ buffet has a full vegetarian and vegan section."}]'::jsonb,
 true, 4.9, 1284),

-- 2. Morning Desert Safari
('morning-desert-safari',
 'Morning Desert Safari',
 'Cooler dunes, fewer crowds — dune bashing, sandboarding and camel rides before noon.',
 'Prefer the desert before the heat builds? Our morning safari runs the same adrenaline-charged dune bashing and activities with cooler temperatures and far fewer crowds. Ideal for photographers and families who want the desert to themselves.',
 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1920&q=80',
 ARRAY['https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1538097304804-2a1b932466a9?auto=format&fit=crop&w=1200&q=80'],
 89, 55, '4 hours', 'Lahbab Desert, Dubai', 'Desert Safari',
 ARRAY['Cooler morning temperatures','Quieter dunes for photos','Dune bashing in a 4×4','Sandboarding & camel ride','Refreshments included'],
 ARRAY['Hotel pickup & drop-off','4×4 dune bashing','Camel ride & sandboarding','Water & refreshments'],
 ARRAY['Meals (breakfast optional add-on)','Quad biking (add-on)','Gratuities'],
 '[{"time":"07:00","title":"Pickup","desc":"Early collection from your hotel."},{"time":"08:00","title":"Dune bashing","desc":"Morning thrills over the dunes."},{"time":"09:00","title":"Activities","desc":"Sandboarding, camel ride and desert photo stops."},{"time":"11:00","title":"Return","desc":"Drop-off at your hotel."}]'::jsonb,
 '[{"q":"What time is pickup?","a":"Between 06:30 and 07:30 depending on your hotel location."},{"q":"Is breakfast included?","a":"Not by default, but you can add a desert breakfast box when you book."}]'::jsonb,
 true, 4.8, 642),

-- 3. Premium Safari with Live Show
('premium-desert-safari-live-show',
 'Premium Desert Safari with Live Shows',
 'A larger camp, gourmet buffet and the full line-up of fire, tanoura and belly-dance shows.',
 'Our premium safari upgrades every detail: a spacious VIP camp, an expanded gourmet buffet with live cooking stations, private seating, and the full entertainment line-up. The most popular choice for couples and special occasions.',
 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=80',
 ARRAY['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1200&q=80'],
 199, 120, '6 hours', 'Lahbab Desert, Dubai', 'Desert Safari',
 ARRAY['Premium VIP camp with private seating','Gourmet buffet & live cooking stations','Full fire, tanoura & belly-dance shows','Welcome dates, coffee & shisha','Sunset dune bashing'],
 ARRAY['Luxury 4×4 transfers','Reserved VIP seating','Gourmet dinner buffet','All live entertainment','Unlimited soft drinks'],
 ARRAY['Alcohol','Private vehicle upgrade','Tips'],
 '[{"time":"15:30","title":"Pickup","desc":"Comfortable 4×4 collection."},{"time":"16:30","title":"Dune bashing","desc":"Sunset dune adventure."},{"time":"18:00","title":"VIP camp","desc":"Private seating, gourmet buffet and full shows."},{"time":"21:30","title":"Return","desc":"Drop-off at your hotel."}]'::jsonb,
 '[{"q":"What makes it premium?","a":"Private reserved seating, an upgraded gourmet menu with live stations, and a less crowded camp."},{"q":"Good for anniversaries?","a":"Yes — it is our most-booked option for couples and celebrations. Tell us and we will arrange a cake."}]'::jsonb,
 true, 5.0, 418),

-- 4. Private Overnight Safari
('vip-overnight-desert-safari',
 'VIP Overnight Desert Safari',
 'Sleep under the stars in a private desert camp with dinner, breakfast and a sunrise dune drive.',
 'The ultimate desert escape. Your own private camp, a candle-lit dinner, stargazing with a telescope, comfortable bedding, and a sunrise dune drive before breakfast. Fully private — just your group, a chef and a guide.',
 'https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1920&q=80',
 ARRAY['https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=1200&q=80'],
 449, 300, '18 hours', 'Al Marmoom Desert, Dubai', 'Desert Safari',
 ARRAY['Fully private desert camp','Candle-lit dinner & breakfast','Stargazing with a telescope','Comfortable bedding & private toilet','Sunrise dune drive'],
 ARRAY['Private 4×4 transfers','Dinner & breakfast','Camp setup & bedding','Dedicated guide & chef','Stargazing session'],
 ARRAY['Alcohol','Additional activities','Gratuities'],
 '[{"time":"16:00","title":"Pickup","desc":"Private transfer to the camp."},{"time":"18:00","title":"Sunset dinner","desc":"Candle-lit dinner and stargazing."},{"time":"22:00","title":"Overnight","desc":"Sleep under the stars in comfort."},{"time":"05:30","title":"Sunrise drive","desc":"Dawn dune drive then breakfast and return."}]'::jsonb,
 '[{"q":"Is it really private?","a":"Yes — the camp is exclusively yours. No other groups."},{"q":"What about bathrooms?","a":"A clean private portable toilet is set up at your camp."}]'::jsonb,
 true, 5.0, 96),

-- 5. Dune Buggy
('dune-buggy-desert-ride',
 'Dune Buggy Desert Adventure',
 'Self-drive a 2-seater off-road buggy across open desert with a lead guide.',
 'Strap in and take the wheel of a powerful two-seater dune buggy. After a full safety briefing you follow a lead guide across open dunes — no experience needed. Available as 30, 60 or 90-minute rides.',
 'https://images.unsplash.com/photo-1599580546666-c0c08c3c4c1c?auto=format&fit=crop&w=1920&q=80',
 ARRAY['https://images.unsplash.com/photo-1599580546666-c0c08c3c4c1c?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1591608971376-5d5b1f6f8c79?auto=format&fit=crop&w=1200&q=80'],
 149, 100, '30–90 min', 'Lahbab Desert, Dubai', 'Adventures',
 ARRAY['Self-drive 2-seater buggy','Full safety briefing & gear','Lead guide on every ride','Helmets & goggles provided','GoPro footage add-on'],
 ARRAY['Buggy rental','Safety gear (helmet & goggles)','Guide & briefing','Bottled water'],
 ARRAY['Hotel transfers (add-on)','GoPro rental','Insurance excess'],
 '[{"time":"On arrival","title":"Briefing","desc":"Safety briefing and gear fitting."},{"time":"+15 min","title":"Ride","desc":"Follow the guide across the dunes."},{"time":"End","title":"Cooldown","desc":"Refreshments and photos."}]'::jsonb,
 '[{"q":"Do I need a license?","a":"No driving licence is required for the desert ride, but drivers must be 18+. Younger riders can join as passengers."},{"q":"Are transfers included?","a":"Transfers are an optional add-on — choose self-drive-to-site or hotel pickup at checkout."}]'::jsonb,
 true, 4.8, 531),

-- 6. Quad Biking
('quad-bike-desert-ride',
 'Quad Bike Desert Ride',
 'Solo 450cc quad biking across the dunes — beginner friendly with a guide.',
 'Take a 450cc automatic quad bike out across the golden dunes on a guided ride. Beginner friendly, fully geared, and available in 30 or 60-minute sessions. A great add-on to any safari.',
 'https://images.unsplash.com/photo-1591608971376-5d5b1f6f8c79?auto=format&fit=crop&w=1920&q=80',
 ARRAY['https://images.unsplash.com/photo-1591608971376-5d5b1f6f8c79?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1599580546666-c0c08c3c4c1c?auto=format&fit=crop&w=1200&q=80'],
 129, 85, '30–60 min', 'Lahbab Desert, Dubai', 'Adventures',
 ARRAY['Automatic 450cc quad bike','Guided desert loop','Helmet & goggles included','Beginner friendly','Photo stops'],
 ARRAY['Quad bike rental','Safety gear','Guided ride','Water'],
 ARRAY['Transfers (optional)','Photos / video','Tips'],
 '[{"time":"On arrival","title":"Gear up","desc":"Briefing and safety equipment."},{"time":"+10 min","title":"Ride","desc":"Guided loop across the dunes."},{"time":"End","title":"Finish","desc":"Return and refreshments."}]'::jsonb,
 '[{"q":"Minimum age?","a":"Riders must be 16+ to drive solo. Children can ride pillion with an adult."},{"q":"Is it safe for beginners?","a":"Yes — the quads are automatic and a guide leads the whole route at a comfortable pace."}]'::jsonb,
 true, 4.7, 389),

-- 7. Hot Air Balloon
('hot-air-balloon-dubai',
 'Hot Air Balloon Over the Dubai Desert',
 'Sunrise flight 4,000 ft above the dunes with falconry and a gourmet breakfast.',
 'Float silently over the Dubai desert at dawn. Watch the sun rise over endless dunes from 4,000 feet, then land for a falconry display and a gourmet breakfast in a heritage camp. A bucket-list morning.',
 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=1920&q=80',
 ARRAY['https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1200&q=80'],
 1095, 950, '4 hours', 'Dubai Desert Conservation Reserve', 'Adventures',
 ARRAY['Sunrise flight at 4,000 ft','Falconry display on landing','Gourmet breakfast in a camp','Flight certificate','Hotel transfers included'],
 ARRAY['Return hotel transfers','60-min balloon flight','Falconry show','Gourmet breakfast','Flight certificate'],
 ARRAY['Personal expenses','Gratuities','Photos (available to purchase)'],
 '[{"time":"04:30","title":"Pickup","desc":"Pre-dawn hotel collection."},{"time":"05:45","title":"Flight","desc":"Sunrise balloon flight over the reserve."},{"time":"07:00","title":"Breakfast","desc":"Falconry display and gourmet breakfast."},{"time":"08:30","title":"Return","desc":"Drop-off at your hotel."}]'::jsonb,
 '[{"q":"Is it weather dependent?","a":"Yes. Flights only run in safe conditions; if cancelled for weather you get a full refund or reschedule."},{"q":"Any age limit?","a":"Children must be at least 5 years old and over 1.1m tall to fly."}]'::jsonb,
 true, 5.0, 274),

-- 8. Dubai City Tour
('dubai-city-tour',
 'Dubai City Tour — Half Day',
 'Burj Khalifa views, Dubai Marina, the Old Souks and Jumeirah Mosque in one guided morning.',
 'See the best of Dubai in half a day with a licensed guide. Drive past the Burj Khalifa and Burj Al Arab, cross the creek by traditional abra, explore the gold and spice souks, and stop for photos at Jumeirah Mosque and the Marina.',
 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=80',
 ARRAY['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80'],
 120, 80, '5 hours', 'Dubai', 'City Tours',
 ARRAY['Licensed English-speaking guide','Burj Khalifa & Burj Al Arab photo stops','Traditional abra creek crossing','Gold & spice souks','Jumeirah Mosque & Marina'],
 ARRAY['Hotel pickup & drop-off','Air-conditioned vehicle','Licensed guide','Abra ride','Bottled water'],
 ARRAY['Burj Khalifa entry ticket','Meals','Personal shopping'],
 '[{"time":"09:00","title":"Pickup","desc":"Collection from your hotel."},{"time":"09:30","title":"Old Dubai","desc":"Creek, abra ride and the souks."},{"time":"11:30","title":"New Dubai","desc":"Jumeirah Mosque, Burj Al Arab and Marina photo stops."},{"time":"14:00","title":"Return","desc":"Drop-off at your hotel."}]'::jsonb,
 '[{"q":"Does it include Burj Khalifa entry?","a":"The tour includes photo stops; At the Top entry can be added as an extra."},{"q":"What languages are available?","a":"English, Arabic, Hindi and Urdu guides are available on request."}]'::jsonb,
 true, 4.8, 712),

-- 9. Abu Dhabi City Tour
('abu-dhabi-city-tour',
 'Abu Dhabi City Tour from Dubai',
 'Sheikh Zayed Grand Mosque, the Louvre, Qasr Al Watan and the Corniche — full day.',
 'A full-day journey to the UAE capital. Visit the breathtaking Sheikh Zayed Grand Mosque, the Louvre Abu Dhabi, the presidential palace Qasr Al Watan, and drive the Corniche past Emirates Palace. Departs from Dubai.',
 'https://images.unsplash.com/photo-1551041777-ed6ff8be6e1d?auto=format&fit=crop&w=1920&q=80',
 ARRAY['https://images.unsplash.com/photo-1551041777-ed6ff8be6e1d?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1582034986517-30d162d9a16e?auto=format&fit=crop&w=1200&q=80'],
 175, 110, '10 hours', 'Abu Dhabi', 'City Tours',
 ARRAY['Sheikh Zayed Grand Mosque','Louvre Abu Dhabi exterior & optional entry','Qasr Al Watan palace','Corniche & Emirates Palace','Round-trip from Dubai'],
 ARRAY['Hotel pickup from Dubai','Air-conditioned vehicle','Licensed guide','Bottled water'],
 ARRAY['Louvre & Qasr Al Watan tickets','Lunch','Tips'],
 '[{"time":"08:00","title":"Depart Dubai","desc":"Pickup and scenic drive to Abu Dhabi."},{"time":"10:00","title":"Grand Mosque","desc":"Guided visit to Sheikh Zayed Grand Mosque."},{"time":"13:00","title":"City highlights","desc":"Louvre, Corniche and Qasr Al Watan."},{"time":"18:00","title":"Return","desc":"Drive back to your Dubai hotel."}]'::jsonb,
 '[{"q":"Is there a dress code?","a":"Yes, for the Grand Mosque. Cover shoulders and knees; abayas are available free at the entrance."},{"q":"Is lunch included?","a":"Lunch is not included but there is a stop at a restaurant where you can buy a meal."}]'::jsonb,
 true, 4.9, 503),

-- 10. Sharjah City Tour
('sharjah-city-tour',
 'Sharjah Heritage & Culture Tour',
 'The cultural capital of the UAE — museums, souqs, the Blue Souk and Al Noor Mosque.',
 'Explore Sharjah, the UAE’s capital of culture. Wander Al Noor Mosque, the Sharjah Museum of Islamic Civilization, the heritage district and the famous Blue Souk for crafts and carpets.',
 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1920&q=80',
 ARRAY['https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80'],
 95, 60, '5 hours', 'Sharjah', 'City Tours',
 ARRAY['Al Noor Mosque','Museum of Islamic Civilization','Heritage Area & Al Rolla','Blue Souk crafts market','Licensed guide'],
 ARRAY['Hotel pickup from Dubai/Sharjah','Air-conditioned vehicle','Licensed guide','Water'],
 ARRAY['Museum entry tickets','Meals','Shopping'],
 '[{"time":"09:00","title":"Pickup","desc":"Collection from your hotel."},{"time":"10:00","title":"Mosque & museums","desc":"Al Noor Mosque and the civilization museum."},{"time":"12:00","title":"Souqs","desc":"Heritage district and the Blue Souk."},{"time":"14:00","title":"Return","desc":"Drop-off at your hotel."}]'::jsonb,
 '[{"q":"Is Sharjah alcohol-free?","a":"Yes, Sharjah is a dry emirate. Plan accordingly — it is a family-friendly cultural destination."},{"q":"Can I shop at the Blue Souk?","a":"Yes, there is time to browse carpets, jewellery and souvenirs."}]'::jsonb,
 true, 4.7, 218),

-- 11. Burj Khalifa
('burj-khalifa-at-the-top',
 'Burj Khalifa — At the Top (Level 124 & 125)',
 'Skip-the-line tickets to the observation decks of the world’s tallest building.',
 'Ride the world’s fastest lift to levels 124 and 125 of the Burj Khalifa for breathtaking 360° views over Dubai. Skip-the-line entry with flexible time slots, including the premium sunset window.',
 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1920&q=80',
 ARRAY['https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80'],
 169, 130, '1–2 hours', 'Downtown Dubai', 'Attractions',
 ARRAY['Levels 124 & 125 observation decks','Skip-the-line entry','360° views of Dubai','Sunset slot available','Interactive viewing telescopes'],
 ARRAY['Timed-entry ticket','Skip-the-line access','Observation deck access'],
 ARRAY['Transfers','Level 148 SKY upgrade','Food & drink'],
 '[{"time":"Your slot","title":"Arrive","desc":"Enter via the Dubai Mall lower-ground concourse."},{"time":"+10 min","title":"Ascend","desc":"High-speed lift to level 124."},{"time":"Open","title":"Explore","desc":"Take in the views from levels 124 and 125."}]'::jsonb,
 '[{"q":"Is sunset more expensive?","a":"Yes, the sunset window is the premium prime-time slot and books out fastest. Reserve early."},{"q":"Can I upgrade to level 148?","a":"Yes — the SKY experience on level 148 can be booked separately."}]'::jsonb,
 true, 4.9, 1640),

-- 12. Museum of the Future
('museum-of-the-future',
 'Museum of the Future Entry Ticket',
 'Skip-the-line entry to Dubai’s landmark Museum of the Future.',
 'Step inside one of the most beautiful buildings on earth. The Museum of the Future is an immersive journey through space, ecology, wellness and tomorrow’s technology. Includes timed skip-the-line entry.',
 'https://images.unsplash.com/photo-1582034986517-30d162d9a16e?auto=format&fit=crop&w=1920&q=80',
 ARRAY['https://images.unsplash.com/photo-1582034986517-30d162d9a16e?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=1200&q=80'],
 145, 110, '2–3 hours', 'Sheikh Zayed Road, Dubai', 'Attractions',
 ARRAY['Skip-the-line timed entry','Immersive future-world exhibits','Iconic calligraphy architecture','Family friendly','Central SZR location'],
 ARRAY['Timed-entry ticket','Skip-the-line access','All exhibition floors'],
 ARRAY['Transfers','Guided tour','Food & retail'],
 '[{"time":"Your slot","title":"Arrive","desc":"Enter at the base of the iconic torus."},{"time":"Start","title":"Journey","desc":"Move through the future-world exhibition floors."},{"time":"End","title":"Finish","desc":"Exit via the future-tech retail space."}]'::jsonb,
 '[{"q":"How long should I allow?","a":"Most visitors spend two to three hours across the exhibition floors."},{"q":"Is it suitable for kids?","a":"Yes, there is a dedicated children’s floor (Future Heroes) for ages 3–10."}]'::jsonb,
 true, 4.8, 905)

ON CONFLICT (slug) DO NOTHING;


-- ---------- BLOG CATEGORIES ----------
INSERT INTO public.post_categories (slug, name, description) VALUES
  ('travel-tips', 'Travel Tips', 'Practical advice for visiting the UAE.'),
  ('food', 'Food', 'Where and what to eat across the Emirates.'),
  ('adventure', 'Adventure', 'Desert, sea and sky activities in the UAE.')
ON CONFLICT (slug) DO NOTHING;


-- ---------- SAMPLE ARTICLES ----------
INSERT INTO public.posts
  (slug, title, excerpt, cover_image, content, tags, category_id, is_published, published_at, seo_title, seo_description)
VALUES
('what-to-wear-dubai-desert-safari',
 'What to Wear on a Dubai Desert Safari — A 2026 Outfit Guide',
 'Light layers, closed shoes and a scarf — here is exactly what to pack so you are comfortable from dune bashing to the evening chill.',
 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80',
 '<p>The desert swings from hot afternoons to surprisingly cool evenings, so layering is the key. Wear light, breathable cotton or linen during the day and bring a light jacket or shawl for after sunset.</p><h2>Footwear</h2><p>Closed shoes or trainers beat sandals — fine sand gets everywhere. If you plan to sandboard, trainers give you better grip.</p><h2>Accessories</h2><p>A scarf doubles as sun protection and a dust shield during dune bashing. Sunglasses and SPF 50 are non-negotiable.</p><h2>Evening</h2><p>Camps can get breezy. A hoodie or pashmina keeps you cosy through the live shows and dinner.</p>',
 ARRAY['desert safari','packing','travel tips'],
 (SELECT id FROM public.post_categories WHERE slug='travel-tips'),
 true, now() - interval '12 days',
 'What to Wear on a Dubai Desert Safari (2026 Guide)',
 'A simple packing list for a Dubai desert safari — layers, footwear and evening wear so you stay comfortable all day.'),

('hidden-breakfast-spots-old-dubai',
 '12 Hidden Breakfast Spots Locals Love in Old Dubai',
 'Skip the hotel buffet. These tucked-away cafés in Deira and Bur Dubai serve the city’s best balaleet, chebab and karak.',
 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
 '<p>Old Dubai hides some of the city’s most authentic breakfasts. Start with a plate of balaleet (sweet vermicelli with egg) and a cup of karak chai.</p><h2>Deira</h2><p>The lanes behind the gold souk are full of tiny Emirati and South-Indian spots serving chebab pancakes and fresh paratha from sunrise.</p><h2>Bur Dubai</h2><p>Al Fahidi’s heritage cafés pair traditional breakfasts with courtyard seating — perfect before a creek walk.</p>',
 ARRAY['food','dubai','local'],
 (SELECT id FROM public.post_categories WHERE slug='food'),
 true, now() - interval '20 days',
 '12 Hidden Breakfast Spots in Old Dubai Locals Love',
 'A local guide to the best traditional breakfast cafés in Deira and Bur Dubai — balaleet, chebab, paratha and karak.'),

('uae-camping-spots-by-car',
 'Camping in the UAE: 7 Stunning Spots You Can Reach by Car',
 'From the Hajar Mountains to hidden desert valleys, these drive-up campsites are perfect for a weekend under the stars.',
 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
 '<p>You do not need a 4×4 expedition to camp in the UAE — several beautiful spots are reachable in a normal car.</p><h2>Mountains</h2><p>The wadis around Hatta and the Hajar range offer cooler air and dramatic scenery in winter.</p><h2>Desert</h2><p>Al Qudra Lakes near Dubai is a popular, accessible spot with sunset views and resident flamingos.</p><h2>Tips</h2><p>Camp October to March, carry plenty of water, and always pack out your rubbish to keep these places pristine.</p>',
 ARRAY['camping','adventure','weekend'],
 (SELECT id FROM public.post_categories WHERE slug='adventure'),
 true, now() - interval '34 days',
 'Camping in the UAE: 7 Drive-Up Spots Under the Stars',
 'Seven beautiful UAE campsites you can reach by car — mountains, lakes and desert spots for a weekend trip.')
ON CONFLICT (slug) DO NOTHING;
