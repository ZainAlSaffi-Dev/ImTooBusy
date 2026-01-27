from gcal import get_service

def list_info():
    service = get_service()
    if not service: return

    print("\n--- 📅 YOUR CALENDARS ---")
    print("(Copy the ID of the UQ calendar)")
    page_token = None
    while True:
        calendar_list = service.calendarList().list(pageToken=page_token).execute()
        for calendar in calendar_list['items']:
            print(f"Name: {calendar['summary']}")
            print(f"ID:   {calendar['id']}\n")
        page_token = calendar_list.get('nextPageToken')
        if not page_token: break

    print("\n--- 🎨 COLOR IDs ---")
    print("(Use these IDs to filter by color)")
    colors = service.colors().get().execute()
    for id, data in colors['event'].items():
        print(f"ID: {id} | Color: {data['background']}")

if __name__ == "__main__":
    list_info()