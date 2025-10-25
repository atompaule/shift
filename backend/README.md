# Backend Setup

## Conda Environment Setup

```bash
# Create conda environment from environment.yml
conda env create -f environment.yml

# Activate environment
conda activate shift

# If you update the environment.yml, also update the .yml file:
conda env export --no-builds > environment.yml
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

## Start Server

```bash
fastapi dev main.py
```
