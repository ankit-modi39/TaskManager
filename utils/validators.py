def validate_task_input(data):
    if not data or not data.get('title'):
        return "Title is required"
    
    if len(data.get('title', '')) > 100:
        return "Title must be less than 100 characters"
    
    return None

def validate_password(password):
    if len(password) < 8:
        return False, "Password must be at least 8 characters long."
    if not any(char.isdigit() for char in password):
        return False, "Password must contain at least one digit."
    if not any(char.isalpha() for char in password):
        return False, "Password must contain at least one letter."
    return True, None
