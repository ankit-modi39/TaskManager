from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_user, logout_user, login_required, current_user
from models.user import User
from database import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from utils.validators import validate_password
from models.task import Task

auth = Blueprint('auth', __name__)

# Create a limiter instance that will be initialized later
limiter = Limiter(get_remote_address)

@auth.record_once
def on_load(state):
    # Initialize limiter with the Flask app
    limiter.init_app(state.app)


@auth.route('/signup', methods=['GET', 'POST'])
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
            
        new_user = User(email=email, name=name, oauth_provider='local')
        new_user.set_password(password)
        
        db.session.add(new_user)
        db.session.commit()
        
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

