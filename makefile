SHELL := /bin/bash

ROOT := $(abspath $(dir $(lastword $(MAKEFILE_LIST))))
FRONTEND_DIR := $(ROOT)/frontend
BACKEND_DIR := $(ROOT)/backend

FRONTEND_URL ?= https://shift-2143b.web.app

.PHONY: run-frontend-local run-backend-local deploy-frontend-prod deploy-backend-prod

run-frontend-local:
	cd $(FRONTEND_DIR) && pnpm dev

run-backend-local:
	cd $(BACKEND_DIR) && fastapi dev main.py

deploy-frontend-prod:
	cd $(FRONTEND_DIR) && firebase deploy --only hosting

deploy-backend-prod:
	cd $(BACKEND_DIR) && gcloud run deploy shift-backend --source . --region europe-west3 --set-env-vars FRONTEND_URL=$(FRONTEND_URL)

