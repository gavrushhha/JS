drop table if exists car cascade;
drop table if exists client cascade;

create table car 
(
    id int generated always as identity primary key,
    brand text,
    color text
);

create table client 
(
    id int generated always as identity primary key,
    name text,
    number text,
);

insert into car (brand, model, color, number) values
    ('LADA', 'black'),
    ('Porsche', 'yellow'),
    ('Renault', 'blue'),
    ('BMW','grey'),
    ('Skoda', 'black');

insert into client (name, number, birthdate) values
    ('Ramadan Khalilov', '8(871)434-43-34'),
    ('Edgar Kochkonyan', '8(862)677-11-17'),
    ('Svetlana Smirnova', '8(863)253-57-23'),
    ('Andrey Gorokhov', '8(863)754-23-86'),
    ('Rasul Umarov', '8(872)544-44-68');

