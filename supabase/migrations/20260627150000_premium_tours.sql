-- ============================================================
-- PREMIUM EXPERIENCES — private/luxury tours
-- Idempotent (ON CONFLICT slug DO NOTHING). All published.
-- ============================================================
INSERT INTO public.tours
  (slug, title, summary, description, hero_image, gallery, price_adult, price_child,
   duration, location, category, highlights, inclusions, exclusions, itinerary, faqs,
   is_published, rating, reviews_count)
VALUES

-- 1. Private Overnight Desert Camping
('private-overnight-camping',
 'Private Overnight Desert Camping',
 'Your own Bedouin camp under the stars — private chef, bonfire, stargazing and breakfast at sunrise.',
 'Escape the city for a fully private overnight in the Dubai desert. We set up an exclusive camp just for your group: a majlis seating area, comfortable beds inside a traditional tent, a private chef grilling a fresh BBQ, a crackling bonfire and unmatched stargazing far from the lights. Wake to a quiet desert sunrise and a hot breakfast before your transfer back. No crowds, no fixed schedule — just you and the dunes.',
 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1920&q=80',
 ARRAY['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1200&q=80'],
 1450, 850, 'Overnight (18 hrs)', 'Al Marmoom Desert, Dubai', 'Premium Experiences',
 ARRAY['Fully private camp — only your group','Private chef & unlimited BBQ dinner','Bonfire, shisha & live stargazing','Comfortable beds in a traditional tent','Sunrise breakfast before drop-off'],
 ARRAY['Private 4×4 hotel transfers','Exclusive-use desert camp setup','Dinner, breakfast & soft drinks','Bedding, towels & washroom access','Dedicated camp host & chef'],
 ARRAY['Alcoholic beverages','Personal expenses & tips','Quad bikes / add-on activities'],
 '[{"time":"16:00","title":"Private pickup","desc":"4×4 collects your group from your Dubai hotel."},{"time":"17:00","title":"Camp & dune time","desc":"Arrive at your private camp, sandboarding and sunset photos."},{"time":"19:30","title":"BBQ dinner","desc":"Private chef serves a fresh grilled dinner around the fire."},{"time":"21:30","title":"Bonfire & stars","desc":"Shisha, music and guided stargazing far from city lights."},{"time":"07:00","title":"Sunrise & breakfast","desc":"Wake to the desert sunrise and a hot breakfast, then transfer back."}]'::jsonb,
 '[{"q":"Is the camp really private?","a":"Yes — the entire camp is set up exclusively for your group. No other guests share it."},{"q":"What about washrooms?","a":"A clean private washroom unit is provided at the camp."},{"q":"Is it family friendly?","a":"Absolutely. It is popular for families, couples and small groups. Child pricing applies for ages 3-11."}]'::jsonb,
 true, 5.0, 87),

-- 2. Private Birthday Celebration
('private-birthday-celebration',
 'Private Desert Birthday Celebration',
 'A surprise birthday set-up in the dunes — decor, cake, private dinner and a personalised celebration.',
 'Make a birthday unforgettable with a fully private desert celebration. We arrange a styled set-up with balloons, a personalised "Happy Birthday" backdrop, fairy lights and a private majlis. Your group enjoys a private BBQ dinner, a custom cake, music and the whole desert camp to yourselves. Perfect for milestone birthdays, surprises and intimate group celebrations — tell us the theme and we handle the rest.',
 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=1920&q=80',
 ARRAY['https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80'],
 1250, 700, '6 hours', 'Lahbab Desert, Dubai', 'Premium Experiences',
 ARRAY['Styled birthday decor & backdrop','Personalised cake included','Private BBQ dinner for your group','Fairy lights, music & shisha corner','Exclusive-use camp — your party only'],
 ARRAY['Private 4×4 hotel transfers','Themed decoration & setup','Birthday cake & BBQ dinner','Soft drinks, water, tea & coffee','Dedicated host & photographer (30 min)'],
 ARRAY['Alcoholic beverages','Customised premium cakes (on request)','Personal expenses & tips'],
 '[{"time":"15:30","title":"Private pickup","desc":"Pickup from your Dubai hotel in a private 4×4."},{"time":"16:30","title":"Camp reveal","desc":"Arrive to your decorated private birthday camp."},{"time":"17:30","title":"Activities & photos","desc":"Sandboarding, camel ride and golden-hour photos."},{"time":"19:00","title":"Cake & dinner","desc":"Cake cutting, private BBQ dinner and music."},{"time":"21:00","title":"Return transfer","desc":"Drop-off back at your hotel."}]'::jsonb,
 '[{"q":"Can I customise the theme?","a":"Yes — share your colours, age and any requests and we will style the set-up to match."},{"q":"Can you write a name on the cake?","a":"Yes, name personalisation is included. Custom flavours and tiers are available on request."},{"q":"How many guests?","a":"Ideal for 2-15 guests. For larger groups contact us for a custom quote."}]'::jsonb,
 true, 5.0, 64),

