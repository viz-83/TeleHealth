const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Medicine = require('./models/medicineModel');

dotenv.config();

const sampleMedicines = [
    // OTC
    {
        name: "Paracetamol 500mg",
        brand: "Dolo",
        composition: "Paracetamol",
        category: "OTC",
        dosageForm: "Tablet",
        strength: "500mg",
        prescriptionRequired: false,
        price: 30,
        stockQuantity: 1000,
        description: "Common pain reliever and fever reducer.",
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Cetirizine 10mg",
        brand: "Cetzine",
        composition: "Cetirizine Hydrochloride",
        category: "OTC",
        dosageForm: "Tablet",
        strength: "10mg",
        prescriptionRequired: false,
        price: 45,
        stockQuantity: 800,
        description: "Antihistamine used for allergy relief.",
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Vicks Vaporub",
        brand: "Vicks",
        composition: "Menthol, Camphor, Eucalyptus Oil",
        category: "OTC",
        dosageForm: "Balm",
        strength: "50g",
        prescriptionRequired: false,
        price: 45,
        stockQuantity: 500,
        description: "Relief from cold, cough, and blocked nose.",
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800"
    },

    // Tablets (Antibiotics/General)
    {
        name: "Amoxicillin 500mg",
        brand: "Moxikind",
        composition: "Amoxicillin Trihydrate",
        category: "Tablets",
        dosageForm: "Capsule",
        strength: "500mg",
        prescriptionRequired: true,
        price: 120,
        stockQuantity: 500,
        description: "Antibiotic used to treat bacterial infections.",
        image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Azithromycin 500mg",
        brand: "Azithral",
        composition: "Azithromycin",
        category: "Tablets",
        dosageForm: "Tablet",
        strength: "500mg",
        prescriptionRequired: true,
        price: 110,
        stockQuantity: 300,
        description: "Antibiotic used for various infections including respiratory.",
        image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Combiflam",
        brand: "Sanofi",
        composition: "Ibuprofen + Paracetamol",
        category: "Tablets",
        dosageForm: "Tablet",
        strength: "400mg + 325mg",
        prescriptionRequired: false,
        price: 40,
        stockQuantity: 600,
        description: "Pain relief for headache, muscle pain, and fever.",
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800"
    },


    // Syrups
    {
        name: "Benadryl Cough Syrup",
        brand: "Benadryl",
        composition: "Diphenhydramine",
        category: "Syrups",
        dosageForm: "Syrup",
        strength: "100ml",
        prescriptionRequired: false,
        price: 115,
        stockQuantity: 400,
        description: "Relief from cough and cold symptoms.",
        image: "https://images.unsplash.com/photo-1624454002302-36b824d7bd0a?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Digene Gel",
        brand: "Abbott",
        composition: "Magnesium Hydroxide",
        category: "Syrups",
        dosageForm: "Syrup",
        strength: "200ml",
        prescriptionRequired: false,
        price: 150,
        stockQuantity: 300,
        description: "Quick relief from acidity, gas, and bloating.",
        image: "https://images.unsplash.com/photo-1624454002302-36b824d7bd0a?auto=format&fit=crop&q=80&w=800"
    },

    // Chronic Care
    {
        name: "Metformin 500mg",
        brand: "Glycomet",
        composition: "Metformin Hydrochloride",
        category: "Chronic Care",
        dosageForm: "Tablet",
        strength: "500mg",
        prescriptionRequired: true,
        price: 25,
        stockQuantity: 2000,
        description: "First-line medication for type 2 diabetes.",
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Pantoprazole 40mg",
        brand: "Pan 40",
        composition: "Pantoprazole",
        category: "Chronic Care",
        dosageForm: "Tablet",
        strength: "40mg",
        prescriptionRequired: true,
        price: 130,
        stockQuantity: 900,
        description: "Reduces stomach acid, treats acid reflux.",
        image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Telmisartan 40mg",
        brand: "Telma",
        composition: "Telmisartan",
        category: "Chronic Care",
        dosageForm: "Tablet",
        strength: "40mg",
        prescriptionRequired: true,
        price: 200,
        stockQuantity: 400,
        description: "Medicine used to treat high blood pressure.",
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Atorvastatin 10mg",
        brand: "Atorva",
        composition: "Atorvastatin Calcium",
        category: "Chronic Care",
        dosageForm: "Tablet",
        strength: "10mg",
        prescriptionRequired: true,
        price: 180,
        stockQuantity: 500,
        description: "Lowers cholesterol and reduces risk of heart disease.",
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800"
    },

    // Vitamins & Supplements
    {
        name: "Vitamin C Chewable",
        brand: "Limcee",
        composition: "Ascorbic Acid",
        category: "Vitamins & Supplements",
        dosageForm: "Tablet",
        strength: "500mg",
        prescriptionRequired: false,
        price: 35,
        stockQuantity: 1500,
        description: "Vitamin C supplement for immunity boosting.",
        image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Neurobion Forte",
        brand: "B12",
        composition: "Vitamin B Complex",
        category: "Vitamins & Supplements",
        dosageForm: "Tablet",
        strength: "10mg",
        prescriptionRequired: false,
        price: 38,
        stockQuantity: 800,
        description: "Vitamin B supplements for nerve health.",
        image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Shelcal 500",
        brand: "Shelcal",
        composition: "Calcium + Vitamin D3",
        category: "Vitamins & Supplements",
        dosageForm: "Tablet",
        strength: "500mg",
        prescriptionRequired: false,
        price: 110,
        stockQuantity: 600,
        description: "Calcium supplement for strong bones.",
        image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800"
    },

    // First Aid
    {
        name: "Volini Pain Spray",
        brand: "Volini",
        composition: "Diclofenac",
        category: "First Aid",
        dosageForm: "Spray",
        strength: "40g",
        prescriptionRequired: false,
        price: 150,
        stockQuantity: 600,
        description: "Instant relief from muscle pain and sprains.",
        image: "https://images.unsplash.com/photo-1624454002302-36b824d7bd0a?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Dettol Antiseptic",
        brand: "Dettol",
        composition: "Chloroxylenol",
        category: "First Aid",
        dosageForm: "Liquid",
        strength: "250ml",
        prescriptionRequired: false,
        price: 160,
        stockQuantity: 1000,
        description: "Antiseptic liquid for cuts and wounds.",
        image: "https://images.unsplash.com/photo-1624454002302-36b824d7bd0a?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Betadine Ointment",
        brand: "Betadine",
        composition: "Povidone-Iodine",
        category: "First Aid",
        dosageForm: "Cream",
        strength: "20g",
        prescriptionRequired: false,
        price: 110,
        stockQuantity: 400,
        description: "Antiseptic ointment for wounds and burns.",
        image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=800"
    },

    // Devices
    {
        name: "Digital Thermometer",
        brand: "Omron",
        composition: "N/A",
        category: "Healthcare Devices",
        dosageForm: "Device",
        strength: "N/A",
        prescriptionRequired: false,
        price: 250,
        stockQuantity: 100,
        description: "Accurate digital thermometer for home use.",
        image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=800"
    }
];

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB Connected for Medicine Seeding');
        try {
            await Medicine.deleteMany({});
            console.log('Cleared existing medicines');

            await Medicine.insertMany(sampleMedicines);
            console.log(`Seeded ${sampleMedicines.length} medicines successfully.`);

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
