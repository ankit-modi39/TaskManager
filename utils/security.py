import html

def sanitize_input(text):
    """Sanitize input to prevent XSS attacks"""
    if text is None:
        return None
    return html.escape(text)

def sanitize_form_data(form_data):
    """Sanitize all form data"""
    sanitized_data = {}
    for key, value in form_data.items():
        if isinstance(value, str):
            sanitized_data[key] = sanitize_input(value)
        else:
            sanitized_data[key] = value
    return sanitized_data
