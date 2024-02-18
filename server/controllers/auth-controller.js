const ApiData = require("../models/data-model")
const axios = require('axios');

const home = async  (req, res) => {
    try{
        res.status(200).send("Hello World")
    } catch (errors){
        console.error(error)
    }
}



const initializeDatabase = async (req, res) => {
    try{
        const apiUrl = process.env.API_URL;
        const response = await axios.get(apiUrl)
        const responseData = response.data;
        for (const data of responseData){
            // Considering each product has unique ID
            const productIdExists = await ApiData.findOne({id:data.id});
            if(!productIdExists){
                await ApiData.create(data);
            }
        }
        res.status(200).json({ message: 'Database initialized successfully.' });
    }catch (error){
        console.error('Error initializing database:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


const displayAllData = async (req, res) => {
    try{
        let data = await ApiData.find({}).sort({dateOfSale: -1});
        } catch(error){
            console.error(`Error: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    res.send(data)
};

const transactions = async (req, res) => {
    try {
        const {page = 1, perPage = 10, search = ""} = req.query;
        const skip = (page - 1) * perPage;

        let query = {};
        if (search){
            query = {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { price: { $regex: search, $options: 'i' } }
                ]
            }
        }
        let data = await ApiData.find({}).sort({dateOfSale: -1}).skip(skip).limit(parseInt(perPage));

        res.json({data})
    } catch (error){
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const statistics = async (req, res) => {
    const {month} = req.query;
    if (!month){
        res.status(412).json({ error: 'Month is required!' });
    }
    if (month < 1 || month > 12){
        res.status(422).json({ error: 'Month is Invalid!' });
    }
    let data = await ApiData.find({}).sort({dateOfSale: -1});
    let filteredData = data.filter((item) => new Date(item.dateOfSale).getMonth() + 1 == month);
    let result = getStasticsData(filteredData);
    res.send(result);
}

const barChart = async (req, res) => {
    const {month} = req.query;

    if (!month){
        res.status(412).json({ error: 'Month is required!' });
    }
    if (month < 1 || month > 12){
        res.status(422).json({ error: 'Month is Invalid!' });
    }
    let data = await ApiData.find({}).sort({dateOfSale: -1});
    let filteredData = data.filter((item) => new Date(item.dateOfSale).getMonth() + 1 == month);
    let result = getBarChartData(filteredData);
    res.send(result);
}

const pieChartData = async (req, res) => {
    const {month} = req.query;

    if (!month){
        res.status(412).json({ error: 'Month is required!' });
    }
    if (month < 1 || month > 12){
        res.status(422).json({ error: 'Month is Invalid!' });
    }
    let data = await ApiData.find({}).sort({dateOfSale: -1});
    let filteredData = data.filter((item) => new Date(item.dateOfSale).getMonth() + 1 == month);
    let result = getPieChartData(filteredData);
    res.send(result);
}

const combined = async (req, res) => {
    const {month} = req.query;

    if (!month){
        res.status(412).json({ error: 'Month is required!' });
    }
    if (month < 1 || month > 12){
        res.status(422).json({ error: 'Month is Invalid!' });
    }
    let data = await ApiData.find({}).sort({dateOfSale: -1});
    let filteredData = data.filter((item) => new Date(item.dateOfSale).getMonth() + 1 == month);
    let result = {
        statistics: getStasticsData(filteredData),
        barChart: getBarChartData(filteredData),
        pieChart: getPieChartData(filteredData),
    }
    res.send(result);
}

module.exports = {home, initializeDatabase, transactions, statistics, barChart, pieChartData, combined}


const getStasticsData = (filteredData) => {
    let result = {
        totalSaleAmount: 0,
        totalNumberOfSoldItems: 0,
        totalNumberOfNotSoldItems: 0,
    };
    for(const item of filteredData){
        result.totalSaleAmount += item.price;
        console.log(item.sold)
        if (item.sold){
            result.totalNumberOfSoldItems += 1;
        } else{
            result.totalNumberOfNotSoldItems += 1;
        }
    }
    return result;
}


const getBarChartData = (filteredData) => {
    let result = {
        "0-100":0,
        "101-200":0,
        "201-300":0,
        "301-400":0,
        "401-500":0,
        "501-600":0,
       "601-700":0,
        "701-800":0,
        "801-900":0,
        "901-above":0,
    }
    for (const item of filteredData){
        const price = parseFloat(item.price);
        if (!isNaN(price)){
            const priceRange = Math.min(9,Math.floor(price/100));
            const key = `${priceRange * 100 + 1}-${(priceRange + 1) * 100}`;
            result[key] += 1;

        }
    }
    return result;
}

const getPieChartData = (filteredData) => {
    let result = {};
    for(let item of filteredData){
        if (item.category in result){
            result[item.category] += 1;
        } else {
            result[item.category] = 1;
        }
    }
    return result;
}