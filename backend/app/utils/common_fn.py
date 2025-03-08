from datetime import date, datetime

def convert_date_to_datetime(dt):
    if isinstance(dt, date) and not isinstance(dt, datetime):
        return datetime.combine(dt, datetime.min.time())
    return dt
