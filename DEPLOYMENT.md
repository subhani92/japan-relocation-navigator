# Deployment Guide: Japan Relocation Navigator

This guide explains how to deploy the Japan Relocation Navigator application on **Google Cloud Run** using Google Cloud Build.

---

## 1. Environment Variables Configuration

The application requires the following environment variables to run:

| Variable | Description | Source |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Key for Google Gemini 3.5 Flash queries. | Google AI Studio or GCP Secret Manager |
| `GOOGLE_CLOUD_PROJECT` | GCP Project ID. | Automatically set by Cloud Run |
| `FIRESTORE_DATABASE` | Name of the Firestore database instance (e.g. `(default)`). | GCP Firestore setup |
| `BUCKET_NAME` | Name of the Google Cloud Storage bucket for file uploads. | GCP Cloud Storage |

---

## 2. Manual Deployment via `gcloud` CLI

If you want to build and deploy the container manually using the `gcloud` CLI, execute the following commands in your terminal:

```bash
# Set your active Google Cloud project
gcloud config set project YOUR_PROJECT_ID

# Enable required Google Cloud APIs
gcloud services enable run.googleapis.com \
                       cloudbuild.googleapis.com \
                       artifactregistry.googleapis.com \
                       secretmanager.googleapis.com

# Create an Artifact Registry Repository for Docker container storage
gcloud artifacts repositories create gcp-containers \
    --repository-format=docker \
    --location=us-central1 \
    --description="Docker repository for Japan Relocation Navigator"

# Build the container using Cloud Build and submit to Artifact Registry
gcloud builds submit --tag us-central1-docker.pkg.dev/YOUR_PROJECT_ID/gcp-containers/japan-relocation-navigator:latest .

# Deploy the container on managed Cloud Run
gcloud run deploy japan-relocation-navigator \
    --image us-central1-docker.pkg.dev/YOUR_PROJECT_ID/gcp-containers/japan-relocation-navigator:latest \
    --region us-central1 \
    --platform managed \
    --allow-unauthenticated \
    --set-env-vars="GEMINI_API_KEY=YOUR_GEMINI_API_KEY,FIRESTORE_DATABASE=(default),BUCKET_NAME=your-gcs-bucket-name"
```

---

## 3. Automated CI/CD via Cloud Build (`cloudbuild.yaml`)

To build and deploy automatically on git commits or manual triggers:

1. Connect your GitHub/GitLab repository to GCP Cloud Build.
2. In Secret Manager, create three secrets matching:
   - `GEMINI_API_KEY`
   - `FIRESTORE_DATABASE`
   - `BUCKET_NAME`
3. Grant the **Cloud Build Service Account** permission to read these secrets (`Secret Manager Secret Accessor` role).
4. Create a Cloud Build Trigger targeting your `cloudbuild.yaml` file.
