// Comparison Component Interfaces & Data
export interface FeatureComparison {
    name: string;
    desc: string;
    traditional: { text: string; available: boolean };
    rentease: { text: string; available: boolean };
}

export const comparisons: FeatureComparison[] = [
    {
        name: 'Brokerage Commission',
        desc: 'Commission fees charged for viewing or closing a property lease.',
        traditional: { text: '1 Month Rent (upfront)', available: false },
        rentease: { text: '₹0 Commission (Direct)', available: true }
    },
    {
        name: 'Security Deposit',
        desc: 'Funds held by the landlord as deposit throughout the lease.',
        traditional: { text: '6 to 10 Months Rent', available: false },
        rentease: { text: 'Flat 2 Months Rent', available: true }
    },
    {
        name: 'Lease Agreement Processing',
        desc: 'Creation, stamping, and digital/physical signing of rental leases.',
        traditional: { text: 'Physical notary, days of delay', available: false },
        rentease: { text: 'Instant Digital E-Sign', available: true }
    },
    {
        name: 'Maintenance Resolution',
        desc: 'Reporting and tracking maintenance issues and contractor dispatch.',
        traditional: { text: 'Manual call-and-beg landlord', available: false },
        rentease: { text: '24/7 Portal Ticket Tracking', available: true }
    },
    {
        name: 'Rent Payment Options',
        desc: 'Supported channels for paying rent and auto-pay setups.',
        traditional: { text: 'Checks, manual bank transfers', available: false },
        rentease: { text: 'Credit Cards, UPI, Auto-debit', available: true }
    },
    {
        name: 'Rent Receipt Ledger',
        desc: 'Access to historical payments and reporting to credit bureaus.',
        traditional: { text: 'Handwritten receipts or none', available: false },
        rentease: { text: 'Downloadable Credit Builder Ledger', available: true }
    }
];



// Features Component Data
export const features = [
    { icon: 'search', title: 'Smart Search', desc: 'Advanced filters by budget, city, BHK, and amenities. Save your wishlist.' },
    { icon: 'file-text', title: 'Digital Leases', desc: 'Draw your signature on an interactive canvas to digitally sign lease agreements.' },
    { icon: 'credit-card', title: 'Secure Payments', desc: 'Pay rent via UPI, credit card, or net banking through Razorpay checkout.' },
    { icon: 'wrench', title: 'Maintenance Desk', desc: 'Raise tickets with photos, track work order stages, and get resolution notes.' },
    { icon: 'bell', title: 'Instant Alerts', desc: 'Real-time notifications for rent due, application status, and broadcasts.' },
    { icon: 'shield', title: 'Verified Listings', desc: 'All properties are admin-verified. No fraud, no hidden charges.' },
];

export const propertyTypes = [
    { type: 'Apartment', icon: 'building', desc: 'Modern high-rise flats with society amenities', count: '840+' },
    { type: 'Villa', icon: 'home', desc: 'Independent bungalows with private gardens', count: '210+' },
    { type: 'Studio', icon: 'key', desc: 'Compact 1-room setups perfect for solo living', count: '560+' },
    { type: 'Independent House', icon: 'home', desc: 'Spacious floors in standalone residential homes', count: '390+' },
];

export const whyUs = [
    { title: 'Zero Brokerage', desc: 'No hidden agent fees. List or find properties completely free.', icon: 'dollar-sign' },
    { title: '24/7 Support', desc: 'Our chat support is always available to resolve tenant issues.', icon: 'message-square' },
    { title: 'Instant Approvals', desc: 'Typical lease approval takes under 48 hours with our system.', icon: 'zap' },
    { title: 'Legal Compliance', desc: 'All lease agreements are digitally certified.', icon: 'lock' },
];

export const cities = [
    {
        name: 'Bangalore',
        properties: 780,
        avgRent: '₹32,500',
        tag: 'Tech Hub',
        image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80'
    },
    {
        name: 'Mumbai',
        properties: 640,
        avgRent: '₹38,000',
        tag: 'Financial Capital',
        image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=600&q=80'
    },
    {
        name: 'Delhi',
        properties: 520,
        avgRent: '₹22,000',
        tag: 'National Capital',
        image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80'
    },
    {
        name: 'Pune',
        properties: 410,
        avgRent: '₹15,000',
        tag: 'Rising IT City',
        image: 'https://images.unsplash.com/photo-1601961405399-801fb1f34581?auto=format&fit=crop&w=600&q=80'
    },
];



// Hero Component Data
export const cityOptions = [
    { value: '', label: 'All Cities' },
    { value: 'Bangalore', label: 'Bangalore' },
    { value: 'Mumbai', label: 'Mumbai' },
    { value: 'Delhi', label: 'Delhi' },
    { value: 'Pune', label: 'Pune' }
];

export const typeOptions = [
    { value: '', label: 'Any Type' },
    { value: 'Apartment', label: 'Apartment' },
    { value: 'Villa', label: 'Villa' },
    { value: 'Independent House', label: 'House' },
    { value: 'Studio', label: 'Studio' }
];

