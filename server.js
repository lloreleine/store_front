const fetch = require("node-fetch")

const express = require("express");
const nunjucks = require("nunjucks");
const app = express();

const port = process.env["PORT"] || 3000;

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
    .then(function(resultProd) {
      const new_price = resultProd.min_price.toFixed(2);
      const article = {
        id:resultProd.id,
        decathon_id:resultProd.decathon_id,
        title:resultProd.title,
        description:resultProd.description,
        brand_id:resultProd.brand_id,
        min_price:new_price,
        max_price:resultProd.max_price,
        crossed_price:resultProd.crossed_price,
        percent_reduction:resultProd.percent_reduction,
        image_path:resultProd.image_path,
        rating:resultProd.rating
      };
      console.log(new_price);
      return article;
    })
    .then((resultNew) => {
      result.render("sheets", {article:resultNew});
    });
});

app.post("/form/:id", function(request, result) {
  // console.log(request.body);
  result.render("form", {
    data:request.body,
    product_id:request.params.id
  });
});


app.listen(port, function () {
  console.log("Server listening on port:" + port);
});
