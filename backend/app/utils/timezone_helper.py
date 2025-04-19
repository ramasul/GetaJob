from datetime import datetime, timezone, timedelta

# Define UTC+7 timezone offset (Jakarta time)
UTC_PLUS_7 = timezone(timedelta(hours=7))

def get_jakarta_time():
    """Return current time in UTC+7 (Jakarta) timezone"""
    return datetime.now(UTC_PLUS_7)

def convert_to_jakarta_time(dt):
    """Convert a datetime to UTC+7 (Jakarta) timezone"""
    if dt.tzinfo is None:
        dt = dt + timedelta(hours=7)
        return dt.replace(tzinfo=UTC_PLUS_7)
    return dt.astimezone(UTC_PLUS_7)

def is_jakarta_time(dt):
    """Check if a datetime is already in UTC+7 (Jakarta) timezone"""
    return dt.tzinfo is not None and dt.tzinfo == UTC_PLUS_7