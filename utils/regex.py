import re

def verify_name(username):
    try:
        nameRegex = re.match("^[A-za-z0-9\u4e00-\u9fa5]*$",username)
        return nameRegex
    except Exception as e:
        print(f"{e}:username不符合驗證格式")
        return None

def verify_email(email):
    try:
        emailRegex = re.match("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$",email)
        return emailRegex
    except Exception as e:
        print(f"{e}:email不符合驗證格式")
        return None

def verify_password(password):
    try:
        passwordRegex = re.match("^(?=.*\d)(?=.*[a-zA-Z]).{6,20}$",password)
        return passwordRegex
    except Exception as e:
        print(f"{e}:password不符合驗證格式")
        return None

def verify_phone(phone):
    try:
        phoneRegex = re.match("09\d{2}(\d{6}|-\d{3}-\d{3})",phone)
        return phoneRegex
    except Exception as e:
        print(f"{e}:phone不符合驗證格式")
        return None

def verify_date(date):
    try:
        dateRegex = re.match("20\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$",date)
        return dateRegex
    except Exception as e:
        print(f"{e}:date不符合驗證格式")
        return None

