from flask import Blueprint, redirect, url_for, current_app, request
from flask_login import login_user
from models.user import User
from database import db
from authlib.integrations.flask_client import OAuth

oauth = Blueprint('oauth', __name__)

oauth_client = OAuth()

@oauth.record_once
def on_load(state):
    app = state.app
    oauth_client.init_app(app)
    
    # Configure Google OAuth
    oauth_client.register(
        name='google',
        client_id=app.config['GOOGLE_CLIENT_ID'],
        client_secret=app.config['GOOGLE_CLIENT_SECRET'],
        access_token_url='https://accounts.google.com/o/oauth2/token',
        access_token_params=None,
        authorize_url='https://accounts.google.com/o/oauth2/auth',
        authorize_params=None,
        jwks_uri='https://www.googleapis.com/oauth2/v3/certs',
        api_base_url='https://www.googleapis.com/oauth2/v1/',
        client_kwargs={'scope': 'openid email profile'},
    )

@oauth.route('/login/google')
def google_login():
    redirect_uri = url_for('oauth.google_authorize', _external=True)
    return oauth_client.google.authorize_redirect(
        redirect_uri,
        prompt='select_account'
        )

@oauth.route('/login/google/authorize')
def google_authorize():
    token = oauth_client.google.authorize_access_token()
    resp = oauth_client.google.get('userinfo')
    user_info = resp.json()
    
    # Check if user exists
    user = User.query.filter_by(email=user_info['email']).first()
    
    if not user:
        # Create new user
        user = User(
            email=user_info['email'],
            name=user_info.get('name', user_info['email']),
            oauth_provider='google',
            oauth_id=user_info['id']
        )
        db.session.add(user)
        db.session.commit()
    
    login_user(user)
    return redirect(url_for('tasks.index'))
