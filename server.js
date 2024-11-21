const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

// Multer configuration for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper function to check for prime numbers
const isPrime = (num) => {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};

// Process input data
const processInputData = (data) => {
    const numbers = [];
    const alphabets = [];
    let highestLowercase = null;
    let primeFound = false;

    data.forEach((item) => {
        if (!isNaN(item)) {
            const num = Number(item);
            numbers.push(num);
            if (isPrime(num)) primeFound = true;
        } else if (/[a-zA-Z]/.test(item)) {
            alphabets.push(item);
            if (/[a-z]/.test(item) && (!highestLowercase || item > highestLowercase)) {
                highestLowercase = item;
            }
        }
    });

    return { numbers, alphabets, highestLowercase, primeFound };
};

// POST endpoint
app.post("/bfhl", upload.single("file"), (req, res) => {
    const { data, file_b64 } = req.body;

    if (!data || !Array.isArray(data)) {
        return res.status(400).json({ is_success: false, error: "Invalid input data" });
    }

    const { numbers, alphabets, highestLowercase, primeFound } = processInputData(data);

    let fileDetails = { file_valid: false, file_mime_type: null, file_size_kb: null };
    if (file_b64) {
        try {
            const fileBuffer = Buffer.from(file_b64, "base64");
            fileDetails.file_valid = true;
            fileDetails.file_mime_type = "application/octet-stream"; // Assume generic MIME
            fileDetails.file_size_kb = (fileBuffer.length / 1024).toFixed(2);
        } catch {
            fileDetails.file_valid = false;
        }
    }

    res.json({
        is_success: true,
        user_id: "john_doe_17091999", // Replace with dynamic user ID
        email: "john@xyz.com", // Replace with dynamic email
        roll_number: "ABCD123", // Replace with dynamic roll number
        numbers,
        alphabets,
        highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : [],
        is_prime_found: primeFound,
        ...fileDetails,
    });
});

// GET endpoint
app.get("/bfhl", (req, res) => {
    res.status(200).json({ operation_code: 1 });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
