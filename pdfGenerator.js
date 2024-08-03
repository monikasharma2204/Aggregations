
// const puppeteer = require('puppeteer');
// const handlebars = require('handlebars');
// const fs = require('fs');
// const path = require('path');
// const os = require('os');
// const mongoose = require('mongoose');
// const Color = require('./colorModel');

// // MongoDB connection string
// const mongoURI = 'mongodb+srv://monika:tKi8wy40OGWK6JvK@cluster0.q80klw5.mongodb.net/diamond';

// const fetchData = async () => {
//     try {
//         return await Color.find({ is_delete: 0 }).lean();
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         return [];
//     }
// };

// const generatePDF = async (data) => {
//     const htmlPath = path.join(process.cwd(), 'invoice_template.html');
//     const htmlTemplate = fs.readFileSync(htmlPath, 'utf-8');
//     const template = handlebars.compile(htmlTemplate);
//     const htmlContent = template({ colors: data });

//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.setContent(htmlContent);

//     const downloadsPath = path.join(os.homedir(), 'Downloads', 'invoice.pdf');
//     await page.pdf({ path: downloadsPath, format: 'A4' });

//     await browser.close();
//     console.log(`PDF saved at ${downloadsPath}`);
// };

// const connectAndGeneratePDF = async () => {
//     try {
//         await mongoose.connect(mongoURI);
//         console.log('MongoDB connected');
        
//         const colors = await fetchData();
//         if (colors.length === 0) {
//             console.log('No data found in MongoDB.');
//         } else {
//             await generatePDF(colors);
//         }
//     } catch (err) {
//         console.error('MongoDB connection error:', err);
//     } finally {
//         await mongoose.disconnect();
//     }
// };

// module.exports = connectAndGeneratePDF;



const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const os = require('os');
const mongoose = require('mongoose');
const Color = require('./colorModel'); 


const mongoURI = 'mongodb+srv://monika:tKi8wy40OGWK6JvK@cluster0.q80klw5.mongodb.net/diamond';

// using Aggregation pipeline 
const aggregationPipeline = [
    {
        $match: { 
            name: "Smoke Grey",  // to find particular data    is_delete: 0 // To include all table data
            is_delete: 0 
        }
    
    
    },
    {
        $project: {
        //  $project stage is used to control which fields are include or exclude
            _id: 0, 
            name: 1,
            code: 1,
            Status: 1,
            from: 1,
            to: 1,
            createdAt: 1,
            updatedAt: 1
        }
    }
];


const fetchData = async () => {
    try {
        return await Color.aggregate(aggregationPipeline).exec();
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

// Function to generate PDF from data
const generatePDF = async (data) => {
    try {
        const htmlPath = path.resolve('invoice_template.html');
        const htmlTemplate = fs.readFileSync(htmlPath, 'utf-8');
        const template = handlebars.compile(htmlTemplate);
        const htmlContent = template({ colors: data });

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(htmlContent);

        const downloadsPath = path.join(os.homedir(), 'Downloads', 'invoice.pdf');
        await page.pdf({ path: downloadsPath, format: 'A4' });

        await browser.close();
        console.log(`PDF saved at ${downloadsPath}`);
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
};

//connection betwween mongo db 
const connectAndGeneratePDF = async () => {
    let connection;
    try {
        connection = await mongoose.connect(mongoURI);
        console.log('MongoDB connected');

        const colors = await fetchData();
        if (colors.length === 0) {
            console.log('No data found in MongoDB.');
        } else {
            await generatePDF(colors);
        }
    } catch (err) {
        console.error('MongoDB connection error:', err);
    } finally {
        if (connection) {
            await mongoose.disconnect();
        }
    }
};

module.exports = connectAndGeneratePDF;
