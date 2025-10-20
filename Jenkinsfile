pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "homeo-devops-project:latest"
        CONTAINER_NAME = "homeo-devops-container"
        LOG_FILE = "pipeline.log"
        GIT_CREDENTIALS = "github-ashish" // Jenkins credentials ID
        REPO_URL = "https://github.com/Ashish420-tech/homeo-devops-project.git"
    }

    stages {

        stage('Clone Repository') {
            steps {
                script {
                    echo "Cloning repository..."
                    git credentialsId: "${GIT_CREDENTIALS}", url: "${REPO_URL}", branch: 'main'
                }
            }
        }

        stage('Install Node.js Dependencies') {
            steps {
                script {
                    echo "Installing Node.js dependencies..."
                    try {
                        sh 'npm install'
                    } catch(Exception e) {
                        echo "Error installing npm dependencies: ${e}"
                        currentBuild.result = 'FAILURE'
                        error("Stopping pipeline due to npm install failure")
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image..."
                    try {
                        sh "docker build -t ${DOCKER_IMAGE} ."
                    } catch(Exception e) {
                        echo "Docker build failed: ${e}"
                        currentBuild.result = 'FAILURE'
                        error("Stopping pipeline due to Docker build failure")
                    }
                }
            }
        }

        stage('Run Docker Container') {
            steps {
                script {
                    echo "Running Docker container..."
                    try {
                        sh "docker rm -f ${CONTAINER_NAME} || true"
                        sh "docker run -d --name ${CONTAINER_NAME} -p 3000:3000 ${DOCKER_IMAGE}"
                    } catch(Exception e) {
                        echo "Docker run failed: ${e}"
                        currentBuild.result = 'FAILURE'
                        error("Stopping pipeline due to Docker run failure")
                    }
                }
            }
        }

        stage('Verify Application') {
            steps {
                script {
                    echo "Checking if application is running on port 3000..."
                    try {
                        sh "curl -f http://localhost:3000 || exit 1"
                    } catch(Exception e) {
                        echo "Application is not reachable: ${e}"
                        currentBuild.result = 'FAILURE'
                        error("Stopping pipeline due to app not running")
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                echo "Pipeline finished. Collecting logs..."
                sh "docker logs ${CONTAINER_NAME} > ${LOG_FILE} || true"
                archiveArtifacts artifacts: "${LOG_FILE}", allowEmptyArchive: true
            }
        }
        success {
            echo "Pipeline completed successfully!"
        }
        failure {
            echo "Pipeline failed. Check logs for details."
        }
    }
}
