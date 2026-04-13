import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";

await prisma.message.deleteMany({});
await prisma.listing.deleteMany({});
await prisma.user.deleteMany({});

const password = await bcrypt.hash("password123", 12);

const landlord = await prisma.user.create({
  data: { name: "Alex Morgan", email: "alex@roomfinder.com", password, role: "LANDLORD" },
});

const tenant = await prisma.user.create({
  data: { name: "Jamie Lee", email: "jamie@roomfinder.com", password, role: "TENANT" },
});

console.log(`Landlord: ${landlord.email} / password123`);
console.log(`Tenant:   ${tenant.email} / password123`);

const listings = [
  { title: "Sunny Studio in Midtown", description: "A bright and modern studio steps from Central Park. Fully furnished with high-end appliances and fast WiFi.", type: "STUDIO", price: 2800, city: "New York", neighborhood: "Midtown", address: "301 W 53rd St", bedrooms: 0, bathrooms: 1, size: 45, furnished: true, amenities: ["WiFi", "AC", "Elevator"], images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"] },
  { title: "Spacious 2BR in Brooklyn Heights", description: "Classic brownstone apartment with exposed brick, hardwood floors, and a private backyard. Great natural light throughout.", type: "APARTMENT", price: 3500, city: "New York", neighborhood: "Brooklyn Heights", address: "45 Pineapple St", bedrooms: 2, bathrooms: 1, size: 90, furnished: false, amenities: ["Laundry", "Heating", "Storage"], images: ["https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800"] },
  { title: "Private Room near Columbia", description: "Quiet room in a shared 3-bedroom with two graduate students. Ideal for serious academics. All utilities included.", type: "ROOM", price: 1400, city: "New York", neighborhood: "Morningside Heights", address: "520 W 110th St", bedrooms: 1, bathrooms: 1, size: 18, furnished: true, amenities: ["WiFi", "Laundry", "Heating"], images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"] },
  { title: "Modern Loft in SoMa", description: "Industrial-chic loft in the heart of San Francisco's tech district. High ceilings, polished concrete floors, rooftop access.", type: "APARTMENT", price: 4200, city: "San Francisco", neighborhood: "SoMa", address: "88 Bluxome St", bedrooms: 1, bathrooms: 1, size: 75, furnished: true, amenities: ["WiFi", "Gym", "Elevator", "Balcony"], images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"] },
  { title: "Castro Studio – Walk to Everything", description: "Charming Victorian studio in one of SF's most vibrant neighborhoods. Character and convenience in equal measure.", type: "STUDIO", price: 2400, city: "San Francisco", neighborhood: "Castro", address: "400 Noe St", bedrooms: 0, bathrooms: 1, size: 38, furnished: true, amenities: ["WiFi", "AC", "Pet-Friendly"], images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"] },
  { title: "Large House – Outer Sunset", description: "Rare 3-bedroom detached house with garden. Quiet street, great for families or housemates. Garage included.", type: "HOUSE", price: 5500, city: "San Francisco", neighborhood: "Outer Sunset", address: "1750 46th Ave", bedrooms: 3, bathrooms: 2, size: 140, furnished: false, amenities: ["Parking", "Laundry", "Pet-Friendly", "Storage"], images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800"] },
  { title: "East Austin Studio – Walkable & Trendy", description: "Newly renovated studio in the hottest part of Austin. Walk to restaurants, live music venues, and coffee shops.", type: "STUDIO", price: 1600, city: "Austin", neighborhood: "East Austin", address: "1200 E 6th St", bedrooms: 0, bathrooms: 1, size: 40, furnished: true, amenities: ["WiFi", "AC", "Pool"], images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"] },
  { title: "Downtown Austin 1BR", description: "Luxury apartment with skyline views. Building features rooftop pool, concierge, and state-of-the-art gym.", type: "APARTMENT", price: 2600, city: "Austin", neighborhood: "Downtown", address: "360 Nueces St", bedrooms: 1, bathrooms: 1, size: 65, furnished: true, amenities: ["WiFi", "Gym", "Pool", "Elevator", "AC"], images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"] },
  { title: "South Congress Room Share", description: "Furnished room in a house shared with two young professionals. Bikes welcome, great porch for hangouts.", type: "ROOM", price: 950, city: "Austin", neighborhood: "South Congress", address: "901 W Mary St", bedrooms: 1, bathrooms: 1, size: 20, furnished: true, amenities: ["WiFi", "AC", "Laundry", "Pet-Friendly"], images: ["https://images.unsplash.com/photo-1486304873000-235643847519?w=800"] },
  { title: "Brickell Studio with Bay Views", description: "Sleek studio in Miami's financial district with stunning Biscayne Bay views from the 22nd floor.", type: "STUDIO", price: 2200, city: "Miami", neighborhood: "Brickell", address: "1100 Brickell Bay Dr", bedrooms: 0, bathrooms: 1, size: 42, furnished: true, amenities: ["WiFi", "Gym", "Pool", "Elevator", "AC"], images: ["https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800"] },
  { title: "Wynwood Art District 2BR", description: "Creative apartment surrounded by world-famous street art. Open floor plan, bright studio space, exposed brick.", type: "APARTMENT", price: 3200, city: "Miami", neighborhood: "Wynwood", address: "275 NW 26th St", bedrooms: 2, bathrooms: 2, size: 95, furnished: true, amenities: ["WiFi", "AC", "Balcony", "Parking"], images: ["https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800"] },
  { title: "Wicker Park Greystone – 3BR", description: "Beautiful greystone apartment in one of Chicago's most sought-after neighborhoods. Original details, modern updates.", type: "APARTMENT", price: 2900, city: "Chicago", neighborhood: "Wicker Park", address: "1550 N Milwaukee Ave", bedrooms: 3, bathrooms: 2, size: 130, furnished: false, amenities: ["Laundry", "Heating", "Parking", "Storage"], images: ["https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=800"] },
];

for (const data of listings) {
  await prisma.listing.create({ data: { ...data, ownerId: landlord.id } });
}

console.log(`\n✅ Seeded ${listings.length} listings across 5 cities`);
await prisma.$disconnect();
