import firebase_admin
from firebase_admin import auth as firebase_auth
from firebase_admin import firestore

app = firebase_admin.initialize_app()
db = firestore.client()
auth = firebase_auth
