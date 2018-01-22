var path = require('path');
var tl = require('vso-task-lib')
const fs = require('fs')
//const exec = require('child_process').exec
const { spawn } = require('child_process')

// Creates a shell file based on provided inputs
const getShellFile = (username, password, target, url, buildXMLExists) => `
#!/bin/bash

# Install SFDX
wget –-quiet --output-file download.log https://developer.salesforce.com/media/salesforce-cli/sfdx-v5.99.1-d7efd75-linux-amd64.tar.xz
tar -xvJf sfdx-v5.99.1-d7efd75-linux-amd64.tar.xz
rm -r sfdx-v5.99.1-d7efd75-linux-amd64.tar.xz
cd sfdx
./install
cd ..

# Get Salesforce ANT Jar
wget –-quiet --output-file download.log https://gs0.salesforce.com/dwnld/SfdcAnt/salesforce_ant_41.0.zip
unzip -o salesforce_ant_41.0.zip ant-salesforce.jar

# Convert Source
sfdx force:source:convert --loglevel fatal -d output

# Create a build properties
cat > build.properties <<- EOM
sf.username=${username}
sf.password=${password}
sf.serverurl=${url}
sf.maxPoll=20
EOM

# Download Build XML if it doesnt exist
${buildXMLExists ? '' : 'wget –-quiet --output-file download.log https://s3.us-east-2.amazonaws.com/vsts-task-assets/build.xml'}
ant ${target}
`

const main = () => {

  // Get Task inputs
  const username = tl.getInput('username', true)
  const password = tl.getInput('password', true)
  let target = tl.getInput('anttarget', false)
  const url = tl.getInput('url', false)

  const buildXMLExists = fs.existsSync('build.xml')

  // Default target to deploy if no target specified
  if(!target) {
    target = 'deploy'
  }
  console.log('buildXMLExists', buildXMLExists)
  // Write the shell script
  fs.writeFileSync('./build.sh', getShellFile(username, password, target, url, buildXMLExists))

  // Execute the shell script
  const runShell = spawn('sh', ['build.sh'])
  var errs = ""

  runShell.stdout.on('data', (data) => {
    console.log(data.toString())
  })

  runShell.stderr.on('data', (err) => {
    console.error(err.toString())
    errs += err.toString() + '\n'
  })

  runShell.on('close', (code) => {
    console.log(`Completed Build with code ${code}`)
    if (code != 0) {
      tl.setResult(tl.TaskResult.Failed, errs)
    }
  })
}

main()
