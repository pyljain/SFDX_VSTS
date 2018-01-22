# Visual Studio Team Services Task for Salesforce DX

This task allows you to easily setup a build for Salesforce DX. All you need to do is provide the username, password ( + token) & URL of the destination org optionally an ANT build file. This task offers the following features:

- It converts the source in DX format to the Metadata API format and deploys it into the destination org.
- In the process of doing so, it sets up the the following in the Hosted Linux instance
  1. Installs Salesforce DX
  2. Installs the ANT jar files
  3. Converts the DX format to MDAPI
  4. Deploys to a destination org

## Usage Instructions

- Navigate to Build & Release
- Choose the ANT Template
- Give your build task a Name
- Choose the 'Hosted Linux Preview' option when selecting an Agent Queue
- Let the default Ant build file be set to the default value as the DX task does not use this one
- Remove all existing tasks such as Ant Build, Copy Files and Publish Artifact from the Phase
- Click on 'Add a task to the phase', the '+' icon in the left pane and search for 'Salesforce DX'
- Once added,configure the parameter values with a Salesforce Username, password + token, URL and optionally an ANT target
- If an ANT target is not provided, the task is equipped to use a default build file
- However, if you do provide a build file then please make sure that the deployroot parameter for the target in the xml is set to output

