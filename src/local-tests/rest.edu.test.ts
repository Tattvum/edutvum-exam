// import { HttpClient } from '@angular/common/http';
const axios1 = require('axios').default;

axios1.defaults.baseURL = "http://localhost:9000/-M6wbpXMXJhX4abL9CQo/";
axios1.defaults.headers.post['Content-Type'] = 'application/json';
axios1.defaults.headers.put['Content-Type'] = 'application/json';

(async function () {
  try {
    let res = null

    // res = await axios1.get('ver5/tags.json');
    // console.log(res.data)

    res = await axios1.get('ver5/users.json');
    let users = res.data
    console.log(users.map((u, i) => ({ i: i, displayName: u.displayName })))

    users[13].localId = 'u1'
    console.log(users[13])

    // res = await axios1.put('ver5/users.json', users);
    // console.log(res.data)

    // res = await axios1.get('ver5/users.json');
    // console.log(res.data)
    // users = res.data
    // console.log(users.filter(u => u.displayName === 'SVR Staging'))

  } catch (error) {
    console.log(error)
  }
})();
