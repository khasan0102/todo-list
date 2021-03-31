const express = require("express");
const moment = require("moment");
const app = express();
const path = require("path");
const functions = require("./functions/readBase");
const PORT = process.env.PORT || 5500;
const basePath = path.join(__dirname, 'db.json');


app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded());

app.get("/", HomeGetController);
app.post("/", HomePostController);
app.get("/delete/:id", HomeDeleteController);
app.get("/error", ErrorGetController);
app.get('/books', BookController);


const books = [
    {id: 1, name: "SAriq devni minib"}
]


 async function HomeGetController(req, res) {
   
    let data = await functions.read(basePath);
    await res.render("index", { site_name: "Todo-list", data });
}


function BookController(req, res) {
    res.send({
        books
    })
}



async function HomePostController(req, res) {
    let data = await functions.read(basePath);
    let timeNow = moment().toString().slice(16, 21);
    if (getMinut(timeNow) < getMinut(req.body.time)) {
        data.push({
            ...req.body,
            id: data.length + 1,
            addedTime: timeNow,
            minut: getMinut(req.body.time),
        });
        data.sort((a, b) => a.minut - b.minut);
        await functions.write(basePath, data);
        await  res.redirect("/");
    }else{
        res.status(400).redirect("/error");
    }
}

async function HomeDeleteController(req, res) {
    let data = await functions.read(basePath);
    let { id } = req.params;
    data = data.filter((item) => {
        return item.id !== id - 0;
    });
    await functions.write(basePath, data);
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





app.listen(PORT, () => console.log(`Server has been started port ${PORT}...`));