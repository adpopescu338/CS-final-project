pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS = credentials('docker_credentials')
        // Assuming these are the correct ways to extract user and password
        DOCKERHUB_CREDENTIALS_USR = "${DOCKERHUB_CREDENTIALS_USR}"
        DOCKERHUB_CREDENTIALS_PSW = "${DOCKERHUB_CREDENTIALS_PSW}"
        IMAGE = 'adpopescu3382/devops-playground:cs-express'
    }

    stages {
        stage('Build') {
            steps {
                echo "Building image $IMAGE"
                // pass base image as build arg to Dockerfile
                sh "docker build -t $IMAGE ."
            }
        }

        stage('Push to registry') {
            steps {
                echo 'Deploying....'
                // docker login
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                // push image to registry
                sh "docker push $IMAGE"
            }
        }


    }
    post { 
        always { 
            node("") {
                cleanWs()
                sh 'docker logout'
                sh "docker images"
                sh "docker rmi $IMAGE"
            }
        }
      
        failure {                
            echo 'Build failed'
        }

        success {
            echo 'Build succeeded'
        }
        
    }
}