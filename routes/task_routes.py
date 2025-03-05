from flask import request, jsonify, abort, render_template, flash, redirect, url_for
from flask_login import current_user, login_required
from models.task import Task
from database import db
from routes import task_routes
from utils.validators import validate_task_input
from datetime import datetime

@task_routes.route('/')
@login_required
def index():
    tasks = Task.query.filter_by(user_id=current_user.id).all()
    return render_template('index.html', tasks=tasks)

@task_routes.route('/add', methods=['POST'])
@login_required
def add_task():
    # Check if the request is JSON or form data
    if request.is_json:
        data = request.get_json()
    else:
        data = request.form
    
    # Use validator from utils if needed
    error = validate_task_input(data)
    if error:
        return jsonify({"error": error}), 400
    
    # Process due_date
    due_date_str = data.get('due_date')
    due_date = None  # Default to None
    
    # Only process if due_date is not empty
    if due_date_str and due_date_str.strip():
        try:
            # Convert string date to Python date object
            due_date = datetime.strptime(due_date_str, '%Y-%m-%d').date()
        except ValueError:
            if request.is_json:
                return jsonify({"error": "Invalid date format. Please use YYYY-MM-DD format."}), 400
            else:
                flash('Invalid date format. Please use YYYY-MM-DD format.', 'error')
                return redirect(url_for('tasks.index'))
    
    # Print for debugging
    print(f"due_date_str: '{due_date_str}', type: {type(due_date_str)}")
    print(f"due_date after processing: {due_date}, type: {type(due_date)}")
    
    task = Task(
        title=data['title'],
        description=data.get('description', ''),
        due_date=due_date,  # Now this is either None or a proper date object
        user_id=current_user.id,
        completed=False
    )
    
    db.session.add(task)
    db.session.commit()
    
    # Format the date for JSON response if it exists
    formatted_due_date = task.due_date.isoformat() if task.due_date else None
    
    if request.is_json:
        return jsonify({
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'due_date': formatted_due_date,
            'completed': task.completed
        })
    else:
        flash('Task added successfully!', 'success')
        return redirect(url_for('tasks.index'))


@task_routes.route('/delete/<int:task_id>', methods=['DELETE'])
@login_required
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    
    # Check if the task belongs to the current user
    if task.user_id != current_user.id:
        abort(403)
    
    db.session.delete(task)
    db.session.commit()
    return '', 204

@task_routes.route('/update_status/<int:task_id>', methods=['PUT'])
@login_required
def update_status(task_id):
    task = Task.query.get_or_404(task_id)
    
    # Check if the task belongs to the current user
    if task.user_id != current_user.id:
        abort(403)
    
    data = request.json
    if data is None or 'completed' not in data:
        return jsonify({"error": "Missing completed status"}), 400
    
    task.completed = bool(data['completed'])
    db.session.commit()
    return '', 204
