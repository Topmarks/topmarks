let simplePlugin = (app, options, next) => {
  next()
}

simplePlugin.attributes = {
  name: 'simplePlugin',
  version: '2.0.0'
}

module.exports = simplePlugin;
