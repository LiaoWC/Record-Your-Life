CREATE TABLE blocks(
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    last_edited_date DATE
);

CREATE TABLE tags(
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE tag_block_pairs(
    id BIGSERIAL PRIMARY KEY,
    block_id INT NOT NULL,
    tag_id INT NOT NULL
);

CREATE TABLE tag_classes(
    id BIGSERIAL PRIMARY KEY,
    parent_tag_id INT NOT NULL,
    child_tag_id INT NOT NULL
);

要給使用者填的是：
title, tags, description, date
● 在旁邊顯示已有的tag，使用考能直接選


找block的tags:
SELECT tags.name FROM tags,tag_block_pairs tbp WHERE tbp.block_id = %s and tags.id = tbp.tag_id;