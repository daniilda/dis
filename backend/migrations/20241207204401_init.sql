-- +goose Up
-- +goose StatementBegin
create table chat
(
    id                         uuid      not null,
    session_id                 uuid      not null,
    name                       text      not null,
    created_at                 timestamp not null,
    last_update_at             timestamp not null,
    latest_message             text null,
    is_latest_message_from_bot bool null
);
create index on chat (id);
create index on chat (session_id);
create table document
(
    id          uuid      not null,
    name        text      not null,
    file_format int       not null,
    created_at  timestamp not null,
    state       int       not null
);
create index on document (id);
create index on document (state);
create table query_response
(
    chat_id         uuid      not null,
    session_id      uuid      not null,
    created_at      timestamp not null,
    query           text      not null,
    response_text   text      not null,
    document_id     uuid      not null,
    picture_file_id text null
);
create index on query_response (chat_id, session_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
drop table chat;
drop table document;
drop table query_response;
-- +goose StatementEnd
