SHELL := /bin/bash

ROOT := $(abspath $(dir $(lastword $(MAKEFILE_LIST))))
FRONTEND_DIR := $(ROOT)/frontend
BACKEND_DIR := $(ROOT)/backend

.PHONY: frontend backend deploy-frontend-prod deploy-backend-prod update-requirements

frontend:
	cd $(FRONTEND_DIR) && pnpm dev

backend:
	cd $(BACKEND_DIR) && fastapi dev main.py

deploy-frontend-prod:
	cd $(FRONTEND_DIR) && firebase deploy --only hosting

deploy-backend-prod:
	cd $(BACKEND_DIR) && gcloud run deploy shift-backend --source . --region europe-west3

update-requirements:
	cd $(BACKEND_DIR) && conda env export --no-builds > environment.yml && pip freeze > requirements.txt