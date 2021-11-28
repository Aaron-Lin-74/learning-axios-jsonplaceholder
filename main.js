// axios globals (for a token, the token is from jwt.io)
// we will get the token from the server after login, we store it in local storage, we could put it in a global
// so every time we send a request, the token comes with it, and we can verify it on server
axios.defaults.headers.common['X-Auth-Token'] =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
function getTodos() {
  /** a long way to fetch data */
  // axios({
  //   method: 'get',
  //   url: 'https://jsonplaceholder.typicode.com/todos',
  //   // url params or so called query string
  //   params: {
  //     _limit: 5,
  //   },
  // })
  //   .then((res) => showOutput(res))
  //   .catch((err) => console.error(err))

  /** a shorter version */
  axios
    .get('https://jsonplaceholder.typicode.com/todos', {
      params: { _limit: 5 },
    })
    .then((res) => showOutput(res))
    .catch((err) => console.log(err))
  // by default, axios will run the get request: axios("https://...")
}

// post request
function addTodo() {
  // axios({
  //   method: 'post',
  //   url: 'https://jsonplaceholder.typicode.com/todos',
  //   data: {
  //     title: 'New Todo',
  //     completed: false,
  //   },
  // })
  //   .then((res) => showOutput(res))
  //   .catch((err) => console.log(err))
  axios
    .post('https://jsonplaceholder.typicode.com/todos', {
      title: 'New Todo',
      completed: false,
    })
    .then((res) => showOutput(res))
    .catch((err) => console.log(err))
}

// put/patch request (put request will replace the whole item, while patch only replace what we specified.)
function updateTodo() {
  axios
    // .put('https://jsonplaceholder.typicode.com/todos/1', {
    .patch('https://jsonplaceholder.typicode.com/todos/1', {
      title: 'Updated Todo',
      completed: true,
    })
    .then((res) => showOutput(res))
    .catch((err) => console.log(err))
}

// delete request
function deleteTodo() {
  axios
    .delete('https://jsonplaceholder.typicode.com/todos/1')
    .then((res) => showOutput(res))
    .catch((err) => console.log(err))
}

// simotaneous requests (Deprecated), use Promise.all instead
function getData() {
  Promise.all([
    axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5'),
    axios.get('https://jsonplaceholder.typicode.com/posts?_limit=5'),
  ])
    .then((res) => {
      console.log(res[0], res[1])
      showOutput(res[1])
    })
    .catch((err) => console.log(err))
}

// custom header (add token in it for authentication)
function customHeaders() {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authentication: 'sometoken',
    },
  }
  axios
    .post(
      'https://jsonplaceholder.typicode.com/todos',
      {
        title: 'New Todo',
        completed: false,
      },
      config
    )
    .then((res) => showOutput(res))
    .catch((err) => console.log(err))
}

// transfroming request & response, rarely used
function transformResponse() {
  const options = {
    method: 'post',
    url: 'https://jsonplaceholder.typicode.com/todos',
    data: {
      title: 'Hello World',
    },
    transformResponse: axios.defaults.transformResponse.concat((data) => {
      data.title = data.title.toUpperCase()
      return data
    }),
  }
  axios(options).then((res) => showOutput(res))
}

// error handling
function errorHandling() {
  axios
    .get('https://jsonplaceholder.typicode.com/todoss', {
      params: { _limit: 5 },
    })
    .then((res) => showOutput(res))
    .catch((err) => {
      if (err.response) {
        // server responded with a status code other than 200 range
        console.log(err.response.data)
        console.log(err.response.status)
        console.log(err.response.headers)
      } else if (err.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(err.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message)
      }
      console.log(error.config)
    })
}

// cancel token (on the fly)
function cancelToken() {
  const source = axios.CancelToken.source()
  axios
    .get('https://jsonplaceholder.typicode.com/todos', {
      cancelToken: source.token,
    })
    .then((res) => showOutput(res))
    .catch((thrown) => {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled', thrown.message)
      }
    })

  if (true) {
    source.cancel('Request canceled!')
  }
}

// intercepting requests and responses (like middleware in express)
axios.interceptors.request.use(
  (config) => {
    // we have a logger for every request
    console.log(
      `${config.method.toUpperCase()} request send to ${
        config.url
      } at ${new Date().toTimeString()}`
    )
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// axios instance
const axiosInstance = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
})
axiosInstance.get('/comments').then((res) => showOutput(res))
// show output in browser
function showOutput(res) {
  document.getElementById('res').innerHTML = `
  <div class="card card-body mb-4">
   <h5>Status: ${res.status} </h5>
  </div>
  <div class="card mt-3">
    <div class="card-header">
      Headers
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.headers, null, 2)}</pre>
    </div>
  </div>
  <div class="card mt-3">
    <div class="card-header">
      Data
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.data, null, 2)}</pre>
    </div>
  </div>
  <div class="card mt-3">
    <div class="card-header">
      Config
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.config, null, 2)}</pre>
    </div>
  </div>
 `
}

document.getElementById('get').addEventListener('click', getTodos)
document.getElementById('post').addEventListener('click', addTodo)
document.getElementById('update').addEventListener('click', updateTodo)
document.getElementById('delete').addEventListener('click', deleteTodo)
document.getElementById('sim').addEventListener('click', getData)
document.getElementById('headers').addEventListener('click', customHeaders)
document
  .getElementById('transform')
  .addEventListener('click', transformResponse)
document.getElementById('error').addEventListener('click', errorHandling)
document.getElementById('cancel').addEventListener('click', cancelToken)
