# from minio import Minio
# from minio.error import MinioException
# from fastapi import UploadFile

# client = Minio(
#     "localhost:9000",
#     access_key="minioadmin",
#     secret_key="minioadmin",
#     secure=False
# )

# def upload_file(bucket_name, object_name, file: UploadFile):
#     try:
#         client.put_object(bucket_name, object_name, file.file, length=-1, part_size=10*1024*1024)
#         return {"message": f"File {object_name} uploaded successfully"}
#     except MinioException as e:
#         return {"error": f"Error uploading file: {e}"}