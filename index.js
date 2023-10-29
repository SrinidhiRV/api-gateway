// api-gateway.js
const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

// Define routes and their corresponding services
const routes = {
    'api-grateway': 'http://localhost:8800'
};

// Middleware to forward requests to the appropriate services
app.use((req, res) => {
    const split = req.path.split("/")
    let [empty, service, ...actualPath] = split;
    actualPath = actualPath.join("/")
    const route = routes[service];
    if (!route) {
        res.status(404).send('Not Found');
        return;
    }

    const serviceUrl = route + "/" + actualPath;
    console.log("serviceUrl", serviceUrl)
    console.log("req.method", req.method)
    axios({
        method: req.method,
        url: serviceUrl,
        data: req.body,
        headers: req.headers,
    })
        .then((response) => {
            res.status(response.status).send(response.data);
        })
        .catch((error) => {
            res.status(error.response ? error.response.status : 500).send(error.message);
        });
});

app.listen(port, () => {
    console.log(`API Gateway listening at http://localhost:${port}`);
});
