const express = require("express");
const moment = require("moment");
const app = express();
const PORT = process.env.PORT || 5500;

app.listen(PORT, () => console.log(`Server has been started port ${PORT}...`));

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded());

app.get("/", HomeGetController);
app.post("/", HomePostController);
app.get("/delete/:id", HomeDeleteController);
app.get("/error", ErrorGetController);
let data = [];

function HomeGetController(req, res) {
    res.render("index", { site_name: "Todo-list", data });
}

function HomePostController(req, res) {
    let timeNow = moment().toString().slice(16, 21);
    if (getMinut(timeNow) < getMinut(req.body.time)) {
        data.push({
            ...req.body,
            id: data.length + 1,
            addedTime: timeNow,
            minut: getMinut(req.body.time),
        });
        data.sort((a, b) => a.minut - b.minut);
        res.redirect("/");
    }else{
        res.status(400).redirect("/error");
    }
}

function HomeDeleteController(req, res) {
    let { id } = req.params;
    data = data.filter((item) => {
        return item.id !== id - 0;
    });
    res.redirect("/");
}

function getMinut(time) {
    time = time.split(":");
    let minut = time[0] * 60 + (time[1] - 0);
    return minut;
}

function ErrorGetController(req, res) {
    res.render("error", { site_name: "Error" });
}
