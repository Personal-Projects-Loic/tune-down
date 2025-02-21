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


def validate_wallet_id(v: str):
    if (len(v) < 25 or len(v) > 35):
        raise ValueError('Invalid wallet id')
    if not v.startswith('r'):
        raise ValueError('Invalid wallet id')
    if not v.isalnum():
        raise ValueError('Invalid wallet id')
    if '0' in v or 'O' in v or 'I' in v or 'l' in v:
        raise ValueError('Invalid wallet id')
    return v
