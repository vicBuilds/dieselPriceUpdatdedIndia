const express = require("express");
const app = express();
const axios = require("axios");
const cheerio = require("cheerio");
require("dotenv").config();

const options = {
  method: "GET",
  url: "./././.....////....",
};

app.get("/fetch-diesel-prices", async (req, res) => {
  try {
    let response = await axios.request(options);

    let dataToBeSent = response.data;

    const $ = cheerio.load(dataToBeSent);
    const trElements = $("tr");

    let PriceList = [];
    /*
    1. Web Scraped NDTV Website by cherrio
    2. First index had the table header so left that
    3. I wanted only the name and prices so got only td[0] and td[0]
    4. Pushed the objects in an array
    5. Modified the Price to get only the numeric value
    6. Checked the Data (it was fine)
    7. Send the data to the end point
    8. Deployed it
    */
    trElements.each((index, element) => {
      if (index > 1) {
        const tdElements = $(element).find("td");
        // temp object to push into a array
        let temp = {};
        tdElements.each((index, tdElement) => {
          if (index < 2) {
            index == 0
              ? (temp.name = $(tdElement).text())
              : (temp.price = $(tdElement).text());
          }
        });
        PriceList.push(temp);
      }
    });

    // This method returns the numeric value in the price
    const updatedFuelData = PriceList.map((item) => {
      const numericPrice = parseFloat(item.price.split(" ")[0]);
      return { name: item.name, price: numericPrice };
    });

    // A log to check if the prices are working fine
    console.log("Hello", typeof updatedFuelData[0].price);

    //Lets send the data to the end point

    const urlToSendData = "https://en03k0l91q0m9c.x.pipedream.net/";
    let isDataSend = await axios.post(urlToSendData, updatedFuelData);
    //console.log(isDataSend);

    // console.log("State wise Diesel Prices sent successfully.");
    res.status(200).json({
      message: "Diesel prices sent to end point successfully.",
      data: updatedFuelData,
    });
  } catch (error) {
    console.error("Error fetching or sending diesel prices:", error);
    // Send an error response to the client
    res.status(500).json({
      error: "An error occurred while fetching or sending diesel prices.",
    });
  }
});

// Start the server
app.listen(5000, () => {
  console.log("Server started on port 5000");
});
