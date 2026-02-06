import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

const geocodeAddress = async (address) => {
    try {
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                q: address,
                format: 'json',
                limit: 1
            },
            headers: {
                'User-Agent': 'EventMapFinder/1.0'
            }
        });

        if (response.data && response.data.length > 0) {
            const { lat, lon } = response.data[0];
            return {
                lat: parseFloat(lat),
                lon: parseFloat(lon)
            };
        }
        return null;
    } catch (error) {
        console.error(`Geocoding failed for: ${address}`, error.message);
        return null;
    }
};

const rawData = [
    { purchaseDate: '2025-08-29', endDate: '2026-08-29', name: 'Donny Schmucker', email: 'dschmucker696@gmail.com', address: '', city: '', state: '', zipCode: '', country: 'US' },
    { purchaseDate: '2025-08-29', endDate: '2026-08-29', name: 'Matt Aaker', email: 'mattaaker@gmail.com', address: '14219 Bold Ruler St.', city: 'San Antonio', state: 'TX', zipCode: '78248', country: 'US' },
    { purchaseDate: '2025-08-29', endDate: '2026-08-29', name: 'Kim Nitchman', email: 'kimnitchman@gmail.com', address: '', city: '', state: '', zipCode: '', country: 'US' },
    { purchaseDate: '2025-08-29', endDate: '2026-08-29', name: 'Russ Nitchman', email: 'russellnitchman@gmail.com', address: '', city: '', state: '', zipCode: '', country: 'US' },
    { purchaseDate: '2025-08-29', endDate: '2026-08-29', name: 'Brett Grime', email: 'grimebrett@gmail.com', address: '23376 State Route 34 Lot 10', city: 'Stryker', state: 'OH', zipCode: '43557', country: 'US' },
    { purchaseDate: '2025-08-29', endDate: '2026-08-29', name: 'Brian Scully', email: 'bscullyvw@gmail.com', address: '', city: '', state: '', zipCode: '', country: 'US' },
    { purchaseDate: '2025-08-29', endDate: '2026-08-29', name: 'Jen Grime', email: 'grimejen@gmail.com', address: '', city: '', state: '', zipCode: '', country: 'US' },
    { purchaseDate: '2025-08-29', endDate: '2026-08-29', name: 'Jennifer Scully', email: 'jscully003@gmail.com', address: '', city: '', state: '', zipCode: '', country: 'US' },
    { purchaseDate: '2025-08-29', endDate: '2026-08-29', name: 'Brian Luitjohan', email: 'b_luitjohan@yahoo.com', address: '', city: '', state: '', zipCode: '', country: 'US' },
    { purchaseDate: '2025-08-29', endDate: '2026-08-29', name: 'Heather Luitjohan', email: 'hluitjohan@hotmail.com', address: '', city: '', state: '', zipCode: '', country: 'US' },
    { purchaseDate: '2025-08-29', endDate: '2026-08-29', name: 'Joseph B. Ciccarello Jr.', email: 'fatherjoechick@gmail.com', address: '', city: '', state: '', zipCode: '', country: 'US' },
    { purchaseDate: '2025-08-29', endDate: '2026-08-29', name: 'Melanie Ciccarello', email: 'melanie@delightyourmarriage.com', address: '', city: '', state: '', zipCode: '', country: 'US' },
    { purchaseDate: '2025-08-29', endDate: '2026-08-29', name: 'Steve Auton', email: 'the6autons@gmail.com', address: '', city: '', state: '', zipCode: '', country: 'US' },
    { purchaseDate: '2025-10-11', endDate: '2026-10-11', name: 'Pahokee1964 Hiland', email: 'danhiland777@gmail.com', address: '', city: '', state: '', zipCode: '', country: 'US' },
    { purchaseDate: '2025-12-15', endDate: '2026-12-15', name: 'Robert Kulp', email: 'bob.kulp66@gmail.com', address: '', city: '', state: '', zipCode: '', country: 'US' },
    { purchaseDate: '2025-12-15', endDate: '2026-12-15', name: 'Laura KULP', email: 'laura.kulp7@gmail.com', address: '', city: '', state: '', zipCode: '', country: 'US' },
    { purchaseDate: '2025-12-15', endDate: '2026-12-15', name: 'Lena Plent', email: 'lplent@roadrunner.com', address: '3543 Honeysuckle Ave', city: 'Chino Hills', state: 'California', zipCode: '91709', country: 'US' },
    { purchaseDate: '2026-01-06', endDate: '2027-01-06', name: 'Craig Coffin', email: 'ccoffin@cccm.com', address: '3800 S fairview Rd', city: 'Santa Ana', state: 'California', zipCode: '92704', country: 'US' },
    { purchaseDate: '2026-01-15', endDate: '2027-01-15', name: 'Jenna Barbee', email: 'jennamariebarbee@gmail.com', address: '', city: '', state: '', zipCode: '', country: 'US' },
    { purchaseDate: '2026-01-15', endDate: '2027-01-15', name: 'John Barbee', email: 'johnbarbee44@gmail.com', address: '', city: '', state: '', zipCode: '', country: 'US' },
    { purchaseDate: '2026-01-15', endDate: '2027-01-15', name: 'Alisa Young', email: 'alistairandalisa@gmail.com', address: '', city: '', state: '', zipCode: '', country: 'US' },
    { purchaseDate: '2026-01-16', endDate: '2027-01-16', name: 'Beth Fox', email: 'bethfoxinfo@gmail.com', address: '', city: '', state: '', zipCode: '', country: 'US' },
    { purchaseDate: '2026-01-29', endDate: '2027-01-29', name: 'Michelle Malloy Bishop', email: 'michellemalloybishop@gmail.com', address: '', city: '', state: '', zipCode: '', country: 'US' }
];

async function main() {
    console.log('🗑  Clearing existing test data...');
    await prisma.council.deleteMany({});
    console.log('✅ Existing data cleared.');

    console.log('🚀 Starting import of 23 records...');

    for (const record of rawData) {
        process.stdout.write(`Processing: ${record.name}... `);

        let lat = null;
        let lon = null;

        if (record.address) {
            const fullAddress = `${record.address}, ${record.city}, ${record.state} ${record.zipCode}, ${record.country}`;
            const coords = await geocodeAddress(fullAddress);
            if (coords) {
                lat = coords.lat;
                lon = coords.lon;
            }
        }

        try {
            await prisma.council.create({
                data: {
                    purchaseDate: new Date(record.purchaseDate),
                    endDate: new Date(record.endDate),
                    name: record.name,
                    email: record.email,
                    address: record.address || 'N/A',
                    zipCode: record.zipCode || 'N/A',
                    state: record.state || 'N/A',
                    latitude: lat,
                    longitude: lon
                }
            });
            console.log('Done.');
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
        
        // Politeness delay for geocoding API
        if (record.address) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    console.log('\n✨ Import completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
