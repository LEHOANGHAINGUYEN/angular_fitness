pipeline {
    agent any

    // The options directive is for configuration that applies to the whole job.
    options {
        // For example, we'd like to make sure we only keep 10 builds at a time, so
        // we don't fill up our storage!
        buildDiscarder(logRotator(numToKeepStr:'10'))
        
        // And we'd really like to be sure that this build doesn't hang forever, so
        // let's time it out 3 hours.
        timeout(time: 3, unit: 'HOURS')
    }

    // environment { 
    // }

    stages {
        stage('Build') {            
            steps {
                // Notify started
                notifyBuild('STARTED')

                bitbucketStatusNotify(
                    buildState: 'INPROGRESS',
                    buildKey: 'build',
                    buildName: 'Build'
                )
                sh 'npm install'
            }

            post {
                success {
                    bitbucketStatusNotify(
                        buildState: 'SUCCESSFUL',
                        buildKey: 'build',
                        buildName: 'Build'
                    )
                }

                failure {
                    bitbucketStatusNotify(
                        buildState: 'FAILED',
                        buildKey: 'build',
                        buildName: 'Build'
                    )
                }
            }
        }

        stage('Analyze Code') {
            steps {
                bitbucketStatusNotify(
                    buildState: 'INPROGRESS',
                    buildKey: 'analyze',
                    buildName: 'Analyze Code'
                )
                sh 'npm run lint'
            }

            post {
                success {
                    bitbucketStatusNotify(
                        buildState: 'SUCCESSFUL',
                        buildKey: 'analyze',
                        buildName: 'Analyze Code',
                        buildDescription: 'Code changes look good'
                    )
                }

                failure {
                    bitbucketStatusNotify(
                        buildState: 'FAILED',
                        buildKey: 'analyze',
                        buildName: 'Analyze Code',
                        buildDescription: 'Code changes do not meet coding styles'
                    )
                }
            }
        }
        
        stage('Deploy') {
            steps {
                deploy()
            }
        }
    }

    post {
        success {
            notifyBuild('SUCCESSFUL')
        }

        failure {
            notifyBuild('FAILED')
        }
    }
}

def notifyBuild(String buildStatus = 'STARTED') {
    // Build status of null means successful
    buildStatus =  buildStatus ?: 'SUCCESSFUL'

    // Default values
    def colorName = 'RED'
    def colorCode = '#FF0000'

    // Override default values based on build status
    if (buildStatus == 'STARTED') {
        colorName = 'YELLOW'
        colorCode = '#FFFF00'
    } else if (buildStatus == 'SUCCESSFUL') {
        colorName = 'GREEN'
        colorCode = '#00FF00'
    } else {
        colorName = 'RED'
        colorCode = '#FF0000'
    }

    //Send notifications to Teams
    office365ConnectorSend (color: colorCode, message: buildStatus, webhookUrl: 'https://outlook.office.com/webhook/5dfedbc4-7149-4893-8db4-2c824619fee3@1fa062a7-00d3-4e8d-aa1c-f6cddff56a7c/JenkinsCI/1d6e3e4283324e5ea4dfb440e2def2c4/d1b90109-4908-419c-8403-1df1cd98adaf', status: buildStatus)
}

def deploy() {
    def runDeploy = true

    bitbucketStatusNotify(
        buildState: 'INPROGRESS',
        buildKey: 'deploy',
        buildName: 'Deploy',
        buildDescription: 'Code changes are being deploying'
    )

    try {
        if (env.BRANCH_NAME == 'master') {
            def body = "Jenkins is waiting for your approval before deploying to PROD environment. Please access this link to approve ${env.BUILD_URL} within 2 hours."

            emailext(
                subject: 'FCA APP PROD Deployment - Waiting for Approval',
                body: body,
                recipientProviders: [[$class: 'DevelopersRecipientProvider']]
            )
            
            try {
                timeout(time: 2, unit: 'HOURS') {
                    runDeploy = input(
                        message: 'Do you want to deploy to PROD environment?', ok: 'Yes',
                        parameters: [
                            booleanParam(
                                defaultValue: true, 
                                description: 'If you want to deploy to production environment, press Yes button',
                                name: 'Yes'
                            )
                        ]
                    )
                }
            } catch (err) {
                def user = err.getCauses()[0].getUser()

                // SYSTEM means timeout.
                if('SYSTEM' == user.toString()) {
                    runDeploy = false
                } else {
                    runDeploy = false
                    echo "Aborted by: [${user}]"
                }
            }

            if (runDeploy) {
                echo 'Deploying to production environment...'
                sh 'npm run deploy'
            }
        } else if (env.BRANCH_NAME == 'uat') {
            echo 'Deploying to uat environment...'
            sh 'npm run deploy:uat'
        } else if (env.BRANCH_NAME == 'sit') {
            echo 'Deploying to sit environment...'
            sh 'npm run deploy:sit'
        } else if (env.BRANCH_NAME == 'develop') {
            echo 'Deploying to dev environment...'
            sh 'npm run deploy:dev'
        } else {
            bitbucketStatusNotify(
                buildState: 'SUCCESSFUL',
                buildKey: 'deploy',
                buildName: 'Deploy',
                buildDescription: 'Deploy stage has been ignored for feature branches'
            )
            runDeploy = false;
            echo 'Ignore deploy for feature branches'
        }

        if (runDeploy) {
            bitbucketStatusNotify(
                buildState: 'SUCCESSFUL',
                buildKey: 'deploy',
                buildName: 'Deploy',
                buildDescription: 'Code changes have been deployed successfully'
            )
        }
    } catch (err) {
        bitbucketStatusNotify(
            buildState: 'FAILED',
            buildKey: 'deploy',
            buildName: 'Deploy',
            buildDescription: 'Code changes cannot be deployed'
        )
    }
}