# Note: This file is not needed if you're using the auth blueprints directly from auth/local_auth.py and auth/oauth.py
# If you want to separate the blueprint registration from implementation, you could use this file.

from flask import Blueprint
from auth.local_auth import auth
from auth.oauth import oauth

# This file can be used to register auth-related blueprints if needed
# However, in the current structure, we're registering these directly in app.py
