const fetch = require('node-fetch')
const root = 'https://custom-site-manager-api.herokuapp.com/'

class ApiService {
  async request(url, method, body = null, authenticationRequired = true) {

    if(authenticationRequired && !this.token) throw new Error('user is not yet authenticated')

    const headers = {
      'Content-Type': 'application/json',
      ...(authenticationRequired && {'Authorization': 'Bearer ' + this.token})
    }
    
    const response = await fetch(root + url, {
      headers,
      method,
      body: !body || typeof body === 'string' ? body : JSON.stringify(body)
    })
    let json = null
    try {
      json = await response.json()
    } finally {
      return {
        ok: response.ok,
        status: response.status,
        body: json
      }
    }
  }

  get(url, authenticationRequired = true) {
    return this.request(url, 'GET', null, authenticationRequired) 
  }

  post(url, body = null, authenticationRequired = true) {
    return this.request(url, 'POST', body, authenticationRequired) 
  }
  
  put(url, body = null, authenticationRequired = true) {
    return this.request(url, 'put', body, authenticationRequired) 
  }
  
  delete(url, body = null, authenticationRequired = true) {
    return this.request(url, 'delete', body, authenticationRequired) 
  }
}

module.exports = new ApiService()
