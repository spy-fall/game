// Game Data for Spyfall PWA
const GAME_DATA = {
    // Language settings
    currentLanguage: 'en', // 'en' for English, 'fa' for Persian
    
    // Set current language
    setLanguage: function(lang) {
        if (lang === 'en' || lang === 'fa') {
            this.currentLanguage = lang;
            // Store in localStorage for persistence
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('spyfall-language', lang);
            }
        }
    },

    // Get current language
    getLanguage: function() {
        // Try to get from localStorage first
        if (typeof localStorage !== 'undefined') {
            const savedLang = localStorage.getItem('spyfall-language');
            if (savedLang === 'en' || savedLang === 'fa') {
                this.currentLanguage = savedLang;
            }
        }
        return this.currentLanguage;
    },

    // Get localized location name
    getLocationName: function(locationName) {
        const language = this.currentLanguage;
        if (language === 'fa' && this.persianLocations[locationName]) {
            return this.persianLocations[locationName];
        }
        return locationName; // Return English by default
    },

    // Persian translations for location names only
    persianLocations: {
        // Original Locations
        'Airport Terminal': 'ترمینال فرودگاه',
        'Shopping Mall': 'مرکز خرید',
        'Amusement Park': 'پارک تفریحی',
        'University Campus': 'محوطه دانشگاه',
        'Zoo': 'باغ وحش',
        'Farm': 'مزرعه',
        'High School': 'دبیرستان',
        'Movie Theater': 'سینما',
        'Fire Station': 'ایستگاه آتش‌نشانی',
        'Office Building': 'ساختمان اداری',
        'Airport Control Tower': 'برج کنترل فرودگاه',
        'Bus Station': 'ایستگاه اتوبوس',
        'Harbor': 'بندر',
        'Space Shuttle Launch Site': 'سایت پرتاب شاتل فضایی',
        'Train Station': 'ایستگاه قطار',
        'Nightclub': 'کلوپ شبانه',
        'Concert Venue': 'محل کنسرت',
        'Airplane': 'هواپیما',
        'Art Museum': 'موزه هنر',
        'Bank': 'بانک',
        'Stadium': 'ورزشگاه',
        'Beach': 'ساحل',
        'Brewery': 'آبجوسازی',
        'Theater': 'تئاتر',
        'Casino': 'کازینو',
        'Cemetery': 'قبرستان',
        'Circus Tent': 'سیرک',
        'Construction Site': 'محل ساخت و ساز',
        'Corporate Party': 'مهمانی شرکت',
        'Gas Station': 'پمپ بنزین',
        'Golden Gate Bridge': 'پل گلدن گیت',
        'Hospital': 'بیمارستان',
        'Hotel': 'هتل',
        'Jail': 'زندان',
        'Library': 'کتابخانه',
        'Park': 'پارک',
        'Mechanic Shop': 'تعمیرگاه',
        'Military Base': 'پایگاه نظامی',
        'Train': 'قطار',
        'Pirate Ship': 'کشتی دزدان دریایی',
        'Police Station': 'کلانتری',
        'Post-Office': 'دفتر پست',
        'Restaurant': 'رستوران',
        'Retirement Home': 'خانه سالمندان',
        'Ski Resort': 'پیست اسکی',
        'Space Station': 'ایستگاه فضایی',
        'Submarine': 'زیردریایی',
        'Subway': 'مترو',
        'Vineyard': 'تاکستان',
        
        // Home & Daily Life
        'Kitchen': 'آشپزخانه',
        'Living Room': 'اتاق نشیمن',
        'Bedroom': 'اتاق خواب',
        'Bathroom': 'حمام',
        'Dining Room': 'اتاق غذاخوری',
        'Garage': 'گاراژ',
        'Backyard': 'حیاط پشتی',
        'Balcony': 'بالکن',
        'Basement': 'زیرزمین',
        'Attic': 'اتاق زیر شیروانی',
        'Porch': 'ایوان',
        'Front Yard': 'حیاط جلو',
        'Home Office': 'دفتر خانه',
        'Closet': 'کمد',
        'Laundry Room': 'اتاق رختشویی',
        'Hallway': 'راهرو',
        'Guest Room': 'اتاق مهمان',
        'Pantry': 'انباری',
        'Staircase': 'پلکان',
        'Playroom': 'اتاق بازی',
        
        // School & Learning
        'Classroom': 'کلاس درس',
        'Playground': 'زمین بازی',
        'Cafeteria': 'سلف سرویس',
        'Gym': 'سالن ورزش',
        'Art Room': 'اتاق هنر',
        'Music Room': 'اتاق موسیقی',
        'Science Lab': 'آزمایشگاه علوم',
        'Computer Lab': 'آزمایشگاه کامپیوتر',
        'Restroom': 'سرویس بهداشتی',
        'Locker Room': 'اتاق رختکن',
        'Principal\'s Office': 'دفتر مدیر',
        'School Bus': 'اتوبوس مدرسه',
        'Teacher\'s Lounge': 'اتاق معلمان',
        'Sports Field': 'زمین ورزش',
        'Auditorium': 'سالن اجتماعات',
        'Nurse\'s Office': 'دفتر پرستار',
        'Front Office': 'دفتر جلو',
        'School Entrance': 'ورودی مدرسه',
        
        // City & Public Places
        'Museum': 'موزه',
        'Post Office': 'دفتر پست',
        'Community Center': 'مرکز محله',
        'City Hall': 'شهرداری',
        'Public Restroom': 'سرویس بهداشتی عمومی',
        'Street Corner': 'گوشه خیابان',
        'Bus Stop': 'ایستگاه اتوبوس',
        'Fountain Plaza': 'میدان فواره',
        'Parking Lot': 'پارکینگ',
        'Sidewalk': 'پیاده‌رو',
        'Apartment Lobby': 'لابی آپارتمان',
        
        // Shopping & Services
        'Supermarket': 'سوپرمارکت',
        'Grocery Store': 'فروشگاه مواد غذایی',
        'Bakery': 'نانوایی',
        'Clothing Store': 'فروشگاه لباس',
        'Shoe Store': 'فروشگاه کفش',
        'Bookstore': 'کتابفروشی',
        'Pharmacy': 'داروخانه',
        'Toy Store': 'فروشگاه اسباب بازی',
        'Hardware Store': 'فروشگاه ابزار',
        'Furniture Store': 'فروشگاه مبلمان',
        'Flower Shop': 'گل فروشی',
        'Electronics Store': 'فروشگاه الکترونیک',
        'Jewelry Store': 'فروشگاه جواهرات',
        'Barber Shop': 'آرایشگاه مردانه',
        'Hair Salon': 'آرایشگاه زنانه',
        'Pet Store': 'فروشگاه حیوانات خانگی',
        'Checkout Counter': 'صندوق پرداخت',
        'Mall Food Court': 'رستوران مرکز خرید',
        'Elevator in Mall': 'آسانسور مرکز خرید',
        'ATM': 'عابر بانک',
        
        // Food & Drink
        'Café': 'کافه',
        'Fast Food Place': 'فست فود',
        'Ice Cream Shop': 'بستنی فروشی',
        'Pizza Place': 'پیتزا فروشی',
        'Diner': 'رستوران کوچک',
        'Buffet': 'بوفه',
        'Coffee Shop': 'کافه قهوه',
        'Sandwich Shop': 'ساندویچ فروشی',
        'Juice Bar': 'آبمیوه فروشی',
        'Drive-Thru': 'پنجره رانندگی',
        'Tea House': 'چایخانه',
        'Food Truck': 'کامیون غذا',
        'Pub': 'پاب',
        'Bar': 'بار',
        'Takeout Counter': 'پیشخوان تحویل',
        'Outdoor Patio': 'تراس بیرونی',
        'Bakery Counter': 'پیشخوان نانوایی',
        'Smoothie Shop': 'اسموتی فروشی',
        'Sushi Bar': 'سوشی بار',
        
        // Travel & Transport
        'Airport': 'فرودگاه',
        'Ferry': 'کشتی مسافربری',
        'Taxi': 'تاکسی',
        'Subway Station': 'ایستگاه مترو',
        'Baggage Claim': 'تحویل چمدان',
        'Ticket Counter': 'پیشخوان بلیط',
        'Passport Control': 'کنترل پاسپورت',
        'Security Check': 'بازرسی امنیتی',
        'Cruise Ship': 'کشتی تفریحی',
        'Rest Stop': 'ایستگاه استراحت',
        'Highway': 'اتوبان',
        'Hotel Lobby': 'لابی هتل',
        'Rental Car Desk': 'میز اجاره خودرو',
        'Departure Gate': 'دروازه خروج',
        'Parking Garage': 'پارکینگ طبقاتی',
        
        // Sports & Recreation
        'Soccer Field': 'زمین فوتبال',
        'Basketball Court': 'زمین بسکتبال',
        'Tennis Court': 'زمین تنیس',
        'Baseball Field': 'زمین بیسبال',
        'Golf Course': 'زمین گلف',
        'Swimming Pool': 'استخر شنا',
        'Ice Rink': 'پیست یخ',
        'Bowling Alley': 'بولینگ',
        'Sports Bar': 'بار ورزشی',
        'Track Field': 'زمین دو و میدانی',
        'Skate Park': 'پارک اسکیت',
        'Fitness Studio': 'استودیو تناسب اندام',
        'Martial Arts Dojo': 'دوجو هنرهای رزمی',
        'Climbing Wall': 'دیوار صخره‌نوردی',
        'Yoga Room': 'اتاق یوگا',
        'Sports Store': 'فروشگاه ورزشی',
        'Bleachers': 'سکوهای تماشاچی',
        
        // Leisure & Outdoors
        'Lake': 'دریاچه',
        'River': 'رودخانه',
        'Forest': 'جنگل',
        'Mountain': 'کوه',
        'Campground': 'اردوگاه',
        'Picnic Area': 'محل پیک نیک',
        'Carnival': 'کارناوال',
        'Aquarium': 'آکواریوم',
        'Fishing Dock': 'اسکله ماهیگیری',
        'Garden': 'باغ',
        'Treehouse': 'خانه درختی',
        'Water Park': 'پارک آبی',
        'Boat Dock': 'اسکله قایق',
        'Campfire Spot': 'محل آتش کمپ',
        'Trailhead': 'شروع مسیر',
        'National Park': 'پارک ملی',
        'Lookout Point': 'نقطه دید',
        
        // Work & Professional
        'Office': 'دفتر',
        'Conference Room': 'اتاق کنفرانس',
        'Break Room': 'اتاق استراحت',
        'Reception Desk': 'میز پذیرش',
        'Copy Room': 'اتاق کپی',
        'Warehouse': 'انبار',
        'Factory': 'کارخانه',
        'Workshop': 'کارگاه',
        'Staff Kitchen': 'آشپزخانه کارکنان',
        'Customer Service Desk': 'میز خدمات مشتری',
        'Loading Dock': 'اسکله بارگیری',
        'Call Center': 'مرکز تماس',
        'Print Shop': 'چاپخانه',
        'Elevator': 'آسانسور',
        'Lobby': 'لابی',
        'Restroom': 'سرویس بهداشتی',
        'IT Room': 'اتاق فناوری اطلاعات',
        'Meeting Room': 'اتاق جلسه',
        'Job Interview Room': 'اتاق مصاحبه شغلی',
        
        // Health & Safety
        'Doctor\'s Office': 'مطب دکتر',
        'Dentist': 'مطب دندانپزشک',
        'Clinic': 'کلینیک',
        'Emergency Room': 'اتاق اورژانس',
        'Operating Room': 'اتاق عمل',
        'Waiting Room': 'اتاق انتظار',
        'X-Ray Room': 'اتاق اشعه ایکس',
        'Nurse Station': 'ایستگاه پرستار',
        'Blood Test Lab': 'آزمایشگاه خون',
        'Eye Doctor': 'چشم پزشک',
        'Health Center': 'مرکز سلامت',
        'Ambulance': 'آمبولانس',
        'Hospital Lobby': 'لابی بیمارستان',
        'Children\'s Ward': 'بخش کودکان',
        'Mental Health Room': 'اتاق سلامت روان',
        'Medical Supply Store': 'فروشگاه لوازم پزشکی',
        'Therapy Room': 'اتاق درمان',
        'Maternity Room': 'اتاق زایمان'
    },

    categories: [
        {
            id: 'original-locations',
            emoji: '',
            name: 'Original Locations',
            locations: [
                'Airport Terminal', 'Shopping Mall', 'Amusement Park', 'University Campus', 'Zoo',
                'Farm', 'High School', 'Movie Theater', 'Fire Station', 'Office Building',
                'Airport Control Tower', 'Bus Station', 'Harbor', 'Space Shuttle Launch Site', 'Train Station',
                'Nightclub', 'Concert Venue', 'Airplane', 'Art Museum', 'Bank',
                'Stadium', 'Beach', 'Brewery', 'Theater', 'Casino',
                'Cemetery', 'Circus Tent', 'Construction Site', 'Corporate Party', 'Gas Station',
                'Golden Gate Bridge', 'Hospital', 'Hotel', 'Jail', 'Library',
                'Park', 'Mechanic Shop', 'Military Base', 'Train', 'Pirate Ship',
                'Police Station', 'Post-Office', 'Restaurant', 'Retirement Home', 'Ski Resort',
                'Space Station', 'Submarine', 'Subway', 'Vineyard'
            ]
        },
        {
            id: 'home-daily-life',
            emoji: '',
            name: 'Home & Daily Life',
            locations: [
                'Kitchen', 'Living Room', 'Bedroom', 'Bathroom', 'Dining Room',
                'Garage', 'Backyard', 'Balcony', 'Basement', 'Attic',
                'Porch', 'Front Yard', 'Home Office', 'Closet', 'Laundry Room',
                'Hallway', 'Guest Room', 'Pantry', 'Staircase', 'Playroom'
            ]
        },
        {
            id: 'school-learning',
            emoji: '',
            name: 'School & Learning',
            locations: [
                'Classroom', 'Library', 'Playground', 'Cafeteria', 'Gym',
                'Art Room', 'Music Room', 'Science Lab', 'Computer Lab', 'Restroom',
                'Locker Room', 'Principal\'s Office', 'School Bus', 'Teacher\'s Lounge', 'Sports Field',
                'Auditorium', 'Nurse\'s Office', 'Hallway', 'Front Office', 'School Entrance'
            ]
        },
        {
            id: 'city-public-places',
            emoji: '',
            name: 'City & Public Places',
            locations: [
                'Park', 'Movie Theater', 'Museum', 'Post Office', 'Bank',
                'Police Station', 'Fire Station', 'Community Center', 'Gas Station', 'City Hall',
                'Playground', 'Public Restroom', 'Street Corner', 'Bus Stop', 'Train Station',
                'Fountain Plaza', 'Parking Lot', 'Sidewalk', 'Office Building', 'Apartment Lobby'
            ]
        },
        {
            id: 'shopping-services',
            emoji: '',
            name: 'Shopping & Services',
            locations: [
                'Supermarket', 'Grocery Store', 'Bakery', 'Clothing Store', 'Shoe Store',
                'Bookstore', 'Pharmacy', 'Toy Store', 'Hardware Store', 'Furniture Store',
                'Flower Shop', 'Electronics Store', 'Jewelry Store', 'Barber Shop', 'Hair Salon',
                'Pet Store', 'Checkout Counter', 'Mall Food Court', 'Elevator in Mall', 'ATM'
            ]
        },
        {
            id: 'food-drink',
            emoji: '',
            name: 'Food & Drink',
            locations: [
                'Restaurant', 'Café', 'Fast Food Place', 'Ice Cream Shop', 'Pizza Place',
                'Diner', 'Buffet', 'Coffee Shop', 'Sandwich Shop', 'Juice Bar',
                'Drive-Thru', 'Tea House', 'Food Truck', 'Pub', 'Bar',
                'Takeout Counter', 'Outdoor Patio', 'Bakery Counter', 'Smoothie Shop', 'Sushi Bar'
            ]
        },
        {
            id: 'travel-transport',
            emoji: '',
            name: 'Travel & Transport',
            locations: [
                'Airport', 'Airplane', 'Train', 'Subway', 'Ferry',
                'Bus', 'Taxi', 'Subway Station', 'Baggage Claim', 'Ticket Counter',
                'Passport Control', 'Security Check', 'Cruise Ship', 'Gas Station', 'Rest Stop',
                'Highway', 'Hotel Lobby', 'Rental Car Desk', 'Departure Gate', 'Parking Garage'
            ]
        },
        {
            id: 'sports-recreation',
            emoji: '',
            name: 'Sports & Recreation',
            locations: [
                'Soccer Field', 'Basketball Court', 'Tennis Court', 'Baseball Field', 'Golf Course',
                'Swimming Pool', 'Ice Rink', 'Bowling Alley', 'Stadium', 'Sports Bar',
                'Gym', 'Locker Room', 'Track Field', 'Skate Park', 'Fitness Studio',
                'Martial Arts Dojo', 'Climbing Wall', 'Yoga Room', 'Sports Store', 'Bleachers'
            ]
        },
        {
            id: 'leisure-outdoors',
            emoji: '',
            name: 'Leisure & Outdoors',
            locations: [
                'Beach', 'Lake', 'River', 'Forest', 'Mountain',
                'Campground', 'Picnic Area', 'Amusement Park', 'Carnival', 'Zoo',
                'Aquarium', 'Fishing Dock', 'Garden', 'Treehouse', 'Water Park',
                'Boat Dock', 'Campfire Spot', 'Trailhead', 'National Park', 'Lookout Point'
            ]
        },
        {
            id: 'work-professional',
            emoji: '',
            name: 'Work & Professional',
            locations: [
                'Office', 'Conference Room', 'Break Room', 'Reception Desk', 'Copy Room',
                'Warehouse', 'Factory', 'Construction Site', 'Workshop', 'Staff Kitchen',
                'Customer Service Desk', 'Loading Dock', 'Call Center', 'Print Shop', 'Elevator',
                'Lobby', 'Restroom', 'IT Room', 'Meeting Room', 'Job Interview Room'
            ]
        },
        {
            id: 'health-safety',
            emoji: '',
            name: 'Health & Safety',
            locations: [
                'Hospital', 'Doctor\'s Office', 'Dentist', 'Clinic', 'Emergency Room',
                'Operating Room', 'Pharmacy', 'Waiting Room', 'X-Ray Room', 'Nurse Station',
                'Blood Test Lab', 'Eye Doctor', 'Health Center', 'Ambulance', 'Hospital Lobby',
                'Children\'s Ward', 'Mental Health Room', 'Medical Supply Store', 'Therapy Room', 'Maternity Room'
            ]
        }
    ],

    // Get all locations from selected categories
    getLocationsFromCategories: function(selectedCategoryIds) {
        const locations = [];
        this.categories.forEach(category => {
            if (selectedCategoryIds.includes(category.id)) {
                locations.push(...category.locations);
            }
        });
        return locations;
    },

    // Get random location from selected categories
    getRandomLocation: function(selectedCategoryIds) {
        const locations = this.getLocationsFromCategories(selectedCategoryIds);
        if (locations.length === 0) return null;
        return locations[Math.floor(Math.random() * locations.length)];
    },

    // Game constants
    constants: {
        MIN_PLAYERS: 3,
        MAX_PLAYERS: 20,
        GAME_DURATION: 480, // 8 minutes in seconds
        SPY_COUNT_RULES: {
            small: { max: 8, spies: 1 },    // 1 spy for ≤8 players
            medium: { max: 15, spies: 2 },  // 2 spies for 9-15 players
            large: { max: 20, spies: 3 }    // 3 spies for 16-20 players
        }
    },

    // Calculate number of spies based on player count
    getSpyCount: function(playerCount) {
        if (playerCount <= this.constants.SPY_COUNT_RULES.small.max) {
            return this.constants.SPY_COUNT_RULES.small.spies;
        } else if (playerCount <= this.constants.SPY_COUNT_RULES.medium.max) {
            return this.constants.SPY_COUNT_RULES.medium.spies;
        } else {
            return this.constants.SPY_COUNT_RULES.large.spies;
        }
    }
};

// Initialize language from localStorage
GAME_DATA.getLanguage();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GAME_DATA;
} 