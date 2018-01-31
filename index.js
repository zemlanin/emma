const sqlite = require("sqlite");
const micro = require("micro");

const dbPromise = sqlite
  .open("emma.db")
  .then(db => db.migrate({ force: "last" }))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

module.exports = async (req, res) => {
  const db = await dbPromise;

  const machines = await db.get(
    "SELECT *, json_extract(machines.data, '$.user_id') user_id from machines"
  );

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const body =
    req.method === "POST" ? await micro.json(req).catch(e => null) : null;

  return { status: "ok", machines, body };
};
