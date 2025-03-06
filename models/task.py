from extensions import db  # Changed from database import db
from datetime import datetime
from sqlalchemy.sql import func

class Task(db.Model):
    __tablename__ = 'tasks'  # Explicit table name for clarity

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)  # Task title
    description = db.Column(db.Text, nullable=True)  # Optional task description
    completed = db.Column(db.Boolean, default=False)  # Task completion status
    due_date = db.Column(db.Date,nullable=True)
    created_at = db.Column(db.DateTime, default=func.now())
    updated_at = db.Column(db.DateTime, default=func.now(), onupdate=func.now())
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # Foreign key to User

    def __repr__(self):
        return f"<Task {self.title}>"