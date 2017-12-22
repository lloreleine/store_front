const fetch = require("node-fetch")

const express = require("express");
const nunjucks = require("nunjucks");
const app = express();

const port = 3000;

nunjucks.configure("views", {
  autoescape:true,
  express:app
});

app.use(express.static('./'));
app.use(require("body-parser").urlencoded({ extended: true }));

app.set("views", __dirname + "/views");
app.set("view engine", "njk");

app.get("/", function(request, result) {
  return fetch(
      `https://decath-product-api.herokuapp.com/categories`,
      {method: "GET"}
    )
    .then((response) => response.json())
    .then((resultCat) => {
      result.render("index", {categories:resultCat});
    });
});

app.get("/product/:cat", function(request, result) {
  return fetch(
      `https://decath-product-api.herokuapp.com/categories/${request.params.cat}/products`,
      {method: "GET"}
    )
    .then((response) => response.json())
    .then((resultProd) => {
      result.render("product", {products:resultProd});
    });
});

app.get("/article/:art", function(request, result) {
  return fetch(
      `https://decath-product-api.herokuapp.com/products/${request.params.art}`,
      {method: "GET"}
    )
    .then((response) => response.json())
    .then((resultProd) => {
      result.render("sheets", {article:resultProd});
    });
});

app.post("/form", function(request, result) {
  // console.log(request.body);
  result.render("form", {data:request.body});
});


app.listen(port, function () {
  console.log("Server listening on port:" + port);
});
