CREATE TABLE IF NOT EXISTS urls
(
    id
    bigserial
    PRIMARY
    KEY,
    created_at
    timestamp
(
    0
) with time zone NOT NULL DEFAULT NOW(),
    url text NOT NULL,
    redirect text NOT NULL,
    version integer NOT NULL DEFAULT 1
    );