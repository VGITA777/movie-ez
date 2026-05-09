# TODO

### General

- [X] Finish the Homepage.
- [X] Implement the Search Functionality.
- [X] Create a Navigation System.
- [ ] Dockerize the Application.

### Media Player
- [ ] Implement the Video Fetching Service.

### Security
- [X] Create a way for the User to Logout.

### Playlists
- [X] Implement User Playlist and Profile Services.
- [X] Create a Local User Playlist functionality (using local storage).
- [ ] Test if the User Playlist and Profile Services created by the AI are functioning properly.
- [ ] Implement User Profile Page (Playlists).
- [ ] Create a way to sync user's playlists with the backend

---

# Journal

I've only started to journal my progress today (May 7, 2026). From now on, I'll be keeping track of
my progress here.

### May 7, 2026

- Started to implement the authentication features.
- Updated the navigation bar to show a button to login if the user is not authenticated and an icon
  if they are.
- Updated the Episode Card in the watch page for large screens.

### May 8, 2026
- Implemented the logout functionality.
- Updated the logout method from the auth-facade to revoke tokens on logout.
- Moved media and user services to their own packages.
- Created services and models for retrieving user playlists (Using AI).
- Created a collapsible text component and updated the loading skeleton of the watch page

### May 9, 2026
- Created the local playlist service for users who aren't logged in.
- Created the show playlists directive.
- Implemented the Local Playlist functionality.
