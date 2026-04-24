CREATE TABLE users
(
    id       UUID NOT NULL PRIMARY KEY,
    username VARCHAR(100) UNIQUE,
    email    VARCHAR(255) UNIQUE
);

CREATE TABLE playlists
(
    id      UUID         NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID         NOT NULL REFERENCES users (id),
    name    VARCHAR(100) NOT NULL
);

CREATE TABLE playlist_content
(
    id          UUID   NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    playlist_id UUID NOT NULL REFERENCES playlists (id),
    track_id    TEXT   NOT NULL,
    CONSTRAINT single_entry UNIQUE (playlist_id, track_id)
);