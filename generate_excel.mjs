const XLSX = require('xlsx');

const sections = [
  {
    name: "1. Hero Slider",
    rows: [
      ["Hero Slider","Slide 1","Badge","ডায়াগনস্টিক সাপোর্ট","Diagnostic Support","/admin/customize/[id]"],
      ["Hero Slider","Slide 1","Trust Line","✓ ভেরিফাইড কেয়ারগিভার · সার্বক্ষণিক আপডেট","✓ Verified Caregivers · Real-time Updates","/admin/customize/[id]"],
      ["Hero Slider","Slide 1","Headline","হাসপাতালের লম্বা লাইন নয়— আপনার প্রিয়জন প্রথম অগ্রাধিকার।","Not just hospital runs— we stand by them at every step.","/admin/customize/[id]"],
      ["Hero Slider","Slide 1","Sub Text","ডাক্তারের সিরিয়াল থেকে শুরু করে টেস্ট করানো—আমাদের কেয়ারগিভার শারীরিক উপস্থিতিতে ভরসা জোগাবে প্রতিটি ধাপে।","From booking appointments to guiding them through tests, our dedicated caregivers provide physical presence and reassurance.","/admin/customize/[id]"],
      ["Hero Slider","Slide 1","Primary Button","সহায়তা নিন","Get Support","/admin/customize/[id]"],
      ["Hero Slider","Slide 1","Secondary Button","আমাদের প্রক্রিয়া","Our Process","/admin/customize/[id]"],
      ["Hero Slider","Slide 1","Background Image","/images/hero/diagnostic-service.jpg","/images/hero/diagnostic-service.jpg","/admin/customize/[id]"],
      ["Hero Slider","Slide 2","Badge","চিকিৎসক সেবা","Doctor Services","/admin/customize/[id]"],
      ["Hero Slider","Slide 2","Trust Line","🩺 শীর্ষস্থানীয় চিকিৎসকদের নেটওয়ার্ক","🩺 Network of Top Specialists","/admin/customize/[id]"],
      ["Hero Slider","Slide 2","Headline","সঠিক চিকিৎসকের পরামর্শ, বিনা দুশ্চিন্তায়।","The right medical advice, without the anxiety.","/admin/customize/[id]"],
      ["Hero Slider","Slide 2","Sub Text","সেরা চিকিৎসকদের অ্যাপয়েন্টমেন্ট নেওয়া কিংবা ভিডিও কলে কথা বলা—বয়স্কদের জন্য প্রযুক্তির বাধা দূর করছি আমরা।","Whether scheduling in-person visits or assisting with video consultations, we bridge the technology gap for the elderly.","/admin/customize/[id]"],
      ["Hero Slider","Slide 2","Primary Button","ডাক্তার খুঁজুন","Find a Doctor","/admin/customize/[id]"],
      ["Hero Slider","Slide 2","Secondary Button","পরামর্শ নিন","Consult Now","/admin/customize/[id]"],
      ["Hero Slider","Slide 2","Background Image","/images/hero/doctor-service.jpg","/images/hero/doctor-service.jpg","/admin/customize/[id]"],
      ["Hero Slider","Slide 3","Badge","ঔষধ ব্যবস্থাপনা","Medicine Management","/admin/customize/[id]"],
      ["Hero Slider","Slide 3","Trust Line","💊 সঠিক ঔষধ · রেগুলার ফলোআপ","💊 Authentic Medicine · Regular Follow-up","/admin/customize/[id]"],
      ["Hero Slider","Slide 3","Headline","সঠিক ঔষধ, সঠিক সময়ে— নিয়মিত সেবনের নিশ্চয়তা।","The right medicine on time— with guaranteed adherence.","/admin/customize/[id]"],
      ["Hero Slider","Slide 3","Sub Text","শুধু ঔষধ পৌঁছে দেওয়াই নয়, বরং প্রেসক্রিপশন অনুযায়ী তারা ঠিকমতো ঔষধ খাচ্ছেন কি না—তার দৈনন্দিন মনিটরিং আমাদের দায়িত্ব।","Beyond just delivering prescriptions, we actively monitor their daily intake so you never have to worry about missed doses.","/admin/customize/[id]"],
      ["Hero Slider","Slide 3","Primary Button","ঔষধ অর্ডার করুন","Order Medicine","/admin/customize/[id]"],
      ["Hero Slider","Slide 3","Secondary Button","শিডিউল ম্যানেজমেন্ট","Manage Schedule","/admin/customize/[id]"],
      ["Hero Slider","Slide 3","Background Image","/images/hero/medicine-service.jpg","/images/hero/medicine-service.jpg","/admin/customize/[id]"],
      ["Hero Slider","Slide 4","Badge","জরুরি পরিস্থিতি","Emergency Services","/admin/customize/[id]"],
      ["Hero Slider","Slide 4","Trust Line","⚡ ইমার্জেন্সি রেসপন্স প্রটোকল · অভিজ্ঞ টিম","⚡ Emergency Response Protocol · Expert Team","/admin/customize/[id]"],
      ["Hero Slider","Slide 4","Headline","যেকোনো মেডিকেল ইমার্জেন্সিতে আপনার প্রথম ভরসা।","Your first line of defense in any medical crisis.","/admin/customize/[id]"],
      ["Hero Slider","Slide 4","Sub Text","অ্যাম্বুলেন্স ডাকা থেকে হাসপাতালে ভর্তি এবং প্রথম মুহূর্তের ব্যবস্থাপনা—সংকটময় সময়ে আমরা নেবো দ্রুততম ও সঠিক সিদ্ধান্ত।","From arranging ambulances to hospital admission and critical initial care—we take swift, structured action when seconds matter.","/admin/customize/[id]"],
      ["Hero Slider","Slide 4","Primary Button","জরুরি হটলাইন","Emergency Hotline","/admin/customize/[id]"],
      ["Hero Slider","Slide 4","Secondary Button","আমাদের সক্ষমতা","Our Capabilities","/admin/customize/[id]"],
      ["Hero Slider","Slide 4","Background Image","/images/hero/emergency-service.jpg","/images/hero/emergency-service.jpg","/admin/customize/[id]"],
      ["Hero Slider","Slide 5","Badge","দৈনন্দিন প্রয়োজন","Daily Needs","/admin/customize/[id]"],
      ["Hero Slider","Slide 5","Trust Line","🤝 ব্যাকগ্রাউন্ড-চেকড সহকারী · নিরাপদ যাতায়াত","🤝 Background-checked Assistants · Safe Travel","/admin/customize/[id]"],
      ["Hero Slider","Slide 5","Headline","ছোট ছোট প্রয়োজনে, নির্ভরযোগ্য সঙ্গী।","A reliable companion for life's little hurdles.","/admin/customize/[id]"],
      ["Hero Slider","Slide 5","Sub Text","সকালে বাজার করা, ব্যাংকে যাওয়া কিংবা আত্মীয়ের বাসায় ঘুরে আসা—আমাদের সহকারীরা তাদের স্বনির্ভরতা বজায় রাখতে সাহায্য করবে।","Whether it's morning groceries, a bank visit, or a social call—our assistants help them maintain their independence safely.","/admin/customize/[id]"],
      ["Hero Slider","Slide 5","Primary Button","সহকারী বুক করুন","Book Assistant","/admin/customize/[id]"],
      ["Hero Slider","Slide 5","Secondary Button","কীভাবে কাজ করে","How It Works","/admin/customize/[id]"],
      ["Hero Slider","Slide 5","Background Image","/images/hero/daily-needs.jpg","/images/hero/daily-needs.jpg","/admin/customize/[id]"],
      ["Hero Slider","Slide 6","Badge","মানসিক সুস্থতা","Mental Wellness","/admin/customize/[id]"],
      ["Hero Slider","Slide 6","Trust Line","🧠 এমপ্যাথেটিক লিসেনিং · গুণগত সময়","🧠 Empathetic Listening · Quality Time","/admin/customize/[id]"],
      ["Hero Slider","Slide 6","Headline","বার্ধক্যে একাকীত্ব নয়, প্রয়োজন একজন ভালো শ্রোতার।","Combating isolation with genuine companionship.","/admin/customize/[id]"],
      ["Hero Slider","Slide 6","Sub Text","একসাথে চা খাওয়া, পত্রিকা পড়ে শোনানো কিংবা শুধু গল্প করা—তাদের মানসিক প্রফুল্লতা ও একাকীত্ব কাটাতে আমরা দিচ্ছি মানসম্পন্ন সময়।","Sharing a cup of tea, reading the news, or simply listening to their stories—we provide quality time to support their mental well-being.","/admin/customize/[id]"],
      ["Hero Slider","Slide 6","Primary Button","কথা বলুন","Speak With Us","/admin/customize/[id]"],
      ["Hero Slider","Slide 6","Secondary Button","আমাদের কাউন্সেলর","Our Counselors","/admin/customize/[id]"],
      ["Hero Slider","Slide 6","Background Image","/images/hero/mental-wellness.jpg","/images/hero/mental-wellness.jpg","/admin/customize/[id]"],
      ["Hero Slider","Slide 7","Badge","পারিবারিক প্রতিশ্রুতি","Familial Promise","/admin/customize/[id]"],
      ["Hero Slider","Slide 7","Trust Line","🛡️ শতভাগ স্বচ্ছতা · জিরো কমপ্লেইন পলিসি","🛡️ 100% Transparency · Zero Complaint Policy","/admin/customize/[id]"],
      ["Hero Slider","Slide 7","Headline","আপনার অনুপস্থিতিতে, পারিবারিক স্নেহের প্রতিশ্রুতি।","In your absence, the promise of familial care.","/admin/customize/[id]"],
      ["Hero Slider","Slide 7","Sub Text","আমরা শুধু সেবাদানকারী নই। প্রবাসে বা কর্মব্যস্ততায় থাকা সন্তানদের প্রতিনিধি হিসেবে আমরা আপনার মা-বাবার দায়িত্ব নিচ্ছি পরম মমতায়।","We are more than service providers. As representatives of busy or expatriate children, we take responsibility for your parents with utmost devotion.","/admin/customize/[id]"],
      ["Hero Slider","Slide 7","Primary Button","আস্থা রাখুন","Trust in Us","/admin/customize/[id]"],
      ["Hero Slider","Slide 7","Secondary Button","ফাউন্ডারের কথা","Message From Founder","/admin/customize/[id]"],
      ["Hero Slider","Slide 7","Background Image","/images/hero/brand-trust.jpg","/images/hero/brand-trust.jpg","/admin/customize/[id]"],
    ]
  },
  {
    name: "2. Trust Banner",
    rows: [
      ["Trust Banner","Stat 1","Number","৫০০+","500+","/admin/customize/[id]"],
      ["Trust Banner","Stat 1","Title","পরিবারের নির্ভরতা","Families Trust Us","/admin/customize/[id]"],
      ["Trust Banner","Stat 1","Sub Text","যারা আমাদের ওপর আস্থা রেখেছেন","Who rely on our care daily","/admin/customize/[id]"],
      ["Trust Banner","Stat 2","Number","১০০%","100%","/admin/customize/[id]"],
      ["Trust Banner","Stat 2","Title","ভেরিফাইড স্টাফ","Verified Caregivers","/admin/customize/[id]"],
      ["Trust Banner","Stat 2","Sub Text","পুলিশ ভেরিফাইড ও ট্রেইনড","Police verified & trained","/admin/customize/[id]"],
      ["Trust Banner","Stat 3","Number","৩০+","30+","/admin/customize/[id]"],
      ["Trust Banner","Stat 3","Title","বিশেষজ্ঞ চিকিৎসক","Specialist Doctors","/admin/customize/[id]"],
      ["Trust Banner","Stat 3","Sub Text","সার্বক্ষণিক মেডিকেল সাপোর্টে","Round-the-clock medical support","/admin/customize/[id]"],
    ]
  },
  {
    name: "3. About Us",
    rows: [
      ["About Us","—","Badge","আমাদের ভাবনা","Our Philosophy","/admin/customize/[id]"],
      ["About Us","—","Tagline","আপনার প্রিয়জন থাকুন আমাদের বিশ্বস্ত ও আন্তরিক যত্নে।","Your loved ones are in our trusted and attentive care.","/admin/customize/[id]"],
      ["About Us","—","Vision Title","ভিশন","Vision","/admin/customize/[id]"],
      ["About Us","—","Vision Text","বাংলাদেশে বয়স্ক বাবা–মা ও প্রিয়জনদের জন্য নিরাপদ, সম্মানজনক ও মানবিক যত্ন নিশ্চিত করে একটি বিশ্বস্ত ও নির্ভরযোগ্য কেয়ারগিভিং সেবার মানদণ্ড প্রতিষ্ঠা করা।","To establish a trusted and reliable caregiving standard by ensuring safe, respectful, and humane care for elderly parents in Bangladesh.","/admin/customize/[id]"],
      ["About Us","—","Mission Title","মিশন","Mission","/admin/customize/[id]"],
      ["About Us","—","Mission Text","প্রশিক্ষিত কেয়ারগিভার, পেশাদার স্বাস্থ্যসেবা সমন্বয়, প্রযুক্তিনির্ভর যোগাযোগ এবং মানবিক সহায়তার মাধ্যমে বয়স্ক প্রিয়জনদের নিরাপদ ও সম্মানজনক জীবনযাপন নিশ্চিত করা।","To ensure a safe and dignified life for elderly loved ones through trained caregivers, healthcare coordination, and humane support.","/admin/customize/[id]"],
      ["About Us","—","Paragraph 1","জীবন ও জীবিকার প্রয়োজনে আজ অনেকেই দেশ ছেড়ে বিদেশে, অথবা নিজের শহর থেকে দূরে অন্য কোথাও বসবাস করছেন। চাইলেও তাদের প্রয়োজনে সবসময় পাশে থাকা সম্ভব হয় না। এই ভাবনা থেকেই নির্ভার কেয়ার–এর যাত্রা শুরু।","Driven by the necessities of life and career, many today live abroad or far from their hometowns. Even with the desire, it is not always possible to be by their side. This feeling of responsibility is what started Nirvaar Care.","/admin/customize/[id]"],
      ["About Us","—","Paragraph 2","আমাদের প্রদত্ত সেবার মাধ্যমে আমরা বয়োবৃদ্ধ বাবা–মা ও প্রিয়জনদের জন্য চিকিৎসা সংক্রান্ত সেবা গুলোর সমন্বয় করি। ডাক্তার ও হাসপাতাল ভিজিটের ব্যবস্থা করা সহ প্রয়োজনে ঘরে বসেই মেডিকেল টেস্ট ও রিপোর্ট ব্যবস্থাপনা নিশ্চিতকরণ করা হয়।","Through our services, we coordinate medical care for elderly parents. This includes arranging doctor visits, hospital appointments, and home-based medical tests and report management.","/admin/customize/[id]"],
      ["About Us","—","Paragraph 3","নির্ভার কেয়ার পরিচালিত হয় অভিজ্ঞ পেশাজীবীদের একটি দল এবং সম্মানিত চিকিৎসকদের পরামর্শে। আমরা পেশাদারীত্ব ও দক্ষতার সাথে মানবিক যত্নসমূহকে একত্রিত করি—কারণ আমরা বিশ্বাস করি, যত্ন শুধু একটি সেবা নয়, এটি একটি সম্পর্ক।","Nirvaar Care is operated by experienced professionals and guided by respected physicians. We integrate humane care with professionalism—because care is not just a service, it is a relationship.","/admin/customize/[id]"],
      ["About Us","—","Paragraph 4","আপনি পৃথিবীর যেখানেই থাকুন বিদেশে, অন্য শহরে বা ব্যস্ত জীবনের মাঝে, নির্ভার কেয়ার নিশ্চিত করে আপনার প্রিয় মানুষরা সঠিক সময়ে সঠিক যত্ন পাচ্ছেন। কারণ আমাদের কাছে তারা শুধু একজন সেবাগ্রহীতা নন, তারা পরিবার।","Wherever you are—abroad, another city, or a busy life—Nirvaar Care ensures your loved ones receive the right care at the right time. To us, they are not just clients, they are family.","/admin/customize/[id]"],
      ["About Us","—","Image 1 (Left)","/images/hero/mental-wellness.jpg","—","/admin/customize/[id]"],
      ["About Us","—","Image 2 (Right)","/images/hero/diagnostic-service.jpg","—","/admin/customize/[id]"],
      ["About Us","—","Experience Number","৫+","5+","/admin/customize/[id]"],
      ["About Us","—","Experience Label","বছরের অভিজ্ঞতা","Years of Trust","/admin/customize/[id]"],
    ]
  },
  {
    name: "4. Services Grid",
    rows: [
      ["Services Grid","Section","Badge","আমাদের সেবাসমূহ","Our Services","/admin/services"],
      ["Services Grid","Section","Title","আপনার প্রিয়জনের জন্য আমাদের বিশেষায়িত সেবা","Specialized Care for Your Loved Ones","/admin/services"],
      ["Services Grid","Service 1","Title","ডায়াগনস্টিক ও পরীক্ষা সেবা","Diagnostic & Medical Tests","/admin/services"],
      ["Services Grid","Service 1","Description","ডায়াগনস্টিক সেন্টারে যাতায়াত সহায়তা, সার্বিক তত্ত্বাবধান এবং ঘরে বসে পরীক্ষা করার সুবিধা।","Assistance with diagnostic center visits, overall supervision, and at-home testing facilities.","/admin/services"],
      ["Services Grid","Service 1","Tagline","সঠিক পরীক্ষা, সঠিক সময়ে—আপনার স্বাস্থ্য আমাদের দায়িত্ব।","The right test at the right time — your health is our responsibility.","/admin/services"],
      ["Services Grid","Service 1","Benefit 1","বাড়িতে বসেই স্যাম্পল সংগ্রহ","Sample collection at your doorstep","/admin/services"],
      ["Services Grid","Service 1","Benefit 2","ডিজিটাল রিপোর্ট ডেলিভারি","Digital report delivery to family","/admin/services"],
      ["Services Grid","Service 1","Benefit 3","ডায়াগনস্টিক সেন্টারে কেয়ারগিভার সঙ্গ","Caregiver escort to diagnostic center","/admin/services"],
      ["Services Grid","Service 1","Benefit 4","রিপোর্ট ব্যাখ্যায় ডাক্তার সহায়তা","Doctor assistance for report interpretation","/admin/services"],
      ["Services Grid","Service 1","Step 1","হেল্পলাইনে কল করুন এবং পরীক্ষার ধরন জানান","Call our helpline and specify the tests required","/admin/services"],
      ["Services Grid","Service 1","Step 2","আমাদের টিম সুবিধাজনক সময় ও কেন্দ্র নির্বাচন করে দেবে","Our team selects a convenient time & center for you","/admin/services"],
      ["Services Grid","Service 1","Step 3","কেয়ারগিভার প্রিয়জনকে সঙ্গ নিয়ে পরীক্ষা সম্পন্ন করবে","Caregiver accompanies your loved one for the tests","/admin/services"],
      ["Services Grid","Service 1","Step 4","রিপোর্ট ডিজিটালি পাঠানো হবে এবং ডাক্তারের পরামর্শ নেওয়া হবে","Report is shared digitally and doctor consultation is arranged","/admin/services"],
      ["Services Grid","Service 2","Title","চিকিৎসক-সম্পর্কিত সেবা","Doctor-related Services","/admin/services"],
      ["Services Grid","Service 2","Description","সরাসরি সাক্ষাতের সময় নির্ধারণ, সার্বিক সহায়তা ও অনলাইন চিকিৎসা পরামর্শ।","Scheduling in-person appointments, comprehensive assistance, and online medical consultations.","/admin/services"],
      ["Services Grid","Service 2","Tagline","সেরা চিকিৎসকের পরামর্শ, আপনার দোরগোড়ায়।","The best medical advice, brought to your doorstep.","/admin/services"],
      ["Services Grid","Service 2","Benefit 1","চিকিৎসকের অ্যাপয়েন্টমেন্ট নির্ধারণ","Doctor appointment scheduling & booking","/admin/services"],
      ["Services Grid","Service 2","Benefit 2","হাসপাতালে সঙ্গ করে নিয়ে যাওয়া","Physical escort to hospital & clinic","/admin/services"],
      ["Services Grid","Service 2","Benefit 3","অনলাইন ভিডিও কনসালটেশন সহায়তা","Assisted online video consultation","/admin/services"],
      ["Services Grid","Service 2","Benefit 4","ফলো-আপ অ্যাপয়েন্টমেন্ট ট্র্যাকিং","Follow-up appointment tracking & reminders","/admin/services"],
      ["Services Grid","Service 2","Step 1","ডাক্তারের বিশেষত্ব ও পছন্দ জানান","Tell us the specialty and doctor preference","/admin/services"],
      ["Services Grid","Service 2","Step 2","আমরা সেরা ও সুবিধাজনক অ্যাপয়েন্টমেন্ট বুক করব","We book the best available appointment","/admin/services"],
      ["Services Grid","Service 2","Step 3","নির্ধারিত দিনে কেয়ারগিভার সঙ্গে থাকবে","Caregiver stays with them on the appointment day","/admin/services"],
      ["Services Grid","Service 2","Step 4","ডাক্তারের পরামর্শ এবং প্রেসক্রিপশন পরিবারকে পাঠানো হবে","Doctor's advice & prescription is shared with family","/admin/services"],
      ["Services Grid","Service 3","Title","ঔষধ-সংক্রান্ত সেবা","Medicine-related Services","/admin/services"],
      ["Services Grid","Service 3","Description","ঔষধের চাহিদা নির্ধারণ, সময়মতো সংগ্রহ ও বাসায় পৌঁছে দেওয়া, সেবন পর্যবেক্ষণ এবং প্রয়োজনে চিকিৎসক পরামর্শ সমন্বয়।","Determining medicine needs, timely collection & home delivery, dosage monitoring, and doctor consultation coordination.","/admin/services"],
      ["Services Grid","Service 3","Tagline","সঠিক ঔষধ, সঠিক সময়ে—মিস হবে না একটি ডোজও।","The right medicine, on time — not a single dose missed.","/admin/services"],
      ["Services Grid","Service 3","Benefit 1","প্রেসক্রিপশন অনুযায়ী ঔষধ সংগ্রহ ও ডেলিভারি","Medicine collection & home delivery as per prescription","/admin/services"],
      ["Services Grid","Service 3","Benefit 2","ঔষধ সেবনের দৈনন্দিন পর্যবেক্ষণ","Daily monitoring of medicine intake","/admin/services"],
      ["Services Grid","Service 3","Benefit 3","সময়মতো সেবনের স্মার্ট রিমাইন্ডার","Smart reminders for timely consumption","/admin/services"],
      ["Services Grid","Service 3","Benefit 4","ঔষধ শেষ হওয়ার আগেই রিফিল ব্যবস্থা","Proactive refill before medicines run out","/admin/services"],
      ["Services Grid","Service 3","Step 1","প্রেসক্রিপশনের ছবি বা তালিকা পাঠান","Send us a photo or list of the prescription","/admin/services"],
      ["Services Grid","Service 3","Step 2","আমরা ঔষধ সংগ্রহ করে বাড়িতে পৌঁছে দেব","We procure and deliver medicines to their home","/admin/services"],
      ["Services Grid","Service 3","Step 3","কেয়ারগিভার নিশ্চিত করবে সঠিক সময়ে সেবন হচ্ছে","Caregiver ensures medicines are taken at right times","/admin/services"],
      ["Services Grid","Service 3","Step 4","পরিবারকে নিয়মিত আপডেট জানানো হবে","Regular updates are shared with the family","/admin/services"],
      ["Services Grid","Service 4","Title","জরুরি পরিস্থিতি সেবা","Emergency Services","/admin/services"],
      ["Services Grid","Service 4","Description","সার্বিক তত্ত্বাবধান ও সমন্বয়, অ্যাম্বুলেন্স ব্যবস্থা, হাসপাতালে ভর্তি সহায়তা ও অ্যাটেনডেন্ট সেবা প্রদান।","Overall supervision and coordination, ambulance arrangements, hospital admission assistance, and attendant services.","/admin/services"],
      ["Services Grid","Service 4","Tagline","সংকটের মুহূর্তে, আমরাই আপনার প্রথম ভরসা।","In a crisis, we are your very first call.","/admin/services"],
      ["Services Grid","Service 4","Benefit 1","দ্রুত অ্যাম্বুলেন্স সমন্বয়","Rapid ambulance coordination","/admin/services"],
      ["Services Grid","Service 4","Benefit 2","হাসপাতালে ভর্তি ও ডকুমেন্টেশন সহায়তা","Hospital admission & documentation support","/admin/services"],
      ["Services Grid","Service 4","Benefit 3","অ্যাটেনডেন্ট সহায়তা সেবা","Professional attendant service during emergency","/admin/services"],
      ["Services Grid","Service 4","Benefit 4","পরিবারকে রিয়েল-টাইম আপডেট","Real-time family updates during crisis","/admin/services"],
      ["Services Grid","Service 4","Step 1","আমাদের ইমার্জেন্সি হটলাইনে কল করুন","Call our 24/7 emergency hotline immediately","/admin/services"],
      ["Services Grid","Service 4","Step 2","আমাদের টিম দ্রুত পরিস্থিতি মূল্যায়ন করবে","Our team rapidly assesses the situation","/admin/services"],
      ["Services Grid","Service 4","Step 3","অ্যাম্বুলেন্স ও মেডিকেল সাপোর্ট পাঠানো হবে","Ambulance & medical support is dispatched","/admin/services"],
      ["Services Grid","Service 4","Step 4","হাসপাতালে ভর্তি সম্পন্ন হওয়া পর্যন্ত আমরা সঙ্গে থাকব","We stay until full hospital admission is complete","/admin/services"],
      ["Services Grid","Service 5","Title","দৈনন্দিন প্রয়োজন সেবা","Daily Needs Services","/admin/services"],
      ["Services Grid","Service 5","Description","বাজার করা, আত্মীয়ের বাড়ি, মার্কেট ও ব্যাংকে যাতায়াত বা ঘোরাফেরায় পরিবহন ও সহকারীসহ সহায়তা প্রদান।","Grocery shopping, transport & assistant support for visiting relatives, markets, banks, or casual outings.","/admin/services"],
      ["Services Grid","Service 5","Tagline","দৈনন্দিন ছোট প্রয়োজনে, একজন বিশ্বস্ত সঙ্গী।","A trusted companion for every daily need.","/admin/services"],
      ["Services Grid","Service 5","Benefit 1","বাজার ও প্রয়োজনীয় কেনাকাটায় সহায়তা","Assistance with grocery & essential shopping","/admin/services"],
      ["Services Grid","Service 5","Benefit 2","ব্যাংক, মার্কেট ও আত্মীয় বাড়িতে নিরাপদ যাতায়াত","Safe transport to bank, market & relatives","/admin/services"],
      ["Services Grid","Service 5","Benefit 3","ব্যাকগ্রাউন্ড-চেকড সহকারী","Background-checked & verified assistants","/admin/services"],
      ["Services Grid","Service 5","Benefit 4","স্বাধীনতা ও স্বনির্ভরতা বজায় রাখতে সহায়তা","Helping maintain independence & mobility","/admin/services"],
      ["Services Grid","Service 5","Step 1","প্রয়োজনের তালিকা বা গন্তব্য জানান","Share the list of needs or destination","/admin/services"],
      ["Services Grid","Service 5","Step 2","আমরা উপযুক্ত সহকারী নির্ধারণ করব","We assign the right verified assistant","/admin/services"],
      ["Services Grid","Service 5","Step 3","নির্ধারিত সময়ে সহকারী প্রিয়জনের কাছে পৌঁছাবে","Assistant arrives at the scheduled time","/admin/services"],
      ["Services Grid","Service 5","Step 4","কাজ সম্পন্ন হয়ে প্রিয়জনকে নিরাপদে ঘরে ফিরিয়ে দেওয়া হবে","Task completed & loved one returned home safely","/admin/services"],
      ["Services Grid","Service 6","Title","মানসিক সঙ্গ ও সুস্থতা সেবা","Companionship & Wellness","/admin/services"],
      ["Services Grid","Service 6","Description","সঙ্গ দেওয়া ও গল্প করা, বই বা পত্রিকা পড়ে শোনানো, কাউন্সেলিং এবং মানসিক প্রফুল্লতা বজায় রাখতে সহায়তা প্রদান।","Providing companionship & conversation, reading books, counseling, and helping maintain mental cheerfulness.","/admin/services"],
      ["Services Grid","Service 6","Tagline","বার্ধক্যের একাকীত্বে, একজন আন্তরিক বন্ধু।","In the loneliness of old age, a genuinely caring friend.","/admin/services"],
      ["Services Grid","Service 6","Benefit 1","গল্প করা ও মানসম্পন্ন সময় কাটানো","Meaningful conversation & quality companionship","/admin/services"],
      ["Services Grid","Service 6","Benefit 2","বই, পত্রিকা পড়ে শোনানো","Reading books, newspapers aloud to them","/admin/services"],
      ["Services Grid","Service 6","Benefit 3","পেশাদার কাউন্সেলিং সংযোগ","Connection to professional counseling","/admin/services"],
      ["Services Grid","Service 6","Benefit 4","শখ ও আগ্রহভিত্তিক কার্যক্রমে সহায়তা","Support for hobbies & interest-based activities","/admin/services"],
      ["Services Grid","Service 6","Step 1","প্রিয়জনের পছন্দ ও ব্যক্তিত্ব সম্পর্কে আমাদের জানান","Tell us about their personality & preferences","/admin/services"],
      ["Services Grid","Service 6","Step 2","আমরা সর্বোচ্চ মানানসই একজন কম্পেনিয়ন নির্বাচন করব","We match them with the most suitable companion","/admin/services"],
      ["Services Grid","Service 6","Step 3","নির্ধারিত সময়ে কম্পেনিয়ন তাদের সঙ্গে থাকবে","Companion visits at scheduled times","/admin/services"],
      ["Services Grid","Service 6","Step 4","পরিবারকে নিয়মিত মানসিক স্বাস্থ্যের আপডেট দেওয়া হবে","Family receives regular mental wellness updates","/admin/services"],
    ]
  },
  {
    name: "5. How It Works",
    rows: [
      ["How It Works","Section","Badge","আমাদের কাজের ধাপ","How It Works","/admin/customize/[id]"],
      ["How It Works","Section","Title","মাত্র ৪টি সহজ ধাপে আমাদের সেবা গ্রহণ করুন","Get Our Care in 4 Simple Steps","/admin/customize/[id]"],
      ["How It Works","Step 1","Title","যোগাযোগ ও আলোচনা","Contact & Consult","/admin/customize/[id]"],
      ["How It Works","Step 1","Description","আমাদের হেল্পলাইনে কল করুন এবং আপনার রোগীর বর্তমান সার্বিক অবস্থা ও প্রয়োজনীয়তা নিয়ে বিস্তারিত আলোচনা করুন।","Call our helpline and discuss your patient's current overall condition and requirements in detail.","/admin/customize/[id]"],
      ["How It Works","Step 2","Title","সমস্যা মূল্যায়ন (Assessment)","Patient Assessment","/admin/customize/[id]"],
      ["How It Works","Step 2","Description","আমাদের বিশেষজ্ঞ দল রোগীর শারীরিক ও মানসিক অবস্থা যাচাই করে সঠিক সেবার পরিধি নির্ধারণ করবেন।","Our expert team will evaluate the patient's physical and mental state to determine the scope of care.","/admin/customize/[id]"],
      ["How It Works","Step 3","Title","কাস্টম কেয়ার প্ল্যান","Custom Care Plan","/admin/customize/[id]"],
      ["How It Works","Step 3","Description","মূল্যায়নের ওপর ভিত্তি করে সম্পূর্ণ কাস্টমাইজড একটি কেয়ার প্ল্যান ও সঠিক কেয়ারগিভার নির্বাচন করা হবে।","A fully customized care plan will be created and the right caregiver will be selected based on the assessment.","/admin/customize/[id]"],
      ["How It Works","Step 4","Title","নিশ্চিন্ত সেবা শুরু","Care Starts","/admin/customize/[id]"],
      ["How It Works","Step 4","Description","আমাদের ডেডিকেটেড কেয়ারগিভার কাজ শুরু করবেন এবং আমরা নিয়মিত সেবার মান পর্যবেক্ষণ ও সমন্বয় করব।","Our dedicated caregiver begins their work, and we continuously monitor and coordinate the quality of care.","/admin/customize/[id]"],
    ]
  },
  {
    name: "6. Why Choose Us",
    rows: [
      ["Why Choose Us","Section","Badge","কেন আমরা আলাদা?","Why Choose Us?","/admin/customize/[id]"],
      ["Why Choose Us","Section","Title","কেন নির্ভার কেয়ার আপনার প্রিয়জনের জন্য সেরা পছন্দ?","Why Nirvaar Care is the Best Choice for Your Loved Ones?","/admin/customize/[id]"],
      ["Why Choose Us","Feature 1","Title","প্রশিক্ষিত ও বিশ্বস্ত কেয়ারগিভার","Trained & Trusted Caregivers","/admin/customize/[id]"],
      ["Why Choose Us","Feature 1","Description","আমাদের কর্মীরা ব্যাকগ্রাউন্ড-চেকড এবং বিশেষায়িত কেয়ারগিভিং ট্রেনিং প্রাপ্ত, যা আপনার প্রিয়জনের সুরক্ষা নিশ্চিত করে।","Our staff are background-checked and have received specialized caregiving training to ensure the safety of your loved ones.","/admin/customize/[id]"],
      ["Why Choose Us","Feature 2","Title","ডাক্তারের সার্বক্ষণিক সরাসরি নজরদারি","Continuous Doctor Supervision","/admin/customize/[id]"],
      ["Why Choose Us","Feature 2","Description","প্রতিটি কেয়ার প্ল্যান ও রোগীর প্রগ্রেস সরাসরি আমাদের বিশেষজ্ঞ চিকিৎসকরা মনিটর করেন, কোনো আপস ছাড়াই।","Every care plan and patient progress is directly monitored by our expert physicians without compromise.","/admin/customize/[id]"],
      ["Why Choose Us","Feature 3","Title","শতভাগ স্বচ্ছতা ও নিয়মিত আপডেট","100% Transparency & Updates","/admin/customize/[id]"],
      ["Why Choose Us","Feature 3","Description","রোগীর প্রতিদিনের অবস্থা, ওষুধ এবং ভাইটালস-এর ডিজিটাল আপডেট পরিবারকে নিয়মিত জানানো হয়।","Families receive daily digital updates on the patient's condition, medications, and vitals regularly.","/admin/customize/[id]"],
      ["Why Choose Us","Feature 4","Title","২৪/৭ ইমার্জেন্সি সাপোর্ট","24/7 Emergency Support","/admin/customize/[id]"],
      ["Why Choose Us","Feature 4","Description","যেকোনো জরুরি স্বাস্থ্য পরিস্থিতিতে আমাদের রেসকিউ ও মেডিকেল সাপোর্ট টিম সবসময় প্রস্তুত থাকে।","Our rescue and medical support team is always ready for any emergency health situation, day or night.","/admin/customize/[id]"],
    ]
  },
  {
    name: "7. Testimonials",
    rows: [
      ["Testimonials","Section","Badge","গ্রাহকদের মতামত","Client Stories","/admin/customize/[id]"],
      ["Testimonials","Section","Title","আমাদের সেবায় যারা আস্থা রেখেছেন","What Our Clients Say About Us","/admin/customize/[id]"],
      ["Testimonials","Review 1","Name","রহমান ফ্যামিলি","The Rahman Family","/admin/customize/[id]"],
      ["Testimonials","Review 1","Location","ঢাকা, বাংলাদেশ","Dhaka, Bangladesh","/admin/customize/[id]"],
      ["Testimonials","Review 1","Rating","৫/৫","5/5","/admin/customize/[id]"],
      ["Testimonials","Review 1","Quote","নির্ভার কেয়ারের নার্সিং সেবা সত্যিই অসাধারণ। আমার বাবার স্ট্রোকের পর তারা যেভাবে যত্ন নিয়েছে, তা ভাষায় প্রকাশ করার মতো নয়। তাদের কেয়ারগিভাররা খুবই আন্তরিক।","Nirvaar Care's nursing service is truly exceptional. The way they took care of my father after his stroke is beyond words. Their caregivers are highly sincere.","/admin/customize/[id]"],
      ["Testimonials","Review 2","Name","ফাতেমা আক্তার","Fatema Akter","/admin/customize/[id]"],
      ["Testimonials","Review 2","Location","প্রবাসী বাংলাদেশি, ইউকে","Expat, UK","/admin/customize/[id]"],
      ["Testimonials","Review 2","Rating","৫/৫","5/5","/admin/customize/[id]"],
      ["Testimonials","Review 2","Quote","বিদেশে থেকে মায়ের অসুস্থতা নিয়ে খুব চিন্তায় ছিলাম। নির্ভার কেয়ারের সার্বক্ষণিক আপডেট এবং ডাক্তারের সাপোর্ট আমাকে পুরোপুরি নিশ্চিন্ত করেছে। অনেক ধন্যবাদ!","Being abroad, I was very worried about my mother's illness. Nirvaar Care's constant updates and doctor support gave me complete peace of mind. Thank you!","/admin/customize/[id]"],
      ["Testimonials","Review 3","Name","শফিকুল ইসলাম","Shafiqul Islam","/admin/customize/[id]"],
      ["Testimonials","Review 3","Location","চট্টগ্রাম, বাংলাদেশ","Chattogram, Bangladesh","/admin/customize/[id]"],
      ["Testimonials","Review 3","Rating","৫/৫","5/5","/admin/customize/[id]"],
      ["Testimonials","Review 3","Quote","জরুরি মুহূর্তে মাত্র ৩০ মিনিটের মধ্যে তাদের অ্যাম্বুলেন্স এবং মেডিকেল টিম আমাদের বাসায় পৌঁছেছিল। তাদের প্রফেশনালিজম সত্যিই প্রশংসার দাবিদার।","During an emergency, their ambulance and medical team reached our home in just 30 minutes. Their professionalism genuinely deserves praise.","/admin/customize/[id]"],
    ]
  },
  {
    name: "8. Emergency CTA",
    rows: [
      ["Emergency CTA","—","Title","জরুরি মেডিকেল সহায়তা প্রয়োজন?","Need Immediate Medical Assistance?","/admin/customize/[id]"],
      ["Emergency CTA","—","Description","আমাদের ইমার্জেন্সি রেসপন্স টিম ২৪/৭ প্রস্তুত। অ্যাম্বুলেন্স, অক্সিজেন বা জরুরি নার্সিং সেবার জন্য এখনই কল করুন।","Our emergency response team is available 24/7. Call us now for ambulance, oxygen, or urgent nursing care.","/admin/customize/[id]"],
      ["Emergency CTA","—","Button Text","কল করুন: +৮৮০ ১৭০০-০০০০০০","Call Now: +880 1700-000000","/admin/customize/[id]"],
      ["Emergency CTA","—","Phone Number","+8801700000000","+8801700000000","/admin/customize/[id]"],
    ]
  }
];

const wb = XLSX.utils.book_new();
const HEADER = ["Section", "Item", "Field", "বাংলা Content", "English Content", "Admin URL"];

sections.forEach(sec => {
  const wsData = [HEADER, ...sec.rows];
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Column widths
  ws['!cols'] = [
    { wch: 16 }, { wch: 12 }, { wch: 24 },
    { wch: 52 }, { wch: 52 }, { wch: 24 }
  ];

  XLSX.utils.book_append_sheet(wb, ws, sec.name.substring(0, 31));
});

const outPath = 'D:\\HomeRemote\\Desktop\\NirvaarCare_Homepage_Content.xlsx';
XLSX.writeFile(wb, outPath, { bookType: 'xlsx', type: 'file' });
console.log('✅ Saved to:', outPath);
