module.exports = dev = {
  app: {
    name: "mernClientServerDemo",
    port: 3050
  },
  db: {
    url: "mongodb://admin:iHR4uCiSEDaRGZzt@ds127811.mlab.com:27811/a_sandbox"
  },
  jwt: {
    key: "$Ilv3rBuLL3T",
    expiry: 3600
  },
  morgan: {
    log_type: "combined"
  },
  logs: {
    dir: "logs",
    log_file: "app-dev.log",
    err_file: "error-dev.log"
  }
  // reporting_api: {
  //   url: "http://localhost:7777/error",
  //   options: {
  //     method: "POST",
  //     key: ""
  //   }
  // }
};
