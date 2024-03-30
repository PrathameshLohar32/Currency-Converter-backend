import express from 'express';
import cors from 'cors'; 
import rateLimit from 'express-rate-limit';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

const API_URL = 'https://v6.exchangerate-api.com/v6/';
const API_KEY = process.env.EXCHANGE_RATE_API_KEY;
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});

// Apply cors middleware
app.use(cors());

//middlewares
app.use(express.json()); // pass incoming json data
app.use(apiLimiter);

// conversion router
app.post('/api/convert', async (req, res) => {
    try {
        const { from, to, amount } = req.body;
        console.log({ from, to, amount });
        const url = `${API_URL}${API_KEY}/pair/${from}/${to}/${amount}`;
        const response = await axios.get(url);
        if (response.data && response.data.result === 'success') {
            res.json({
                base: from,
                target: to,
                conversionRate: response.data.conversion_rate,
                convertedAmount: response.data.conversion_result
            });
        } else {
            res.json({ message: "Error While Converting currency", details: response.data })
        }
    } catch (error) {
        res.json({ message: "Error While Converting currency", details: error.message });
    }
});

// start the server 
app.listen(PORT, console.log(`Server is running on PORT ${PORT}`));
