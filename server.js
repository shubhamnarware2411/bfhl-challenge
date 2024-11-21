const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage });

const isPrime = (num) => {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};

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
            fileDetails.file_mime_type = "application/octet-stream";
            fileDetails.file_size_kb = (fileBuffer.length / 1024).toFixed(2);
        } catch {
            fileDetails.file_valid = false;
        }
    }

    res.json({
        is_success: true,
        user_id: "john_doe_17091999",
        email: "john@xyz.com",
        roll_number: "ABCD123",
        numbers,
        alphabets,
        highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : [],
        is_prime_found: primeFound,
        ...fileDetails,
    });
});

app.get("/bfhl", (req, res) => {
    res.status(200).json({ operation_code: 1 });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
