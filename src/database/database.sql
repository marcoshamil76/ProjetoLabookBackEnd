-- Active: 1675536391501@@127.0.0.1@3306
CREATE TABLE users (
id TEXT PRIMARY KEY UNIQUE NOT NULL,
name TEXT NOT NULL,
email TEXT NOT NULL,
password TEXT NOT NULL,
role TEXT,
created_at TEXT DEFAULT (DATETIME())NOT NULL
);

CREATE TABLE posts( 
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT (0) NOT NULL,
    dislikes INTEGER DEFAULT (0) NOT NULL,
    created_at TEXT DEFAULT (DATETIME()),
    updated_at TEXT DEFAULT (DATETIME()),
    FOREIGN KEY (creator_id) REFERENCES users (id)
);

CREATE TABLE likes_dislikes(
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (id)
                ON DELETE CASCADE
                ON UPDATE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts (id)
                ON DELETE CASCADE
                ON UPDATE CASCADE
);

SELECT * FROM users;

SELECT * FROM posts;

SELECT * FROM likes_dislikes;

DROP TABLE users;
DROP TABLE posts;
DROP TABLE likes_dislikes;

INSERT INTO users (id,name,email,password,role)
VALUES
        (1,"Socram","mhs@mhs.com", "mhs123","ADMIN"),
        (2,"Adile","adile@mhs.com", "adile123","USER"),
        (3,"Airam","airam@mhs.com", "airam123","USER"),
        (4,"Leugim","leugim@mhs.com", "leugim123","USER"),
        (5,"Otneb","otneb@mhs.com", "otineb123","USER")
        ;
INSERT INTO posts(id, creator_id,content)
VALUES 
        ("p001",1,"A Ele a glória"),
        ("p002",1,"A Ele o louvor"),
        ("p003",2,"A Ele o domínio"),
        ("p004",4,"Ele é o senhor");

INSERT INTO likes_dislikes(user_id,post_id,like)
VALUES
        (4,"p002",1),
        (4,"p001",0),
        (1,"p003",1),
        (2,"p004",1);