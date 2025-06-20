from enum import Enum

class ValidationTypeEnum(str, Enum):
    MANUAL = "MANUAL"
    QR = "QR"

class ReasonNameEnum(str, Enum):
    ILLNESS = "ILLNESS"
    GOOD_REASON = "GOOD_REASON"
    OTHER = "OTHER"

class StatusEnum(str, Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    REJECTED = "REJECTED"