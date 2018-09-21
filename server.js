module.exports = MockBase => class MyMockModule extends MockBase {
  mocks() {
    return [{
        route: '/login',
        responses: [{
          request: {
            method: 'GET'
          },
          response: function (ctx) {
            return new Promise((resolve, reject) => {
              var MongoClient = require('mongodb').MongoClient
              // Connection URL
              var url = 'mongodb://localhost:27017/myproject';
              var username = ctx.request.query.username
              var password = ctx.request.query.password

              MongoClient.connect(url, function (err, db) {
                var dbo = db.db("mydb");
                dbo.collection("myproject").find({
                    name: username
                }).toArray(function (err, result) {
                  if (err) throw err;
                  console.log(result)
                  console.log(result[0].password)
                  console.log(result[0].admin)
                  if (result[0].password == password) {
                    ctx.body = { 
                      login : "success" ,
                      admin : result[0].admin
                    }
                    ctx.status = 200
                  } else {
                    ctx.body = { 
                      login : "failed" ,
                      admin : result[0].admin
                    }
                    ctx.status = 200
                  }
                  console.log(ctx.body)
                  db.close();
                  resolve()
                });
              })
            })
          }
        }]
      },
      {
        route: '/listUser',
        responses: [{
          response: function (ctx) {
            return new Promise((resolve, reject) => {
              var atob = require('atob')
              var moment = require('moment')
              var q = ctx.request.query.q
              var MongoClient = require('mongodb').MongoClient
              var url = 'mongodb://localhost:27017/myproject';

              // Use connect method to connect to the server
              MongoClient.connect(url, function (err, db) {
                var dbo = db.db("mydb");
                var param = JSON.parse(atob(q))
                console.log(param.startDate)
                console.log(new Date(param.startDate))
                dbo.collection("myproject").find({
                  $and: [{
                      $or: [{
                        requests: {
                          $not: {
                            $elemMatch: {
                              $gte: new Date(param.startDate),
                              $lte: new Date(param.endDate)
                            }
                          }
                        }
                      }, {
                        requests: {
                          $size: 0
                        }
                      }]
                    },
                    {
                      days: {
                        $in: parseDayArray(param.days)
                      }
                    }
                  ]
                }).toArray(function (err, result) {
                  if (err) throw err;
                  ctx.body = result
                  db.close();
                  resolve()
                });
              })
            })
          }
        }]
      },
      {
        route: '/createUser',
        responses: [{
          request: {
            method: 'POST'
          },
          response: function (ctx) {

            // ctx.body = "haha"
            return new Promise((resolve, reject) => {
              var MongoClient = require('mongodb').MongoClient
              var shortid = require('shortid')
              var url = 'mongodb://localhost:27017/myproject';
              // Use connect method to connect to the server
              MongoClient.connect(url, function (err, db) {
                // console.
                var param = ctx.request.body
                var dbo = db.db("mydb");
                var newUser = {
                  _id: shortid.generate(),
                  name: param.username,
                  password: param.password,
                  admin: param.admin,
                  days: parseDayArray(param.days),
                  requests: [],
                  assignments: [],
                  grades: param.grades
                }
                dbo.collection("myproject").insertOne(newUser, function (err, res) {
                  if (err) throw err;
                  ctx.body = "success"
                  db.close();
                  resolve();
                })
              });
            })
          }
        }]
      },
      {
        route: '/bookUser',
        responses: [{
          request: {
            method: 'PUT'
          },
          response: function (ctx) {
            return new Promise((resolve, reject) => {
              var MongoClient = require('mongodb').MongoClient
              // Connection URL
              var url = 'mongodb://localhost:27017/myproject';
              // Use connect method to connect to the server
              MongoClient.connect(url, function (err, db) {
                var param = ctx.request.body
                var startDate = new Date(param.startDate)
                var endDate = new Date(param.endDate)
                var dbo = db.db("mydb");
                console.log(getDates(startDate, endDate))
                dbo.collection("myproject").updateOne({
                    _id: param.id
                  }, {
                    $push: {
                      requests: {
                        $each: getDates(startDate, endDate)
                      }
                    }
                  },
                  function (err, res) {
                    if (err) throw err;
                    ctx.body = res
                    dbo.collection("myproject").find({}).toArray(function (err, result) {
                      if (err) throw err;
                      console.log(result);
                      db.close();
                    });
                    // db.close();
                    resolve();
                  })
              });
            })
          }
        }]
      },
      {
        route: '/getSchedule',
        responses: [{
          request: {
            method: 'GET'
          },
          response: function (ctx) {
            return new Promise((resolve, reject) => {
              var MongoClient = require('mongodb').MongoClient
              // Connection URL
              var url = 'mongodb://localhost:27017/myproject';
              // Use connect method to connect to the server

              MongoClient.connect(url, function (err, db) {
                var q = ctx.request.query
                var dbo = db.db("mydb");
                dbo.collection("myproject").findOne({
                    _id: q.id
                  }, {
                    requests: 1
                  },
                  function (err, res) {
                    if (err) throw err;
                    console.log(res)
                    ctx.body = res
                    db.close();
                    resolve();
                  })
              });
            })
          }
        }]
      },
      {
        route: '/acceptRequest',
        responses: [{
          request: {
            method: 'POST'
          },
          response: function (ctx) {
            return new Promise((resolve, reject) => {
              var MongoClient = require('mongodb').MongoClient
              // Connection URL
              var url = 'mongodb://localhost:27017/myproject';
              // Use connect method to connect to the server
              MongoClient.connect(url, function (err, db) {
                
                var param = ctx.request.body
                console.log(param)
                var acceptedDate = new Date(param.acceptedDate)
                var dbo = db.db("mydb");
                // console.log(getDates(startDate, endDate))
                dbo.collection("myproject").updateOne({
                    _id: param.id
                  }, {
                    $push: {
                      assignments: acceptedDate
                    }
                  },
                  function (err, res) {
                    if (err) throw err;
                    ctx.body = res
                    dbo.collection("myproject").updateOne({
                        _id: param.id
                      }, {
                        $pull: {
                          requests: acceptedDate
                        }
                      },
                      function (err, res) {
                        if (err) throw err;
                        ctx.body = res
                        // db.close();
                        dbo.collection("myproject").find({}).toArray(function (err, result) {
                          if (err) throw err;
                          console.log(result);
                          ctx.body = result
                          db.close();
                          resolve();
                        });
                      })
                  })
              });
            })
          }
        }]
      }
    ]
  }
}

