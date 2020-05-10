// import { HttpClient } from '@angular/common/http';
const axios1 = require('axios').default;

axios1.defaults.baseURL = "http://localhost:9000/-M6xtyd_fcbncfTkLkHs/";
axios1.defaults.headers.post['Content-Type'] = 'application/json';
axios1.defaults.headers.put['Content-Type'] = 'application/json';

(async function () {
  try {
    let res = null
    let data = null

    data = "Item 41"
    res = await axios1.put('bingo/.json', JSON.stringify(data));
    console.log(res.data)

    res = await axios1.get('.json');
    console.log(res.data)

  } catch (error) {
    console.log(error)
  }
})();
