CREATE TABLE blocks(
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    last_edited_time DATE
);

CREATE TABLE tags(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE tag_block_pairs(
    id SERIAL PRIMARY KEY,
    block_id INT NOT NULL,
    tag_id INT NOT NULL
);

CREATE TABLE tag_calss(
    id SERIAL PRIMARY KEY,
    parent_tag_id INT NOT NULL,
    child_tag_id INT NOT NULL
);

要給使用者填的是：
title, tags, description, date
● 在旁邊顯示已有的tag，使用考能直接選