
const userInfo = Promise.resolve({
  siteName: 'Test site 101',
  siteShortName: 'Site 101',
  siteDescription: 'This is my site',
  author: process.env.USER_NAME || '',
  primaryThemeColour: '#ff9900',
  secondaryThemeColour: '#994400'
})

module.exports = userInfo.then(info => ({
  siteMetadata: {
    title: info.siteName,
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
    }
  ],
}))