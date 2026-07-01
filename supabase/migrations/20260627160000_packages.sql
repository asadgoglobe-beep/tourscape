-- ============================================================================
-- Holiday packages, modelled as tours in category "Packages" so they are
-- fully managed from the existing admin Tours panel and render on their own
-- detail pages with the standard booking/enquiry flow.
-- Idempotent: ON CONFLICT (slug) DO NOTHING.
-- ============================================================================

INSERT INTO public.tours
  (slug, title, summary, description, hero_image, gallery, price_adult, price_child,
   duration, location, category, highlights, inclusions, exclusions, itinerary, faqs,
   is_published, rating, reviews_count)
VALUES
-- 1. City + Safari Combo (1 Day)
('city-safari-combo-package',
 'City + Safari Combo — 1 Day',
 'Our most-booked day out: a half-day Dubai city tour followed by an evening desert safari with BBQ.',
 'The perfect first day in Dubai. Spend the morning seeing the city''s icons — Burj Khalifa, the Marina and the old souks — then head into the desert for sunset dune bashing and a BBQ dinner with live entertainment. Hotel pickup, guide and all fees included.',
 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=80',
 ARRAY['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1200&q=80'],
 199, 130, '1 Day', 'Dubai, UAE', 'Packages',
 ARRAY['Half-day Dubai city tour','Evening desert safari + BBQ','Hotel pickup & drop-off','Licensed guide','All entry & activity fees'],
 ARRAY['Half-day Dubai city tour','Evening desert safari with BBQ','Hotel pickup & drop-off','Licensed English-speaking guide','All entry & activity fees'],
 ARRAY['Lunch','Alcoholic beverages','Personal expenses & tips'],
 '[{"time":"Morning","title":"Dubai city tour","desc":"Burj Khalifa photo stop, Dubai Marina, Jumeirah Mosque and the old souks of Deira."},{"time":"Afternoon","title":"Free time","desc":"Return to your hotel to relax before the desert."},{"time":"Evening","title":"Desert safari + BBQ","desc":"Dune bashing at sunset, camel rides, then a BBQ buffet with live shows at the camp."}]'::jsonb,
 '[{"q":"Can the two halves run on different days?","a":"Yes — just let us know and we can split the city tour and safari across two dates at no extra cost."},{"q":"Is hotel pickup included?","a":"Yes, pickup and drop-off from any Dubai city hotel is included."}]'::jsonb,
 true, 4.9, 526),

-- 2. Dubai Explorer (3 Days)
('dubai-explorer-3-day-package',
 'Dubai Explorer — 3 Days',
 'Three days to see Dubai properly: city highlights, the desert, and a marina dinner cruise.',
 'A relaxed three-day introduction to Dubai with a 4-star hotel as your base. See the city''s landmarks, ride the desert at sunset, and finish with a dhow dinner cruise along the Marina. Transfers and visa assistance included throughout.',
 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1920&q=80',
 ARRAY['https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80'],
 1290, 850, '3 Days', 'Dubai, UAE', 'Packages',
 ARRAY['3 nights 4★ hotel + breakfast','Dubai city tour & Burj Khalifa','Evening desert safari','Marina dhow dinner cruise','All transfers + visa assistance'],
 ARRAY['3 nights 4★ hotel with breakfast','Dubai city tour & Burj Khalifa ticket','Evening desert safari with BBQ','Marina dhow dinner cruise','All airport & tour transfers','UAE tourist visa assistance'],
 ARRAY['Flights','Lunches & some dinners','Personal expenses & tips'],
 '[{"time":"Day 1","title":"Arrival & city tour","desc":"Airport pickup, hotel check-in, then a half-day Dubai city tour and Burj Khalifa visit."},{"time":"Day 2","title":"Desert safari","desc":"Free morning, then an evening desert safari with dune bashing and a BBQ dinner."},{"time":"Day 3","title":"Marina cruise & departure","desc":"Morning at leisure, a Marina dhow dinner cruise, then airport drop-off."}]'::jsonb,
 '[{"q":"Can I upgrade the hotel?","a":"Yes — we can quote 5★ options or a specific hotel on request."},{"q":"Are flights included?","a":"No, the package is land-only. We can advise on the best flights for your dates."}]'::jsonb,
 true, 4.8, 312),

