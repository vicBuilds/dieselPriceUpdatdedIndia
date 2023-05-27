const express = require("express");
const app = express();
const axios = require("axios");

require("dotenv").config();

const options = {
  method: "GET",
  url: "https://long-trench-coat-lion.cyclic.app/diesel-prices",
};

app.get("/fetch-diesel-prices", async (req, res) => {
  try {
    let response = await axios.request(options);

    let dataToBeSent = response.data;

    console.log(dataToBeSent);

    // Lets send the data to the end point
    const urlToSendData = "https://en03k0l91q0m9c.x.pipedream.net/";
    let isDataSend = await axios.post(urlToSendData, dataToBeSent);
    //console.log(isDataSend);

    console.log("State wise Diesel Prices sent successfully.");
    res.status(200).json({
      message: "Diesel prices sent to end point successfully.",
      data: dataToBeSent,
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
