db.createUser({
  user: "appuser",
  pwd: "appuserpass",
  roles: [{ role: "readWrite", db: "mytradingapp" }]
});
