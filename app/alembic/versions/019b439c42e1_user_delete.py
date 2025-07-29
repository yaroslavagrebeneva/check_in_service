from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# Revision identifiers, used by Alembic.
revision: str = '019b439c42e1'
down_revision: Union[str, None] = 'c85e9550db1d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Step 1: Drop the foreign key constraints first
    op.drop_constraint('attendances_user_id_fkey', 'attendances', type_='foreignkey')
    op.drop_constraint('attendances_reason_id_fkey', 'attendances', type_='foreignkey')

    # Step 2: Drop the users table and its index (as in your original script)
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.execute("DROP TABLE users CASCADE")

    # Step 3: Change reasons.id to UUID first (before altering attendances.reason_id)
    op.alter_column(
        'reasons',
        'id',
        existing_type=sa.VARCHAR(),
        type_=sa.UUID(),
        existing_nullable=False,
        postgresql_using='id::uuid'
    )

    # Step 4: Change reasons.doc_url from VARCHAR to TEXT
    op.alter_column(
        'reasons',
        'doc_url',
        existing_type=sa.VARCHAR(),
        type_=sa.Text(),
        existing_nullable=True
    )

    # Step 5: Change attendances columns
    op.alter_column(
        'attendances',
        'id',
        existing_type=sa.VARCHAR(),
        type_=sa.UUID(),
        existing_nullable=False,
        postgresql_using='id::uuid'
    )

    op.alter_column(
        'attendances',
        'lessonid',
        existing_type=sa.VARCHAR(),
        type_=sa.Text(),
        existing_nullable=False
    )

    op.alter_column(
        'attendances',
        'user_id',
        existing_type=sa.VARCHAR(),
        type_=sa.UUID(),
        existing_nullable=True,
        postgresql_using='user_id::uuid'
    )

    op.alter_column(
        'attendances',
        'reason_id',
        existing_type=sa.VARCHAR(),
        type_=sa.UUID(),
        existing_nullable=False,
        postgresql_using='reason_id::uuid'
    )

    # Step 6: Create unique constraint on attendances.reason_id
    op.create_unique_constraint(None, 'attendances', ['reason_id'])

    # Step 7: Recreate the foreign key with CASCADE
    op.create_foreign_key(
        None,
        'attendances',
        'reasons',
        ['reason_id'],
        ['id'],
        ondelete='CASCADE'
    )


def downgrade() -> None:
    """Downgrade schema."""
    # Step 1: Drop the foreign key
    op.drop_constraint(None, 'attendances', type_='foreignkey')

    # Step 2: Drop the unique constraint
    op.drop_constraint(None, 'attendances', type_='unique')

    # Step 3: Revert attendances columns
    op.alter_column(
        'attendances',
        'reason_id',
        existing_type=sa.UUID(),
        type_=sa.VARCHAR(),
        nullable=True,
        postgresql_using='reason_id::text'
    )

    op.alter_column(
        'attendances',
        'user_id',
        existing_type=sa.UUID(),
        type_=sa.VARCHAR(),
        existing_nullable=True,
        postgresql_using='user_id::text'
    )

    op.alter_column(
        'attendances',
        'lessonid',
        existing_type=sa.Text(),
        type_=sa.VARCHAR(),
        existing_nullable=False
    )

    op.alter_column(
        'attendances',
        'id',
        existing_type=sa.UUID(),
        type_=sa.VARCHAR(),
        existing_nullable=False,
        postgresql_using='id::text'
    )

    # Step 4: Revert reasons columns
    op.alter_column(
        'reasons',
        'doc_url',
        existing_type=sa.Text(),
        type_=sa.VARCHAR(),
        existing_nullable=True
    )

    op.alter_column(
        'reasons',
        'id',
        existing_type=sa.UUID(),
        type_=sa.VARCHAR(),
        existing_nullable=False,
        postgresql_using='id::text'
    )

    # Step 5: Recreate the users table
    op.create_table(
        'users',
        sa.Column('id', sa.VARCHAR(), autoincrement=False, nullable=False),
        sa.Column('keyclockid', sa.VARCHAR(), autoincrement=False, nullable=False),
        sa.Column('created_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
        sa.Column('updated_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
        sa.PrimaryKeyConstraint('id', name=op.f('users_pkey'))
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=True)

    # Step 6: Recreate foreign keys
    op.create_foreign_key(
        'attendances_reason_id_fkey',
        'attendances',
        'reasons',
        ['reason_id'],
        ['id']
    )
    op.create_foreign_key(
        'attendances_user_id_fkey',
        'attendances',
        'users',
        ['user_id'],
        ['id']
    )