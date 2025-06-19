# from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
# from sqlalchemy.orm import sessionmaker

# external_engine = create_async_engine("postgresql+asyncpg://user:pass@external_host:5432/external_db", echo=True)
# ExternalSessionLocal = sessionmaker(bind=external_engine, class_=AsyncSession, expire_on_commit=False)

# async def get_external_db():
#     async with ExternalSessionLocal() as db:
#         try:
#             yield db
#         finally:
#             await db.close()