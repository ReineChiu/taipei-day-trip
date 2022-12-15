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