-- 3. Private Desert Party
('private-desert-party',
 'Private Desert Party Night',
 'Your own desert party with DJ-ready sound, lighting, dinner and dunes — built for groups who want privacy.',
 'A private celebration in the open desert for groups who want the camp entirely to themselves. We provide a sound system, ambient lighting, a styled lounge, a generous BBQ spread and full desert activities. Bring your playlist, your people and your occasion — corporate nights, bachelor/ette parties, reunions and group celebrations all work beautifully. Everything is private and flexible around your timing.',
 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1920&q=80',
 ARRAY['https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1200&q=80'],
 1650, 0, '6 hours', 'Lahbab Desert, Dubai', 'Premium Experiences',
 ARRAY['Private camp with sound & lighting','Connect your own playlist','Generous BBQ buffet for the group','Sandboarding, camel ride & shisha','Flexible timing — your night, your way'],
 ARRAY['Private 4×4 transfers','Exclusive camp, sound system & lighting','BBQ buffet & soft drinks','Desert activities & shisha corner','Dedicated event host'],
 ARRAY['Alcoholic beverages','Live DJ / entertainers (add-on)','Personal expenses & tips'],
 '[{"time":"16:00","title":"Private pickup","desc":"Group transfer from your Dubai hotel."},{"time":"17:00","title":"Arrive & settle","desc":"Your private party camp with lounge, sound and lights."},{"time":"18:00","title":"Activities & sunset","desc":"Sandboarding, camel rides and sunset photos."},{"time":"19:30","title":"Dinner & party","desc":"BBQ buffet, your music and the camp to yourselves."},{"time":"22:00","title":"Return transfer","desc":"Drop-off back at your hotel."}]'::jsonb,
 '[{"q":"Is this an adults-only experience?","a":"It is designed for adult groups and private events, but families can request a family-friendly version."},{"q":"Can we bring our own music?","a":"Yes — connect any device to the provided sound system via Bluetooth or cable."},{"q":"What is the minimum group size?","a":"Pricing is per group from 8 guests. Contact us for larger parties or corporate bookings."}]'::jsonb,
 true, 4.9, 52),

-- 4. Private Yacht Charter
('private-yacht-charter',
 'Private Luxury Yacht Charter',
 'Charter your own yacht along Dubai Marina & Palm Jumeirah — skipper, refreshments and skyline views.',
 'Cruise the Arabian Gulf on a private luxury yacht with Dubai Marina, JBR, Bluewaters and the Palm Jumeirah skyline as your backdrop. Your group has the whole yacht — sun deck, lounge and shaded seating — with a professional skipper and crew. Add swimming stops, photography and refreshments. Ideal for relaxed cruises, anniversaries, family outings and special occasions on the water.',
 'https://images.unsplash.com/photo-1562281302-809108fd533c?auto=format&fit=crop&w=1920&q=80',
 ARRAY['https://images.unsplash.com/photo-1562281302-809108fd533c?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1616207133639-cd5e4db9859f?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1614350391736-ed8619d63c06?auto=format&fit=crop&w=1200&q=80'],
 1900, 1100, '3 hours', 'Dubai Marina', 'Premium Experiences',
 ARRAY['Private yacht — only your group','Professional skipper & crew','Marina, JBR & Palm skyline cruise','Swimming & photo stops','Sun deck, lounge & shaded seating'],
 ARRAY['Private yacht with skipper & crew','Fuel, marina fees & life jackets','Soft drinks & bottled water','Bluetooth sound system','Onboard fishing gear (on request)'],
 ARRAY['Food platters (add-on)','Alcoholic beverages','Hotel transfers (add-on)'],
 '[{"time":"00:00","title":"Marina boarding","desc":"Meet the crew and board at Dubai Marina."},{"time":"00:15","title":"Skyline cruise","desc":"Cruise past Marina, JBR, Bluewaters and Ain Dubai."},{"time":"01:15","title":"Palm & swim stop","desc":"Pause near the Palm for swimming and photos."},{"time":"02:30","title":"Sunset return","desc":"Relaxed cruise back to the marina."}]'::jsonb,
 '[{"q":"Can we choose the route?","a":"Yes — the skipper will tailor the route to your group within the charter time."},{"q":"How many guests fit?","a":"This charter comfortably seats up to 12 guests. Larger yachts are available on request."},{"q":"Can you arrange catering?","a":"Yes, food platters, decoration and a private chef can be added — just ask when booking."}]'::jsonb,
 true, 5.0, 119),

