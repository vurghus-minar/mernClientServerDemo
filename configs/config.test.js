module.exports = test = {
  app: {
    port: 3050
  },
  db: {
    host: "localhost",
    port: 27017,
    name: "",
    url: ""
  },
  morgan: {
    log_type: "combined"
  },
  logs: {
    dir: "logs",
    log_file: "app-test.log",
    err_file: "error-test.log"
  }
};
