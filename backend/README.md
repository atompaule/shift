# Backend Setup

## Conda Environment Setup

```bash
# Create conda environment from environment.yml
conda env create -f environment.yml

# Activate environment
conda activate shift

# If you update the environment.yml, also update the .yml file:
conda env export --no-builds > environment.yml

# Then, update the requirements.txt file:
pip freeze > requirements.txt
```

## Firebase Setup

```bash
# Initialize Firebase
firebase init
```

## GCloud Setup

```bash
# Login to GCloud
gcloud auth application-default login

# Set project, using the same FIREBASE_PROJECT_ID you put in .env
gcloud config set project <FIREBASE_PROJECT_ID>
```

## Start Local Server

```bash
fastapi dev main.py
```

## Deploy to Google Cloud Run

```bash
# Deploy to Google Cloud Run
gcloud run deploy shift-backend --source . --region europe-west3 --set-env-vars FRONTEND_URL=<Your frontend URL>
```
