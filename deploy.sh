#!/bin/bash
export PROJECT_ID="identify-444310"

# Function to convert env file to comma-separated env vars
env_vars_from_file() {
    local env_file="$1"
    local env_vars=""
    
    while IFS='=' read -r key value || [ -n "$key" ]; do
        # Skip empty lines and comments
        [[ -z "$key" || "$key" =~ ^# ]] && continue
        
        # Remove leading/trailing whitespace
        key=$(echo "$key" | xargs)
        value=$(echo "$value" | xargs)
        
        # Remove quotes if present
        value="${value%\"}"
        value="${value#\"}"
        
        # Add to env_vars string
        if [ -z "$env_vars" ]; then
            env_vars="$key=$value"
        else
            env_vars="$env_vars,$key=$value"
        fi
    done < "$env_file"
    
    echo "$env_vars"
}

echo "Building and pushing backend..."
cd identify_server
./mvnw clean package -DskipTests
docker build --platform linux/amd64 -t "gcr.io/$PROJECT_ID/backend:latest" .
docker push "gcr.io/$PROJECT_ID/backend:latest"
cd ..

echo "Building and pushing frontend..."
cd identify_client
docker build --platform linux/amd64 -t "gcr.io/$PROJECT_ID/frontend:latest" .
docker push "gcr.io/$PROJECT_ID/frontend:latest"
cd ..

ENV_VARS=$(env_vars_from_file .env)

echo "Deploying backend to Cloud Run..."
gcloud run deploy backend \
  --image "gcr.io/$PROJECT_ID/backend:latest" \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="SPRING_PROFILES_ACTIVE=prod,GOOGLE_CLOUD_PROJECT=$PROJECT_ID,$ENV_VARS" \
  --add-cloudsql-instances="$PROJECT_ID:us-central1:identify-db" \
  --min-instances=1 \
  --timeout=300 \
  --port=8080

BACKEND_URL=$(gcloud run services describe backend --platform managed --region us-central1 --format 'value(status.url)' || echo "")

echo "Deploying frontend to Cloud Run..."
gcloud run deploy frontend \
  --image "gcr.io/$PROJECT_ID/frontend:latest" \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port=8080 \
  --min-instances=1 \
  --timeout=300

echo "Deployment complete!"
echo "Backend URL: $BACKEND_URL"
echo "Frontend URL: $(gcloud run services describe frontend --platform managed --region us-central1 --format 'value(status.url)' || echo "")"