export const stats = [
    { value: '2,400+', label: 'Properties Listed', icon: 'building' },
    { value: '18,000+', label: 'Happy Tenants', icon: 'users' },
    { value: '12', label: 'Cities Covered', icon: 'map-pin' },
    { value: '₹0', label: 'Zero Brokerage', icon: 'zap' },
];



// Neighborhood Component Interfaces & Data
export interface Destination {
    name: string;
    distance: string;
    walkTime: string;
    driveTime: string;
    icon: string;
    coords: { x: number; y: number };
}

export interface Category {
    id: string;
    name: string;
    icon: string;
    tagline: string;
    destinations: Destination[];
}

export const categories: Category[] = [
    {
        id: 'transit',
        name: 'Transit & Metro',
        icon: 'map-pin',
        tagline: 'Skip gridlock and reach anywhere in the city effortlessly.',
        destinations: [
            { name: 'Central Metro Terminal', distance: '0.4 km', walkTime: '5 mins', driveTime: '2 mins', icon: 'map-pin', coords: { x: 30, y: 50 } },
            { name: 'Inter-State Terminal', distance: '1.8 km', walkTime: '22 mins', driveTime: '5 mins', icon: 'map-pin', coords: { x: 75, y: 25 } },
            { name: 'International Airport', distance: '12.5 km', walkTime: 'N/A', driveTime: '25 mins', icon: 'map-pin', coords: { x: 85, y: 70 } }
        ]
    },
    {
        id: 'tech',
        name: 'IT & Business Hubs',
        icon: 'building',
        tagline: 'Walk to work and reclaim hours of productive time daily.',
        destinations: [
            { name: 'Vanguard Tech Park', distance: '0.8 km', walkTime: '9 mins', driveTime: '3 mins', icon: 'building', coords: { x: 45, y: 40 } },
            { name: 'Horizon Business Bay', distance: '1.2 km', walkTime: '14 mins', driveTime: '4 mins', icon: 'building', coords: { x: 60, y: 55 } },
            { name: 'InnoHub Co-working Space', distance: '0.3 km', walkTime: '4 mins', driveTime: '1 min', icon: 'building', coords: { x: 20, y: 35 } }
        ]
    },
    {
        id: 'lifestyle',
        name: 'Lifestyle & Food',
        icon: 'heart',
        tagline: 'The absolute best of city cafes, markets, and parks at your doorstep.',
        destinations: [
            { name: 'Grand Galleria Mall', distance: '0.6 km', walkTime: '7 mins', driveTime: '2 mins', icon: 'heart', coords: { x: 50, y: 70 } },
            { name: 'Greenwood Sanctuary Park', distance: '0.2 km', walkTime: '3 mins', driveTime: '1 min', icon: 'heart', coords: { x: 35, y: 25 } },
            { name: 'Organic Farmer Market', distance: '0.9 km', walkTime: '10 mins', driveTime: '3 mins', icon: 'heart', coords: { x: 70, y: 45 } }
        ]
    }
];



// Process Component Data
export const steps = [
    { step: '01', title: 'Search & Discover', desc: 'Filter 2,400+ properties by city, BHK count, budget, and amenities.', icon: 'search' },
    { step: '02', title: 'Apply Online', desc: 'Fill out the digital application form with your income and documents.', icon: 'file-text' },
    { step: '03', title: 'Get Approved', desc: 'The admin reviews your profile and approves or requests more documents.', icon: 'check-circle' },
    { step: '04', title: 'Sign Digitally', desc: 'Draw your signature on our canvas to activate your lease agreement.', icon: 'pen' },
    { step: '05', title: 'Pay & Move In', desc: 'Make your first rent payment securely and collect your keys!', icon: 'credit-card' },
];



// Properties Component Data
export const fallbackImages = [
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
];

export const mockProperties = [
    {
        id: 'mock-prop-1',
        title: 'Executive Lounge Suite at Tech Corridor',
        type: 'Apartment',
        available: true,
        rent: 28000,
        deposit: 56000,
        locality: 'Indiranagar',
        city: 'Mumbai',
        bedrooms: 3,
        averageRating: 4.8,
        imageUrl: fallbackImages[0]
    },
    {
        id: 'mock-prop-2',
        title: 'Acoustically Isolated Master Sanctuary',
        type: 'Studio',
        available: true,
        rent: 16500,
        deposit: 33000,
        locality: 'HSR Layout',
        city: 'pune',
        bedrooms: 1,
        averageRating: 4.6,
        imageUrl: fallbackImages[1]
    },
    {
        id: 'mock-prop-3',
        title: 'Panoramic Retractable Sky Deck Villa',
        type: 'Villa',
        available: false,
        rent: 68000,
        deposit: 136000,
        locality: 'Whitefield',
        city: 'Bangalore',
        bedrooms: 4,
        averageRating: 4.9,
        imageUrl: fallbackImages[4]
    }
];


