import httpx

async def fetch_short_schedule(token: str) -> dict:
    url = "https://backend.univibe.ru/api/group-schedules"
    headers = {"Authorization": f"Bearer {token}"}
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()

    teacher = data.get("teacher")
    teacher_name = None
    if teacher:
        parts = [teacher.get(k) for k in ("first_name", "last_name", "middle_name") if teacher.get(k)]
        teacher_name = " ".join(parts) if parts else None

    lessons = data.get("lessons") or []
    lesson_name = lessons[0].get("description") if lessons else None

    return {
        "startTime": data.get("startTime"),
        "endTime": data.get("endTime"),
        "scheduleDate": data.get("scheduleDate"),
        "teacherName": teacher_name,
        "lessonName": lesson_name,
    }