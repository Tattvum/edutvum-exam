const axios = require('axios').default

axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.put['Content-Type'] = 'application/json'

axios.defaults.baseURL = 'http://localhost:9000/-M6rxaN9gkGHiN6o4nY1/'
// axios.defaults.headers.post['Content-Type'] = "application/json"
// axios.defaults.headers.put['Content-Type'] = "application/json"

async function get(path: string): Promise<any> {
  try {
    return await axios.get(`${path}.json`);
  } catch (error) {
    console.log(error)
    return null
  }
}

async function put(path: string, data: string) {
  try {
    return await axios.put(`${path}.json`, data);
  } catch (error) {
    console.log(error)
    return null
  }
}

async function post(path: string, data: string) {
  try {
    return await axios.post(`${path}.json`, data);
  } catch (error) {
    console.log(error)
    return null
  }
}

(async function () {
  let res = null

  res = await get("")
  console.log(res.data)
  // console.log(res.data.name)

  // res = await get("things")
  // console.log(res.data)
  // console.log(res.data[0].name)

  // res = await put("things/name", '"Nut"')
  // console.log(res.data)

  // res = await axios.post('bag.json', '{"type": "Moondru"}');
  // res = await axios.put('bag/three.json', '{"type": "Moondru"}');
  // res = await axios.put('bag/two.json', '["Ondru", "Irandu", "Moondru"]');
  // console.log(res)

  // res = await axios.delete('things/0.json');
  // console.log(res)

  res = await get("")
  console.log(res.data)
})();
