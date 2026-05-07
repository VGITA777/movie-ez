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
- [ ] Implement User Profile Page (Playlists).
- [ ] Create an Unauthenticated User Playlist functionality (using local storage).
- [ ] Create a way to sync user's playlists with the backend.

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
