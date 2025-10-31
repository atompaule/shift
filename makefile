SHELL := /bin/bash

ROOT := $(abspath $(dir $(lastword $(MAKEFILE_LIST))))
FRONTEND_DIR := $(ROOT)/frontend
BACKEND_DIR := $(ROOT)/backend

FRONTEND_URL ?= https://shift-2143b.web.app

.PHONY: frontend-dev backend-dev deploy-frontend-prod deploy-backend-prod

frontend-dev:
	cd $(FRONTEND_DIR) && pnpm dev

backend-dev:
	cd $(BACKEND_DIR) && fastapi dev main.py

deploy-frontend-prod:
	cd $(FRONTEND_DIR) && firebase deploy --only hosting

deploy-backend-prod:
	cd $(BACKEND_DIR) && gcloud run deploy shift-backend --source . --region europe-west3 --set-env-vars FRONTEND_URL=$(FRONTEND_URL)