// Social Component Data
export const testimonials = [
    { name: 'Aarav Mehta', role: 'Tenant · Bangalore', text: 'RentEase made signing my lease completely digital. I signed the agreement on my phone, paid rent, and raised support tickets easily!', stars: 5, initials: 'AM' },
    { name: 'Sneha Rao', role: 'Property Owner · Mumbai', text: 'As an owner, managing rent tracking and tenant applications has never been this organized. Extremely premium user experience!', stars: 5, initials: 'SR' },
    { name: 'Vikram Singh', role: 'Tenant · Pune', text: 'I raised a plumbing issue and it was resolved within 24 hours. The progress timeline tracking is extremely transparent.', stars: 5, initials: 'VS' },
    { name: 'Priya Sharma', role: 'Tenant · Delhi', text: 'Found a great 2BHK within my budget in just 2 days. The smart search filters made it so easy to narrow down choices.', stars: 5, initials: 'PS' },
    { name: 'Rohit Nair', role: 'Property Manager · Hyderabad', text: 'Managing 8 properties used to be a nightmare. RentEase centralized everything — rent logs, maintenance, notifications.', stars: 5, initials: 'RN' },
    { name: 'Kavya Menon', role: 'Tenant · Chennai', text: 'The Razorpay integration is flawless. Got a PDF invoice within seconds of payment. Super professional service!', stars: 5, initials: 'KM' },
];

export const faqs = [
    { q: 'How does digital lease signing work?', a: 'Once an application is approved, a pending-signature agreement is generated. Tenants can review the terms and draw their signatures directly on our interactive digital canvas to activate the lease.' },
    { q: 'Is rent payment secure?', a: 'Yes. RentEase integrates with Razorpay Checkout. Tenants can pay securely using credit cards, UPI, net banking, or wallets. Payment confirmations are instantly verified on the backend, and automated invoice PDFs are generated.' },
    { q: 'How do I raise a maintenance ticket?', a: 'Tenants can log into their dashboard, click "Raise Support Ticket", choose a category (Plumbing, Electrical, etc.), write descriptions, and upload issue photos. The admin can then update the work order status and attach resolution comments.' },
    { q: 'Can I list my property as an admin?', a: 'Yes. Admins can create an account selecting "List Properties" role, then add unlimited property listings with photos, amenities, rent amount, deposit, and availability status through the admin panel.' },
    { q: 'What cities are currently supported?', a: 'We currently cover Bangalore, Mumbai, Delhi, and Pune with 2,400+ verified listings. We are expanding to Hyderabad, Chennai, and Kolkata in Q3 2025.' },
    { q: 'Is there any brokerage or commission fee?', a: 'Absolutely not. RentEase is a direct owner-to-tenant platform. There are zero brokerage, zero hidden charges, and zero agent commissions. The entire service is free to use.' },
];



// Tour Component Interfaces & Data
export interface Hotspot {
    x: number;
    y: number;
    label: string;
    desc: string;
}

export interface Room {
    id: string;
    name: string;
    title: string;
    description: string;
    imageUrl: string;
    amenities: string[];
    hotspots: Hotspot[];
}

export const rooms: Room[] = [
    {
        id: 'living',
        name: 'Living Lounge',
        title: 'Executive Living Lounge',
        description: 'Expansive open-concept lounge featuring double-height ceiling windows, ambient smart recessed lighting, and designer Italian marble flooring.',
        imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
        amenities: ['Double-glazed Glass', 'Recessed Ambient Lights', 'Italian Marble Floor'],
        hotspots: [
            { x: 35, y: 42, label: 'Smart Ambient Lighting', desc: 'Control colors and intensity dynamically from the RentEase tenant dashboard.' },
            { x: 67, y: 50, label: 'Underfloor HVAC Grid', desc: 'Energy-efficient climate zones controlled via wall panels or smart app.' }
        ]
    },
    {
        id: 'bedroom',
        name: 'Master Suite',
        title: 'Master Sanctuary Suite',
        description: 'Acoustically isolated retreat with a walk-in wardrobe, dedicated remote-work vanity nook, and panoramic sunset skyline views.',
        imageUrl: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80',
        amenities: ['Acoustic Soundproofing', 'Walk-in Wardrobe', 'Skyline Viewport'],
        hotspots: [
            { x: 35, y: 19, label: 'Sound Isolation Paneling', desc: 'Specialized drywalls offering up to -45dB acoustic noise attenuation.' },
            { x: 80, y: 35, label: 'Motorized Blackout Blinds', desc: 'Schedule auto-open or shut times synced with your wakeup alarm.' }
        ]
    },
    {
        id: 'kitchen',
        name: 'Culinary Studio',
        title: 'Gourmet Culinary Studio',
        description: 'Fully integrated modular workspace featuring custom anti-scratch quartz countertops, built-in smart dishwasher, and touchless faucets.',
        imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
        amenities: ['Modular Cabinets', 'Touchless Smart Faucets', 'Anti-scratch Quartz'],
        hotspots: [
            { x: 20, y: 50, label: 'Touchless Pro-Faucet', desc: 'Motion sensor enabled water saving mechanism to limit waste.' },
            { x: 92, y: 48, label: 'Smart Convection Hob', desc: 'Integrated dual oven and convection grill with wifi alerts.' }
        ]
    }
];
