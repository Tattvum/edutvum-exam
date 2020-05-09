import { HttpClient, HttpHandler } from '@angular/common/http';

const baseURL = "http://localhost:9000/-M6t2DmpUrDvpygsUllB/";

(async function () {
  try {
    let http = new HttpClient(null)

    let res = null
    //OH! Not working
    res = await http.get(baseURL + 'ver5/tags.json').toPromise()
    console.log(res.data)

  } catch (error) {
    console.log(error)
  }
})();
