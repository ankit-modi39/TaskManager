from database import db  # Import the db object from app.py

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    # description = db.Column(db.String(300), nullable=False)
    # due_date = db.Column(db.String(20), nullable=True)
    #completed = db.Column(db.Boolean, default=False)
    description = db.Column(db.Text)
    due_date = db.Column(db.String(10))  # Store as YYYY-MM-DD
    def __repr__(self):
        return f'<Task {self.title}>'