-- 5. Private Yacht Party
('private-yacht-party',
 'Private Yacht Party Cruise',
 'A private yacht party with music, decor and the Dubai skyline — celebrations on the water, done your way.',
 'Take your celebration offshore with a private yacht party. The yacht is exclusively yours, with a sound system, party-ready ambience and the full Dubai Marina and Palm skyline around you. Add decoration, a cake, food platters and a photographer for birthdays, bachelor/ette parties and group celebrations. Swim stops, sunset timing and your own playlist make it a celebration nobody forgets.',
 'https://images.unsplash.com/photo-1616207133639-cd5e4db9859f?auto=format&fit=crop&w=1920&q=80',
 ARRAY['https://images.unsplash.com/photo-1616207133639-cd5e4db9859f?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1562281302-809108fd533c?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80'],
 2400, 0, '3 hours', 'Dubai Marina', 'Premium Experiences',
 ARRAY['Exclusive yacht for your party','Sound system & party ambience','Optional decor, cake & photographer','Skyline cruise & swim stop','Sunset slots available'],
 ARRAY['Private yacht with skipper & crew','Fuel, marina fees & life jackets','Soft drinks, water & ice','Bluetooth party sound system','Basic party setup'],
 ARRAY['Food platters & cake (add-on)','Alcoholic beverages','Live entertainers (add-on)'],
 '[{"time":"00:00","title":"Boarding & welcome","desc":"Board your private yacht at Dubai Marina."},{"time":"00:20","title":"Cruise & music","desc":"Skyline cruise with your playlist and party ambience."},{"time":"01:30","title":"Swim & celebrate","desc":"Swim stop near the Palm, cake and photos."},{"time":"02:40","title":"Return cruise","desc":"Wind down on the cruise back to the marina."}]'::jsonb,
 '[{"q":"Can you decorate for a birthday?","a":"Yes — balloons, backdrop, cake and a photographer can all be added to your booking."},{"q":"Is it suitable for groups?","a":"Yes, it is built for groups up to 12. Bigger yachts are available for larger parties."},{"q":"Can we extend the time?","a":"Extra hours can be added subject to availability — request it when booking."}]'::jsonb,
 true, 5.0, 78),

-- 6. Helicopter Tour
('helicopter-tour-dubai',
 'Dubai Helicopter Tour',
 'See Dubai from the sky — Burj Khalifa, Palm Jumeirah and the coastline on a private-feel helicopter flight.',
 'Get the view everyone talks about. Lift off from the Dubai coast and soar over the Burj Khalifa, Burj Al Arab, the Palm Jumeirah, the World Islands and the Marina skyline. Choose a 12, 17, 25 or 40-minute route — every seat is a window seat. A once-in-a-trip aerial experience with professional pilots and a full safety briefing, perfect for special occasions and bucket-list moments.',
 'https://images.unsplash.com/photo-1607525884336-66ccfac7ab56?auto=format&fit=crop&w=1920&q=80',
 ARRAY['https://images.unsplash.com/photo-1607525884336-66ccfac7ab56?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1582672060674-bc2bd808a8f5?auto=format&fit=crop&w=1200&q=80'],
 695, 695, '12-40 min options', 'Dubai Coast', 'Premium Experiences',
 ARRAY['Aerial views of Burj Khalifa & Palm','Window seat guaranteed for everyone','12 / 17 / 25 / 40-minute routes','Professional pilots & safety briefing','Great for proposals & special days'],
 ARRAY['Shared or private helicopter seat','Professional pilot & safety briefing','Headset with live commentary','All aviation & heliport fees','Photo opportunity before boarding'],
 ARRAY['Hotel transfers (add-on)','Private full-aircraft charter (on request)','Personal expenses & tips'],
 '[{"time":"00:00","title":"Check-in","desc":"Arrive at the heliport and complete check-in."},{"time":"00:15","title":"Safety briefing","desc":"Meet your pilot and complete the safety briefing."},{"time":"00:30","title":"Take off","desc":"Lift off over the Dubai coastline and skyline."},{"time":"00:45","title":"Aerial tour","desc":"Fly past Burj Khalifa, the Palm and the World Islands."}]'::jsonb,
 '[{"q":"Is every seat a window seat?","a":"Yes — the helicopters are arranged so every passenger gets a clear window view."},{"q":"Can I book a private flight?","a":"Yes, full-aircraft private charters and proposal flights are available on request."},{"q":"Is there a weight limit?","a":"For safety, passenger weights are confirmed at booking. Our team will guide you through the details."}]'::jsonb,
 true, 4.9, 203)

ON CONFLICT (slug) DO NOTHING;
