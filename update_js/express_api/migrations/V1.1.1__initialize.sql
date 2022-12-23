drop table if exists "user" cascade;
drop table if exists service cascade;
drop table if exists ticket cascade;
drop table if exists service_to_ticket cascade;


create table "user"(
  id int generated always as identity primary key,
  full_name text,
  docs text,
  unique(full_name, docs)
);

create table service(
  id int generated always as identity primary key,
  name text,
  price numeric,
  unique(name, price)
);

create table ticket(
  id int generated always as identity primary key,
  user_id int references "user",
  price numeric,
  place int,
  unique(place)
);

create table service_to_ticket(
  service_id int references service,
  ticket_id int references ticket,
  user_id int references "user", 
  primary key (service_id, ticket_id, user_id)
);


insert into "user" (full_name, docs) values('Яковлева Софья Вячселавовна', '12345678'), 
('Якfmjjgjgjgjgвлева Софья Вячселавовна', '123456gjbvjrkgmg78');

insert into service (name, price) values ('Обед', 560);

insert into ticket (price, place) values(5600, 2);
