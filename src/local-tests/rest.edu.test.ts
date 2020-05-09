// import { HttpClient } from '@angular/common/http';
const axios1 = require('axios').default;

axios1.defaults.baseURL = "http://localhost:9000/-M6tfguRO0gSQXNL2zyu/";
axios1.defaults.headers.post['Content-Type'] = 'application/json';
axios1.defaults.headers.put['Content-Type'] = 'application/json';

(async function () {
  try {
    let res = null

    // res = await axios1.get('ver5/tags.json');
    // console.log(res.data)

    res = await axios1.get('ver5/results/u1.json');
    console.log(res.data)

  } catch (error) {
    console.log(error)
  }
})();
