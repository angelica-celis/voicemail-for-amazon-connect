/******************************************************************************
 *  Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved. 
 *  Licensed under the Apache License Version 2.0 (the 'License'). You may not
 *  use this file except in compliance with the License. A copy of the License
 *  is located at                                                            
 *                                                                              
 *      http://www.apache.org/licenses/                                        
 *  or in the 'license' file accompanying this file. This file is distributed on
 *  an 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, express or
 *  implied. See the License for the specific language governing permissions and
 *  limitations under the License.                                              
******************************************************************************/

/*
This script will process the serverless output and store the API_KEY, BASE_API url, and REGION to the portalProject
directory.
 */

let processStandardInput = require('./process-stdin');

const fs = require('fs');
const path = require('path');
const portalProjectName = 'aws-connect-vm-portal';
const portalProjectPath = path.join(__dirname, `/../../${portalProjectName}/env`);

// REACT_APP prefix is required in to make environment variables in a .env file be included in process.env
const envPrefix = 'REACT_APP';

/*
 Called to process serverless info --verbose output.
 */
processStandardInput((outputInfo) => {
    let {service, region, stage} = outputInfo;
    let serviceData = {
        [`${envPrefix}_BASE_API`]: outputInfo["ServiceEndpoint"],
        [`${envPrefix}_API_KEY`]: outputInfo[`${stage}-${service}-api-key`],
        [`${envPrefix}_REGION`]: region
    };
    let envOutput = "# Do not modify this file, this file is automatically generated by aws-connect-vm-api when deployed\n";
    for (let key in serviceData) {
        envOutput += `${key}=${serviceData[key]}\n`
    }

    let fileName = `${portalProjectPath}/.env.${stage}`;
    fs.writeFile(fileName, envOutput, (err) => {
        if (err) throw err;
        console.log("==== OUTPUT ENV INFO SUCCESSFULLY ====");
        console.log("Output information for Serverless stack has been written to:", fileName);
        console.log(serviceData)
    })
});