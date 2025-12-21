const mongoose = require('mongoose');
const dotenv = require('dotenv');
const DiagnosticTest = require('./models/diagnosticTestModel');

dotenv.config();

const sampleTests = [
    {
        name: "Complete Blood Count (CBC)",
        category: "Blood Test",
        description: "Evaluates overall health and detects a wide range of disorders, including anemia, infection and leukemia.",
        preparationInstructions: "No special preparation needed.",
        fastingRequired: false,
        sampleType: "Blood",
        price: 399,
        isHomeCollectionAvailable: true,
        image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Lipid Profile",
        category: "Heart",
        description: "Measures different types of lipids (fats) in the blood, including cholesterol and triglycerides.",
        preparationInstructions: "Fasting for 9-12 hours is required.",
        fastingRequired: true,
        sampleType: "Blood",
        price: 699,
        isHomeCollectionAvailable: true,
        image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Thyroid Profile (T3, T4, TSH)",
        category: "Thyroid",
        description: "Checks how well your thyroid gland is working and helps diagnose thyroid disorders.",
        preparationInstructions: "No special preparation needed.",
        fastingRequired: false,
        sampleType: "Blood",
        price: 499,
        isHomeCollectionAvailable: true,
        image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "HbA1c (Glycosylated Hemoglobin)",
        category: "Diabetes",
        description: "Measures your average blood sugar levels over the past 3 months.",
        preparationInstructions: "No special preparation needed.",
        fastingRequired: false,
        sampleType: "Blood",
        price: 450,
        isHomeCollectionAvailable: true,
        image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Fasting Blood Sugar (FBS)",
        category: "Diabetes",
        description: "Measures blood glucose after an overnight fast to check for prediabetes or diabetes.",
        preparationInstructions: "Fasting for 8-10 hours is required.",
        fastingRequired: true,
        sampleType: "Blood",
        price: 150,
        isHomeCollectionAvailable: true,
        image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Liver Function Test (LFT)",
        category: "Full Body",
        description: "Helps determine the health of your liver by measuring levels of proteins, liver enzymes, and bilirubin in your blood.",
        preparationInstructions: "Fasting may be required, check with doctor.",
        fastingRequired: false,
        sampleType: "Blood",
        price: 799,
        isHomeCollectionAvailable: true,
        image: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=800"
    },

    {
        name: "Vitamin D Total",
        category: "Women Health",
        description: "Screening for Vitamin D deficiency, crucial for bone health and immunity.",
        preparationInstructions: "No special preparation needed.",
        fastingRequired: false,
        sampleType: "Blood",
        price: 999,
        isHomeCollectionAvailable: true,
        image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Urine Routine & Microscopy",
        category: "Full Body",
        description: "Checks for common urinary tract infections, kidney disease, and diabetes.",
        preparationInstructions: "Collect mid-stream urine sample.",
        fastingRequired: false,
        sampleType: "Urine",
        price: 199,
        isHomeCollectionAvailable: true,
        image: "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Full Body Checkup - Basic",
        category: "Full Body",
        description: "Comprehensive health check covering CBC, Lipid, LFT, KFT, and Glucose.",
        preparationInstructions: "Fasting for 10-12 hours is required.",
        fastingRequired: true,
        sampleType: "Blood",
        price: 1499,
        isHomeCollectionAvailable: true,
        image: "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&q=80&w=800"
    }
];

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB Connected for Seeding');

        try {
            // Clear existing tests to ensure fresh data with images
            await DiagnosticTest.deleteMany({});
            console.log('Cleared existing diagnostic tests');

            const existingCount = await DiagnosticTest.countDocuments();
            if (existingCount > 0) {
                console.log(`Database already has ${existingCount} tests. Appending new ones if unique...`);
                // Simple logic: insert only if name doesn't exist
                for (const test of sampleTests) {
                    const exists = await DiagnosticTest.findOne({ name: test.name });
                    if (!exists) {
                        await DiagnosticTest.create(test);
                        console.log(`Added: ${test.name}`);
                    }
                }
            } else {
                await DiagnosticTest.insertMany(sampleTests);
                console.log(`Seeded ${sampleTests.length} diagnostic tests successfully.`);
            }

            console.log('Seeding Complete');
            process.exit();
        } catch (error) {
            console.error('Seeding Error:', error);
            process.exit(1);
        }
    })
    .catch(err => {
        console.error('Connection Error:', err);
        process.exit(1);
    });
