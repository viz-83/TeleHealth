module.exports = [
    // EMERGENCY / CRITICAL
    {
        keywords: ["chest pain", "shortness of breath", "tightness", "heart attack", "heart", "palpitations", "crushing pain", "jaw pain", "left arm pain"],
        specialization: "Cardiologist",
        severity: "EMERGENCY",
        emergencyMessage: "Possible heart emergency. Seek immediate medical attention."
    },
    {
        keywords: ["stroke", "face drooping", "arm weakness", "speech difficulty", "sudden numbness", "confusion", "seizure", "loss of consciousness"],
        specialization: "Neurologist",
        severity: "EMERGENCY",
        emergencyMessage: "Possible stroke or critical neurological event. Call emergency services immediately."
    },
    {
        keywords: ["severe burn", "deep cut", "uncontrollable bleeding", "trauma", "accident", "fracture", "head injury"],
        specialization: "General Physician", // Or Emergency Medicine if available
        severity: "EMERGENCY",
        emergencyMessage: "Severe injury detected. Go to the Emergency Room immediately."
    },

    // MEDIUM / HIGH PRIORITY
    {
        keywords: ["headache", "migraine", "dizziness", "vertigo", "forgetfulness", "tremors", "numbness"],
        specialization: "Neurologist",
        severity: "MEDIUM",
        emergencyMessage: null
    },
    {
        keywords: ["stomach pain", "vomiting", "diarrhea", "nausea", "abdominal pain", "gas", "bloating", "acid reflux", "heartburn", "constipation", "blood in stool"],
        specialization: "Gastroenterologist",
        severity: "MEDIUM",
        emergencyMessage: null
    },
    {
        keywords: ["bone pain", "joint pain", "back pain", "arthritis", "knee pain", "shoulder pain", "muscle tear", "sprain", "swelling"],
        specialization: "Orthopedic",
        severity: "MEDIUM",
        emergencyMessage: null
    },
    {
        keywords: ["pregnancy", "period", "menstruation", "vaginal", "pelvic pain", "cramps", "spotting", "menopause"],
        specialization: "Gynecologist",
        severity: "MEDIUM",
        emergencyMessage: null
    },
    {
        keywords: ["urinary", "urine", "bladder", "kidney", "kidney stone", "burning urination", "frequent urination", "blood in urine"],
        specialization: "Urologist",
        severity: "MEDIUM",
        emergencyMessage: null
    },
    {
        keywords: ["breathing difficulty", "asthma", "wheezing", "persistent cough", "lung", "bronchitis", "pneumonia"],
        specialization: "Pulmonologist",
        severity: "HIGH", // Can be emergency if severe
        emergencyMessage: "If you are struggling to breathe, seek emergency care."
    },

    // ROUTINE / LOW PRIORITY
    {
        keywords: ["fever", "cold", "flu", "runny nose", "sore throat", "weakness", "body ache", "fatigue", "general checkup", "viral"],
        specialization: "General Physician",
        severity: "LOW",
        emergencyMessage: null
    },
    {
        keywords: ["skin rash", "itching", "acne", "redness", "bumps", "hair loss", "dandruff", "eczema", "psoriasis", "dark spots"],
        specialization: "Dermatologist",
        severity: "LOW",
        emergencyMessage: null
    },
    {
        keywords: ["tooth pain", "cavity", "bleeding gums", "sensitive teeth", "toothache", "swollen gums", "bad breath", "root canal"],
        specialization: "Dentist",
        severity: "LOW",
        emergencyMessage: null
    },
    {
        keywords: ["eye pain", "blurred vision", "red eye", "itchy eyes", "watery eyes", "glasses", "vision loss", "stye"],
        specialization: "Ophthalmologist",
        severity: "LOW", // High if vision loss is sudden
        emergencyMessage: "If vision loss is sudden, seek immediate care."
    },
    {
        keywords: ["ear pain", "hearing loss", "ringing in ear", "blocked nose", "sinus", "tonsils", "throat pain", "voice loss"],
        specialization: "ENT Specialist",
        severity: "LOW",
        emergencyMessage: null
    },
    {
        keywords: ["anxiety", "depression", "panic", "stress", "mental health", "sadness", "insomnia", "mood swings", "hallucinations"],
        specialization: "Psychiatrist",
        severity: "MEDIUM", // High if suicidal
        emergencyMessage: "If you are feeling suicidal, call a helpline immediately."
    },
    {
        keywords: ["baby", "child", "infant", "toddler", "vaccination", "growth", "pediatric"],
        specialization: "Pediatrician",
        severity: "MEDIUM",
        emergencyMessage: null
    },
    {
        keywords: ["weight loss", "weight gain", "diet", "nutrition", "diabetes", "sugar", "thyroid", "cholesterol"],
        specialization: "Endocrinologist", // or Dietitian
        severity: "LOW",
        emergencyMessage: null
    }
];
