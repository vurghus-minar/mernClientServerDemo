const app = require("./app");
const config = require("./config");

// PORT
const port = process.env.port || config.app.port;

// Server set up
const server = app.listen(port, () => console.log(`listening on port ${port}`));