-- 3. UAE Highlights (5 Days)
('uae-highlights-5-day-package',
 'UAE Highlights — 5 Days',
 'Dubai and Abu Dhabi together — the Grand Mosque, Burj Khalifa, the desert and the coast.',
 'Five days across the two great emirates. Explore Dubai''s skyline and souks, cross to Abu Dhabi for the Sheikh Zayed Grand Mosque and the Corniche, and enjoy a premium desert safari along the way. A 4-star base, daily transfers and visa assistance keep everything effortless.',
 'https://images.unsplash.com/photo-1551041777-ed6ff8be6e1d?auto=format&fit=crop&w=1920&q=80',
 ARRAY['https://images.unsplash.com/photo-1551041777-ed6ff8be6e1d?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80'],
 2390, 1550, '5 Days', 'Dubai & Abu Dhabi, UAE', 'Packages',
 ARRAY['5 nights 4★ hotel + breakfast','Dubai & Abu Dhabi city tours','Sheikh Zayed Grand Mosque','Premium desert safari','Daily transfers + visa'],
 ARRAY['5 nights 4★ hotel with breakfast','Dubai & Abu Dhabi guided city tours','Sheikh Zayed Grand Mosque visit','Premium desert safari','Daily transfers','UAE tourist visa assistance'],
 ARRAY['Flights','Lunches & some dinners','Optional add-on attractions','Tips'],
 '[{"time":"Day 1","title":"Arrival","desc":"Airport pickup and hotel check-in, evening at leisure."},{"time":"Day 2","title":"Dubai city tour","desc":"Burj Khalifa, Marina, Jumeirah and the old souks."},{"time":"Day 3","title":"Desert safari","desc":"Premium evening safari with dune bashing and gourmet BBQ."},{"time":"Day 4","title":"Abu Dhabi","desc":"Sheikh Zayed Grand Mosque, the Corniche and Qasr Al Watan."},{"time":"Day 5","title":"Departure","desc":"Free morning and airport drop-off."}]'::jsonb,
 '[{"q":"Is the Louvre Abu Dhabi included?","a":"It is an optional add-on — we can include it and adjust the quote."},{"q":"How much walking is involved?","a":"Moderate. Tours are vehicle-based with short walks at each stop; tell us about any mobility needs."}]'::jsonb,
 true, 4.9, 274),

-- 4. Luxury Escape (7 Days)
('luxury-escape-7-day-package',
 'Luxury Escape — 7 Days',
 'Seven days of the UAE in 5★ comfort, with a private guide and chauffeur throughout.',
 'Our flagship itinerary. Seven days across the UAE staying in 5-star hotels, with a private guide and chauffeur at your disposal the whole way. A VIP overnight desert safari, Abu Dhabi''s landmarks, the Louvre, Qasr Al Watan and a sunrise hot-air balloon flight are all included.',
 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=80',
 ARRAY['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1551041777-ed6ff8be6e1d?auto=format&fit=crop&w=1200&q=80'],
 5900, 3900, '7 Days', 'United Arab Emirates', 'Packages',
 ARRAY['7 nights 5★ hotel + breakfast','Private guide & chauffeur','VIP overnight desert safari','Abu Dhabi + Louvre + Qasr Al Watan','Hot air balloon flight'],
 ARRAY['7 nights 5★ hotel with breakfast','Private guide and chauffeur throughout','VIP overnight desert safari','Abu Dhabi tour, Louvre & Qasr Al Watan','Sunrise hot air balloon flight','All transfers and visa assistance'],
 ARRAY['Flights','Lunches & some dinners','Personal shopping & tips'],
 '[{"time":"Day 1","title":"Arrival","desc":"Private airport transfer to your 5★ hotel."},{"time":"Day 2","title":"Dubai in style","desc":"Private city tour with Burj Khalifa SKY and a Marina yacht stop."},{"time":"Day 3","title":"VIP overnight safari","desc":"Private desert camp under the stars with gourmet dining."},{"time":"Day 4","title":"Balloon & recovery","desc":"Sunrise hot air balloon flight, then a relaxed afternoon."},{"time":"Day 5","title":"Abu Dhabi","desc":"Grand Mosque, Louvre Abu Dhabi and Qasr Al Watan."},{"time":"Day 6","title":"At leisure","desc":"A free day for the beach, shopping or an optional theme park."},{"time":"Day 7","title":"Departure","desc":"Private transfer to the airport."}]'::jsonb,
 '[{"q":"Can the itinerary be customised?","a":"Completely. This is a private package — we tailor every day to your interests, pace and budget."},{"q":"Is it suitable for a honeymoon?","a":"Yes, it is our most-requested honeymoon itinerary. Tell us and we will arrange special touches."}]'::jsonb,
 true, 5.0, 156)

ON CONFLICT (slug) DO NOTHING;
