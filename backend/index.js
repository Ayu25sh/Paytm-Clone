const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

const routes = require("./Route/routes");
app.use("/api/v1",routes);

app.listen(PORT, () => {
    console.log(`App is listening at Port no ${PORT}`);
})

app.get("/",(req,res) => {
    res.json({
        success:true,
        message:"You are at default route",
    })
})


