from flask import Blueprint

# Initialize blueprints
task_routes = Blueprint('tasks', __name__)

# Import routes to register them with blueprints
from routes.task_routes import *
