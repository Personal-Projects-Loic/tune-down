def validate_password(v: str):
    if len(v) < 8:
        raise ValueError('Password must be at least 8 characters long')
    if not any(char.isdigit() for char in v):
        raise ValueError('Password must contain at least one digit')
    if not any(char.isupper() for char in v):
        raise ValueError('Password must contain at least one uppercase letter')
    if not any(char.islower() for char in v):
        raise ValueError('Password must contain at least one lowercase letter')
    return v

def validate_email(v: str):
    if '@' not in v or '.' not in v:
        raise ValueError('Invalid email address')
    return v

def validate_username(v: str):
    if len(v) < 3:
        raise ValueError('Username must be at least 3 characters long')
    return v