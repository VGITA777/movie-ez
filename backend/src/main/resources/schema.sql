CREATE TABLE users
(
    id       UUID NOT NULL PRIMARY KEY,
    username VARCHAR(100) UNIQUE,
    email    VARCHAR(255) UNIQUE
);

CREATE TABLE playlists
(
    id                  UUID         NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID         NOT NULL REFERENCES users (id),
    last_edit_timestamp TIMESTAMPTZ  NOT NULL             DEFAULT NOW(),
    name                VARCHAR(100) NOT NULL,
    created_on          TIMESTAMPTZ  NOT NULL             DEFAULT NOW(),
    deleted_on          TIMESTAMPTZ
);

CREATE UNIQUE INDEX uq_user_playlist_name ON playlists (user_id, LOWER(name))
    WHERE playlists.deleted_on IS NULL;

CREATE TABLE playlist_content
(
    id          UUID        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    playlist_id UUID        NOT NULL REFERENCES playlists (id)
        ON DELETE CASCADE,
    track_id    TEXT        NOT NULL,
    added_on    TIMESTAMPTZ NOT NULL             DEFAULT NOW(),
    media_type  VARCHAR(20) NOT NULL             DEFAULT 'MOVIE'
        CHECK ( media_type IN ('MOVIE', 'TV', 'PERSON')),
    CONSTRAINT single_entry UNIQUE (playlist_id, track_id, media_type)
);

-- 1) Updates the playlist timestamp whenever the playlist row itself changes
CREATE OR REPLACE FUNCTION set_playlist_last_edit_timestamp()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
BEGIN
    NEW.last_edit_timestamp := NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_playlists_set_last_edit_timestamp ON playlists;

CREATE TRIGGER trg_playlists_set_last_edit_timestamp
    BEFORE UPDATE
    ON playlists
    FOR EACH ROW
EXECUTE FUNCTION set_playlist_last_edit_timestamp();

-- 2) Updates the parent playlist timestamp whenever playlist_content changes
CREATE OR REPLACE FUNCTION touch_playlist_on_content_change()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE playlists
        SET last_edit_timestamp = NOW()
        WHERE id = NEW.playlist_id;

        RETURN NEW;

    ELSIF TG_OP = 'DELETE' THEN
        UPDATE playlists
        SET last_edit_timestamp = NOW()
        WHERE id = OLD.playlist_id;

        RETURN OLD;

    ELSIF TG_OP = 'UPDATE' THEN
        -- If the content moved to another playlist, touch both old and new playlists
        IF NEW.playlist_id IS DISTINCT FROM OLD.playlist_id THEN
            UPDATE playlists
            SET last_edit_timestamp = NOW()
            WHERE id = OLD.playlist_id;

            UPDATE playlists
            SET last_edit_timestamp = NOW()
            WHERE id = NEW.playlist_id;
        ELSE
            UPDATE playlists
            SET last_edit_timestamp = NOW()
            WHERE id = NEW.playlist_id;
        END IF;

        RETURN NEW;
    END IF;

    RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_playlist_content_touch_playlist ON playlist_content;

CREATE TRIGGER trg_playlist_content_touch_playlist
    AFTER INSERT OR UPDATE OR DELETE
    ON playlist_content
    FOR EACH ROW
EXECUTE FUNCTION touch_playlist_on_content_change();