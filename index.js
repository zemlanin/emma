const sqlite = require('sqlite');
const dbPromise = sqlite.open('emma.db')
  .then(db => db.migrate({ force: 'last' }))
  .catch(err => {
    console.error(err)
    process.exit(1)
  });

module.exports = async (req, res) => {
  const db = await dbPromise;

  const machines = await db.get("SELECT *, json_extract(machines.data, '$.user_id') user_id from machines")

  return { status: 'ok', machines }
}
