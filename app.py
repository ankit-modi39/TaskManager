# from flask import Flask, render_template, request, jsonify
# from flask_login import LoginManager, current_user, login_required
# from database import db
# import os
# from models.task import Task
# from models.user import User
# from auth.local_auth import auth as auth_blueprint
# from auth.oauth import oauth as oauth_blueprint
# from flask_wtf.csrf import CSRFProtect

# from flask_limiter import Limiter
# from flask_limiter.util import get_remote_address

# # Initialize Flask app
# app = Flask(__name__)

# # Initialize Limiter
# limiter = Limiter(
#     get_remote_address,  # Use client's IP address for rate limiting
#     app=app,
#     default_limits=["200 per day", "50 per hour"]  # Default limits for all routes
# )


# BASE_DIR = os.path.abspath(os.path.dirname(__file__))
# DATABASE_PATH = os.path.join(BASE_DIR, 'instance/task_manager.db')


# app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{DATABASE_PATH}"
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# app.config['SECRET_KEY'] = 'your-secret-key'
# app.config['GOOGLE_CLIENT_ID'] = 'your-google-client-id'
# app.config['GOOGLE_CLIENT_SECRET'] = 'your-google-client-secret'

# app.config['SESSION_COOKIE_SECURE'] = True  # Ensures cookies are sent over HTTPS only.
# app.config['SESSION_COOKIE_HTTPONLY'] = True  # Prevents JavaScript access to cookies.
# app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  # Protects against cross-site attacks.

# # Initialize the database with the app
# db.init_app(app)

# csrf = CSRFProtect(app)  # Initialize CSRF protection globally

# # Create the instance directory if it doesn't exist
# os.makedirs(os.path.dirname(DATABASE_PATH), exist_ok=True)

# # Initialize Flask-Login
# login_manager = LoginManager()
# login_manager.login_view = 'auth.login'
# login_manager.init_app(app)

# @login_manager.user_loader
# def load_user(user_id):
#     return User.query.get(int(user_id))

# # Register blueprints
# app.register_blueprint(auth_blueprint)
# app.register_blueprint(oauth_blueprint)

# @app.route('/')
# @login_required
# def index():
#     tasks = Task.query.filter_by(user_id=current_user.id).all()
#     return render_template('index.html', tasks=tasks)

# @app.route('/add', methods=['POST'])
# @login_required
# def add_task():
#     data = request.get_json()
#     title = data['title']
#     description = data['description']
#     due_date = data['due_date']
#     completed=False
#     task = Task(title=title, description=description, due_date=due_date)
#     db.session.add(task)
#     db.session.commit()
#     return jsonify({
#         'id': task.id,
#         'title': task.title,
#         'description': task.description,
#         'due_date': task.due_date
#     })

# @app.route('/delete/<int:task_id>', methods=['DELETE'])
# @login_required
# def delete_task(task_id):
#     task = Task.query.get(task_id)
#     if task:
#         db.session.delete(task)
#         db.session.commit()
#     return '', 204

# @app.route('/update_status/<int:task_id>', methods=['PUT'])
# @login_required
# def update_status(task_id):
#     data = request.json    
#     task = Task.query.get(task_id)
#     if task:
#         task.completed = data['completed']
#         db.session.commit()
#         return '',204
#     else:
#         return jsonify({"error": "Task not found"}), 404

# def init_db():
#     with app.app_context():
#         db.create_all()


from flask import Flask, render_template
from flask_login import LoginManager
from database import db
import os
from models.user import User
from auth.local_auth import auth as auth_blueprint
from auth.oauth import oauth as oauth_blueprint
from routes.task_routes import task_routes
from flask_wtf.csrf import CSRFProtect
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# Initialize Flask app
app = Flask(__name__)

# Initialize Limiter
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"]
)

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE_PATH = os.path.join(BASE_DIR, 'instance/task_manager.db')

app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{DATABASE_PATH}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key')
app.config['GOOGLE_CLIENT_ID'] = os.environ.get('GOOGLE_CLIENT_ID', '')
app.config['GOOGLE_CLIENT_SECRET'] = os.environ.get('GOOGLE_CLIENT_SECRET', '')

# Security settings
app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

# Initialize CSRF protection
csrf = CSRFProtect(app)

# Create the instance directory if it doesn't exist
os.makedirs(os.path.dirname(DATABASE_PATH), exist_ok=True)

# Initialize the database with the app
db.init_app(app)

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.login_view = 'auth.login'
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Register blueprints
app.register_blueprint(auth_blueprint)
app.register_blueprint(oauth_blueprint)
app.register_blueprint(task_routes)

# Error handlers
@app.errorhandler(404)
def not_found(e):
    return render_template('404.html'), 404

@app.errorhandler(403)
def forbidden(e):
    return render_template('403.html'), 403

@app.errorhandler(500)
def server_error(e):
    return render_template('500.html'), 500

def init_db():
    with app.app_context():
        db.create_all()