function getDates(startDate, endDate) {
  var dates = [];
  year = startDate.getFullYear(),
    month = startDate.getMonth(),
    date = startDate.getDate(),
    offset = 8 - (startDate.getDay() || 7); // days till next Monday
  var i = 0;
  while (true) {
    console.log(dates)
    if (new Date(year, month, date + offset + 7 * i) > endDate) {
      console.log(dates)
      return dates
    }
    dates.push(new Date(year, month, date + offset + 7 * i,2,0,0,0));
    i++;
  }
}

function parseDayArray(result) {
  var parsed = []
  console.log(result[0])
  for (i = 0; i < result.length; i++) {
    if (result[i] == true) {
      if (i == 0) {
        parsed.push("mo")
      }
      if (i == 1) {
        parsed.push("tues")
      }
      if (i == 2) {
        parsed.push("wed")
      }
      if (i == 3) {
        parsed.push("thu")
      }
      if (i == 4) {
        parsed.push("fri")
      }
    }
  }
  return parsed
}

function parseGrades(result) {
  var parsed = []
  console.log(result[0])
  for (i = 0; i < result.length; i++) {
    if (result[i] == true) {
      if (i == 0) {
        parsed.push("1 ")
      }
      if (i == 1) {
        parsed.push("2 ")
      }
      if (i == 2) {
        parsed.push("3 ")
      }
      if (i == 3) {
        parsed.push("4 ")
      }
      if (i == 4) {
        parsed.push("5 ")
      }
      if (i == 5) {
        parsed.push("6 ")
      }
      if (i == 6) {
        parsed.push("7 ")
      }
      if (i == 7) {
        parsed.push("8 ")
      }
    }
  }
  return parsed
}