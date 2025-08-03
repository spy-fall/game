// Game Data for Spyfall PWA
const GAME_DATA = {
    categories: [
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

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GAME_DATA;
} 