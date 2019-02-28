module.exports = prod = {
  app: {
    port: 3050
  },
  db: {
    host: "localhost",
    port: 27017,
    name: "",
    url: ""
  },
  debug: false,
  morgan: {
    log_type: "combined"
  },
  logs: {
    dir: "logs",
    log_file: "app.log",
    err_file: "error.log"
  }
};
