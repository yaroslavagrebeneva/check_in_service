import enum


class ValidationTypeEnum(str, enum.Enum):
    QR = "QR"
    MANUAL = "MANUAL"


class ReasonNameEnum(str, enum.Enum):
    ILLNESS = "ILLNESS"
    GOOD_REASON = "GOOD_REASON"
    OTHER = "OTHER"


class StatusEnum(str, enum.Enum):
    CONFIRMED = "CONFIRMED"
    PENDING = "PENDING"
    REJECTED = "REJECTED"
