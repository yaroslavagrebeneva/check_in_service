import enum

class UserRole(str, enum.Enum):
    STUDENT = "student"
    TEACHER = "teacher"
    STAROSTA = "starosta"
    DEAN = "dean"
