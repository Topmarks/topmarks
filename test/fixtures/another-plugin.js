let anotherPlugin = (app, options, next) => {
  next()
}

anotherPlugin.attributes = {
  name: 'anotherPlugin',
  version: '1.0.0'
}

module.exports = anotherPlugin;
