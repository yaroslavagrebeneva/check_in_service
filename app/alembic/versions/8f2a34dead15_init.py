"""init

Revision ID: 8f2a34dead15
Revises: 
Create Date: 2025-06-16 01:16:35.968505

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from sqlalchemy.engine import reflection
from app.models import Base, User, Attendance, Reason

# revision identifiers, used by Alembic.
revision: str = '8f2a34dead15'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

from alembic import op
import sqlalchemy as sa

def upgrade() -> None:
    bind = op.get_bind()
    inspector = reflection.Inspector.from_engine(bind)

    tables = inspector.get_table_names()

    op.execute('SET session_replication_role = replica;')

    for table in tables:
        if table != 'alembic_version':
            op.execute(f'DROP TABLE IF EXISTS "{table}" CASCADE;')

    op.execute('SET session_replication_role = DEFAULT;')

    Base.metadata.create_all(bind=bind)


def downgrade() -> None:
    pass
