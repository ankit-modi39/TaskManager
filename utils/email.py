from flask import current_app, url_for
from extensions import mail, db
from flask_mail import Message
from datetime import datetime, timedelta
import secrets

def generate_verification_token():
    return secrets.token_urlsafe(32)

def send_verification_email(user):
    token = generate_verification_token()
    user.verification_token = token
    user.token_expiration = datetime.now() + timedelta(hours=24)
    db.session.commit()  # Save changes to the database
    
    msg = Message('Verify Your Email',
                  recipients=[user.email])
    
    verification_url = url_for('auth.verify_email',
                             token=token,
                             _external=True)
    
    msg.body = f'''Please click the following link to verify your email:
{verification_url}

This link will expire in 24 hours.

Regards, 
Task Manager Team
'''
    mail.send(msg)
