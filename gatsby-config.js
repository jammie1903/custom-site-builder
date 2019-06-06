const {config} = require('dotenv')
config()

const ApiService = require('./src/buildUtils/ApiService')

async function getUserInfo() {
  if(process.env.USER_TOKEN) {
    ApiService.token = process.env.USER_TOKEN
  } else if(process.env.USER_EMAIL && process.env.USER_PASSWORD) {
    const loginRequest = await ApiService.post('user/login', {email: process.env.USER_EMAIL, password: process.env.USER_PASSWORD}, false)
    if(!loginRequest.ok) {
      throw new Error("Failed to login with provided email and password: " + loginRequest.body.message)
    }
    ApiService.token = loginRequest.body.data.token
  } else {
    throw new Error('Either USER_TOKEN or USER_EMAIL and USER_PASSWORD must be specified as enviromnment variables')
  }

  const userRequest = await ApiService.get('user')
  if(!userRequest.ok) {
    throw new Error("Failed to fetch user via token")
  }
  return userRequest.body.data
}

const getSiteInfo = getUserInfo().then(user => ({
  siteName: 'Test site 101',
  siteShortName: 'Site 101',
  siteDescription: 'This is my site',
  siteUrl: 'https://www.get-this-proper-later.com',
  author: user.firstName + ' ' + user.lastName,
  primaryThemeColour: '#ff9900',
  secondaryThemeColour: '#994400'
}))

module.exports = getSiteInfo.then(info => ({
  siteMetadata: {
    title: info.siteName,
    siteUrl: info.siteUrl,
    description: info.siteDescription,
    author: info.author,
    theme: {
      primary: info.primaryThemeColour,
      secondary: info.secondaryThemeColour
    }
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: info.siteName.replace(/\s+/, '-'), //TODO make this load from the users project name
        short_name: info.siteShortName, //TODO make this load from the users project name
        start_url: `/`,
        background_color: `#ffffff`, //TODO make this load from the users project settings
        theme_color: info.primaryThemeColour, //TODO make this load from the users project settings
        display: `browser`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site. TODO update
      },
    },
    'gatsby-plugin-sitemap'
  ],
}))