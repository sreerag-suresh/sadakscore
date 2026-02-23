export const STATES = [
  "Andhra Pradesh",
  "Bihar",
  "Gujarat",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Rajasthan",
  "Tamil Nadu",
  "Uttar Pradesh",
] as const;

export type State = (typeof STATES)[number];

export const DISTRICTS: Record<State, string[]> = {
  "Andhra Pradesh": [
    "Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna",
    "Kurnool", "Nellore", "Prakasam", "Visakhapatnam", "West Godavari",
  ],
  "Bihar": [
    "Begusarai", "Bhagalpur", "Gaya", "Muzaffarpur", "Nalanda",
    "Patna", "Purnia", "Samastipur", "Saran", "Vaishali",
  ],
  "Gujarat": [
    "Ahmedabad", "Anand", "Bharuch", "Bhavnagar", "Gandhinagar",
    "Jamnagar", "Junagadh", "Kutch", "Rajkot", "Surat",
  ],
  "Karnataka": [
    "Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban",
    "Dakshina Kannada", "Dharwad", "Hassan", "Mysuru", "Tumakuru",
  ],
  "Kerala": [
    "Alappuzha", "Ernakulam", "Kannur", "Kochi", "Kollam",
    "Kottayam", "Kozhikode", "Palakkad", "Thiruvananthapuram", "Thrissur",
  ],
  "Madhya Pradesh": [
    "Bhopal", "Gwalior", "Indore", "Jabalpur", "Rewa",
    "Sagar", "Satna", "Ujjain", "Vidisha", "Dewas",
  ],
  "Maharashtra": [
    "Ahmednagar", "Aurangabad", "Kolhapur", "Mumbai City", "Mumbai Suburban",
    "Nagpur", "Nashik", "Pune", "Solapur", "Thane",
  ],
  "Rajasthan": [
    "Ajmer", "Alwar", "Bikaner", "Jaipur", "Jodhpur",
    "Kota", "Nagaur", "Sikar", "Udaipur", "Bharatpur",
  ],
  "Tamil Nadu": [
    "Chennai", "Coimbatore", "Erode", "Kancheepuram", "Madurai",
    "Salem", "Thanjavur", "Tiruchirappalli", "Tirunelveli", "Vellore",
  ],
  "Uttar Pradesh": [
    "Agra", "Allahabad", "Bareilly", "Ghaziabad", "Gorakhpur",
    "Kanpur", "Lucknow", "Meerut", "Noida", "Varanasi",
  ],
};

export const ROAD_TYPES = [
  "National Highway",
  "State Highway",
  "City Road",
  "Rural Road",
] as const;

export type RoadType = (typeof ROAD_TYPES)[number];
