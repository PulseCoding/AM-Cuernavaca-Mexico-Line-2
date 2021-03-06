var Service = require('node-windows').Service


var svc = new Service({
  name:'PULSE line2 SERVICE',
  description: 'Control of the PULSE code',
  script: __dirname + '\\mex_cue_am_line2_wise.js',
  env: {
    name: "HOME",
    value: process.env["USERPROFILE"]
  }
})

svc.on('uninstall',function(){
  console.log('Uninstall complete.')
  console.log('The service exists: ',svc.exists)
})

svc.uninstall()
