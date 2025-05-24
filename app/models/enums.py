from enum import Enum

class ReasonNameEnum(str, Enum):
    ILLNESS = "ILLNESS"
    GOOD_REASON = "GOOD_REASON"
    OTHER = "OTHER"

class StatusEnum(str, Enum):
    CONFIRMED = "CONFIRMED"
    PENDING = "PENDING"
    REJECTED = "REJECTED"
