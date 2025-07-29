"""user delete

Revision ID: 019b439c42e1
Revises: c85e9550db1d
Create Date: 2025-07-29 16:15:50.770134

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '019b439c42e1'
down_revision: Union[str, None] = 'c85e9550db1d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Удаляем индекс и таблицу users
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.execute("DROP TABLE users CASCADE")
    
    # Меняем тип id в attendances с VARCHAR на UUID с явным кастом через USING
    op.alter_column(
        'attendances',
        'id',
        existing_type=sa.VARCHAR(),
        type_=sa.UUID(),
        existing_nullable=False,
        postgresql_using='id::uuid'
    )
    
    # lessonid меняем с VARCHAR на TEXT (приведение не требуется)
    op.alter_column(
        'attendances',
        'lessonid',
        existing_type=sa.VARCHAR(),
        type_=sa.Text(),
        existing_nullable=False
    )
    
    # user_id с VARCHAR на UUID
    op.alter_column(
        'attendances',
        'user_id',
        existing_type=sa.VARCHAR(),
        type_=sa.UUID(),
        existing_nullable=True,
        postgresql_using='user_id::uuid'
    )
    
    # reason_id с VARCHAR на UUID
    op.alter_column(
        'attendances',
        'reason_id',
        existing_type=sa.VARCHAR(),
        type_=sa.UUID(),
        nullable=False,
        postgresql_using='reason_id::uuid'
    )
    
    op.create_unique_constraint(None, 'attendances', ['reason_id'])
    
    # Удаляем внешние ключи
    op.drop_constraint(op.f('attendances_user_id_fkey'), 'attendances', type_='foreignkey')
    op.drop_constraint(op.f('attendances_reason_id_fkey'), 'attendances', type_='foreignkey')
    
    # Создаем внешний ключ с ondelete cascade
    op.create_foreign_key(None, 'attendances', 'reasons', ['reason_id'], ['id'], ondelete='CASCADE')
    
    # reasons.id VARCHAR -> UUID с кастом приведением
    op.alter_column(
        'reasons',
        'id',
        existing_type=sa.VARCHAR(),
        type_=sa.UUID(),
        existing_nullable=False,
        postgresql_using='id::uuid'
    )
    
    # reasons.doc_url VARCHAR -> TEXT
    op.alter_column(
        'reasons',
        'doc_url',
        existing_type=sa.VARCHAR(),
        type_=sa.Text(),
        existing_nullable=True
    )


def downgrade() -> None:
    """Downgrade schema."""
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
    op.drop_constraint(None, 'attendances', type_='foreignkey')
    op.create_foreign_key(
        op.f('attendances_reason_id_fkey'),
        'attendances',
        'reasons',
        ['reason_id'],
        ['id']
    )
    op.create_foreign_key(
        op.f('attendances_user_id_fkey'),
        'attendances',
        'users',
        ['user_id'],
        ['id']
    )
    op.drop_constraint(None, 'attendances', type_='unique')
    
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
    
    op.create_table(
        'users',
        sa.Column('id', sa.VARCHAR(), autoincrement=False, nullable=False),
        sa.Column('keyclockid', sa.VARCHAR(), autoincrement=False, nullable=False),
        sa.Column('created_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
        sa.Column('updated_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
        sa.PrimaryKeyConstraint('id', name=op.f('users_pkey'))
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=True)
