(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    // Node/CommonJS
    module.exports = factory();
  } else {
    // Browser globals
    root.TourData = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  const TRANSPORT_FEE = 40;

  const TOURS = {
    "souk-tour": {
      title: "Agadir Souk El Had Tour",
      category: "Local Tours & Experiences",
      price: 15,
      details: [
        "Duration: 1-4 Hours",
        "Pick up: Any time",
        "Free time to explore the market independently",
        "Discover spices, crafts, and local culture",
      ],
    },
    "small-desert": {
      title: "Small Desert Trip from Agadir & Taghazout",
      category: "Local Tours & Experiences",
      price: 30,
      details: [
        "Duration: 5-6 Hours",
        "Pick up: Any time",
        "Explore sand dunes and Berber villages",
        "Traditional Moroccan tea break (optional)",
      ],
    },
    "horse-riding": {
      title: "Horse Riding",
      category: "Local Tours & Experiences",
      price: 20,
      details: [
        "Duration: 2 Hours",
        "Ride along the beach and tamri village river",
        "Suitable for all skill levels",
        "Equipment and guide included",
        "Beautiful sunset option available",
      ],
    },
    "airport-transfer": {
      title: "Airport Transfer",
      category: "Local Tours & Experiences",
      price: 35,
      details: [
        "Private comfortable vehicle",
        "Professional driver",
        "Meet and greet service at airport",
        "Available 24/7",
        "Fixed price, no hidden fees",
      ],
    },
    "sahara-dunes": {
      title: "Sahara Dunes Trip",
      category: "Local Tours & Experiences",
      price: 25,
      details: [
        "Full day adventure",
        "Explore massive sand dunes",
        "Scenic drive through Anti-Atlas mountains",
      ],
    },
    "cooking-class": {
      title: "Cooking Class",
      category: "Local Tours & Experiences",
      price: 40,
      details: [
        "Duration: 4 Hours",
        "Market visit for ingredients",
        "Learn to cook Tagine or Couscous",
        "Enjoy your meal afterwards",
      ],
    },
    "old-medina": {
      title: "Visit Old Medina of Agadir",
      category: "Local Tours & Experiences",
      price: 20,
      details: [
        "Duration: 2-3 Hours",
        "Admire traditional masonry and architecture",
        "Visit artisan workshops",
        "Great photo opportunities",
        "Entrance fee included",
      ],
    },
    "buggy-tour": {
      title: "Buggy Tour",
      category: "Local Tours & Experiences",
      price: 65,
      details: [
        "Duration: 1 Hours (driving)",
        "Safety briefing and gear included",
        "Tea break (optinal)",
      ],
    },
    "hammam-massage": {
      title: "Moroccan Hammam & Massage (2h)",
      category: "Local Tours & Experiences",
      price: 40,
      details: [
        "1 Hour Traditional Hammam (Scrub)",
        "1 Hour Relaxing Massage with Argan Oil",
        "Towels and slippers provided",
        "Ultimate relaxation experience",
      ],
    },
    "quad-bike": {
      title: "Quad Bike Tour in the Sand",
      category: "Local Tours & Experiences",
      price: 30,
      details: [
        "Duration: 1 Hours",
        "Ride through dunes and beach",
        "Safety equipment provided",
        "Briefing for beginners",
      ],
    },
    "taroudant-trip": {
      title: "Taroudant Trip",
      category: "Day Trips & Excursions",
      price: 50,
      details: [
        "Duration: Half Day or Full Day",
        'Explore the "Little Marrakech"',
        "Visit ancient ramparts and souks",
        "See the Tiout Oasis",
        "Hotel pickup included",
      ],
    },
    "souss-park": {
      title: "Souss National Park Trip",
      category: "Day Trips & Excursions",
      price: 45,
      details: [
        "Guided nature walk",
        "Spot migratory birds including flamingos",
        "Visit the museum of the park",
        "Ideal for nature lovers",
        "Morning tour recommended",
      ],
    },
    Telepherique: {
      title: "Telepherique in Agadir",
      category: "Day Trips & Excursions",
      price: 25,
      details: [
        "Ride to the historic Kasbah Oufella",
        "Panoramic views of the city and bay",
        "Modern comfortable cabins",
        "Driver waits for return trip",
        "Ticket included",
      ],
    },
    "paradise-valley": {
      title: "Paradise Valley Trip",
      category: "Day Trips & Excursions",
      price: 20,
      details: [
        "Half day trip",
        "Short hike through palm groves",
        "Swimming in natural rock pools",
        "Stunning photography spots",
      ],
    },
    sandboarding: {
      title: "Sandboarding",
      category: "Day Trips & Excursions",
      price: 25,
      details: [
        "Combine with half-day desert trip",
        "Boards provided",
        "Slide down the steep dunes",
        "panoramic view",
        "Fun for all ages",
      ],
    },
    "camel-ride": {
      title: "Camel Ride Tour",
      category: "Day Trips & Excursions",
      price: 25,
      details: [
        "1 Hours riding experience",
        "Flamingo spotting (seasonally)",
        "Pick up and drop off included",
      ],
    },
    "city-tour": {
      title: "City Tour from Agadir & Taghazout",
      category: "Day Trips & Excursions",
      price: 25,
      details: [
        "Duration: 3 Hours",
        "Visit Kasbah Oufella (Historic Fortress)",
        "Drive through Marina and City Center",
      ],
    },
    "boat-trip": {
      title: "Boat Trip",
      category: "Day Trips & Excursions",
      price: 45,
      details: ["30 min - 1 h", "Swimming break", "Relaxing atmosphere"],
    },
    crocoparc: {
      title: "Crocoparc Tour",
      category: "Unique Attractions",
      price: 25,
      details: [
        "Entrance ticket included",
        "Walk through thematic botanical gardens",
        "Watch crocodile feeding times",
        "Educational and fun",
        "Great for families",
      ],
    },
    "dolphin-show": {
      title: "Dolphin",
      category: "Unique Attractions",
      price: 30,
      details: [
        "Show times vary (usually afternoon)",
        "Watch dolphins and sea lions perform",
        "Photo opportunities available",
      ],
    },
    "goats-tree": {
      title: "Goats on the Tree Tour",
      category: "Unique Attractions",
      price: 20,
      details: [
        "Short trip or included in Essaouira/Marrakech trips",
        "See goats climbing Argan trees",
        "Unique to this region of Morocco",
        "Photo stop",
        "Visit Argan cooperative",
      ],
    },
  };

  return {
    TOURS: TOURS,
    TRANSPORT_FEE: TRANSPORT_FEE,
  };
});
