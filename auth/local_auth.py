from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_user, logout_user, login_required, current_user
from models.user import User
from extensions import db, limiter
from werkzeug.security import generate_password_hash, check_password_hash
from utils.validators import validate_password
from models.task import Task
from utils.email import send_verification_email
from datetime import datetime


auth = Blueprint('auth', __name__)

@auth.route('/signup', methods=['GET', 'POST'])
@limiter.limit("10 per hour")
def signup():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        name = request.form.get('name')
        
        is_valid, error_message = validate_password(password)
        if not is_valid:
            flash(error_message)
            return redirect(url_for('auth.signup'))
    
        if User.query.filter_by(email=email).first():
            flash('Email already exists')
            return redirect(url_for('auth.signup'))
            
        new_user = User(
            email=email, 
            name=name, 
            oauth_provider='local',
            email_verified=False  #set to false by default
            )
        new_user.set_password(password)
        
        db.session.add(new_user)
        db.session.commit()

        #send verification email
        send_verification_email(new_user)
        flash('Please check your email to verify your account', 'info')

        return redirect(url_for('auth.login'))
    
    return render_template('auth/signup.html')

@auth.route('/login', methods=['GET', 'POST'])
@limiter.limit("5 per minute")
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        user = User.query.filter_by(email=email).first()
        if user and user.check_password(password):
            if not user.email_verified and user.oauth_provider== 'local':
                flash('Please verify your email before logging in', 'error')
                return redirect(url_for('auth.login'))
            login_user(user)
            return redirect(url_for('tasks.index'))
            
        flash('Please check your login details and try again.')
        
    return render_template('auth/login.html')

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))

@auth.route('/profile')
@login_required  # If you want to protect this route
def profile():
    # Your profile view logic here
    return render_template('auth/profile.html')

@auth.route('/update-password', methods=['POST'])
@login_required
def update_password():
    current_password = request.form.get('current_password')
    new_password = request.form.get('new_password')
    confirm_password = request.form.get('confirm_password')
    
    # Validate the input
    if not current_password or not new_password or not confirm_password:
        flash('All fields are required', 'error')
        return redirect(url_for('auth.profile'))
    
    if new_password != confirm_password:
        flash('New passwords do not match', 'error')
        return redirect(url_for('auth.profile'))
    
    # Verify current password
    user = User.query.get(current_user.id)
    if not check_password_hash(user.password_hash, current_password):
        flash('Current password is incorrect', 'error')
        return redirect(url_for('auth.profile'))
    
    # Update password
    user.password = generate_password_hash(new_password)
    db.session.commit()
    
    flash('Password updated successfully', 'success')
    return redirect(url_for('auth.profile'))

@auth.route('/delete-account', methods=['POST'])
@login_required
def delete_account():
    user = User.query.get(current_user.id)
    
    # Delete user's tasks
    Task.query.filter_by(user_id=user.id).delete()
    
    # Delete the user
    db.session.delete(user)
    db.session.commit()
    
    # Log the user out
    logout_user()
    
    flash('Your account has been deleted', 'info')
    return redirect(url_for('auth.login'))

@auth.route('/verify/<token>')
def verify_email(token):
    user = User.query.filter_by(verification_token=token).first()
    
    if not user:
        flash('Invalid verification link', 'error')
        return redirect(url_for('auth.login'))
        
    if user.token_expiration < datetime.now():
        flash('Verification link has expired. Please request a new one', 'error')
        return redirect(url_for('auth.login'))
    
    user.email_verified = True
    user.verification_token = None
    user.token_expiration = None  # Clear the expiration time
    db.session.commit()
    
    flash('Email verified successfully! You can now log in', 'success')
    return redirect(url_for('auth.login'))


@auth.route('/resend-verification')
def resend_verification():
    if current_user.is_authenticated:
        return redirect(url_for('tasks.index'))
        
    return render_template('auth/resend_verification.html')

@auth.route('/resend-verification', methods=['POST'])
@limiter.limit("3 per hour")
def resend_verification_post():
    email = request.form.get('email')
    user = User.query.filter_by(email=email).first()
    
    if not user:
        flash('Email not found', 'error')
        return redirect(url_for('auth.resend_verification'))
        
    if user.email_verified:
        flash('Email already verified', 'info')
        return redirect(url_for('auth.login'))
        
    send_verification_email(user)
    flash('Verification email sent. Please check your inbox', 'success')
    return redirect(url_for('auth.login'))
