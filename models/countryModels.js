const { MongoClient } = require("mongodb");

// Replace the following with your Atlas connection string                                                                                                                                        
const url = "mongodb+srv://team-web:i031Onxb3JsJ0Gj9@cluster0.nhzle.mongodb.net/book-store?retryWrites=true&w=majority";
const client = new MongoClient(url, { useUnifiedTopology: true });

// The database to use
const dbName = "book-store";

async function run() {
  try {
    await client.connect();
    console.log("Connected correctly to server");
  } catch (err) {
    console.log(err.stack);
  }
}
run().catch(console.dir);
module.exports.province = async () => {
  const db = client.db(dbName);
  // Use the collection "people"
  const col = db.collection("vietnam");
  const province = await col.find({}, { projection: { _id: 0, name: 1} }).toArray();
  return province;
}
module.exports.district = async (province) => {
  const db = client.db(dbName);
  // Use the collection "people"
  const col = db.collection("vietnam");
  // console.log('current provice: ' + province);
  const newProvince = await col.findOne({name: province});
  const district = newProvince.quan_huyen;
  // console.log(district);
  let districts = [];
  for(let key in district) {
    let dis = {name: district[key].name}
    districts.push(dis);
  }
  return districts;
}

module.exports.wards = async(province, district) => {
  const db = client.db(dbName);
  // Use the collection "people"
  const col = db.collection("vietnam");
  // console.log('current provice: ' + province);
  const newProvince = await col.findOne({name: province});
  const districts = newProvince.quan_huyen;
  // console.log(district);
  let listWard = []
  for(let key in districts) {
    if (district == districts[key].name) {
      const wards = districts[key].xa_phuong;
      for(let ward in wards) {
        const w = {name: wards[ward].name};
        listWard.push(w);
      }
    }
  }
  return listWard;
}