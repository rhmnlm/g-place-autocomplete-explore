// Use DBML to define your database structure
// Docs: https://dbml.dbdiagram.io/docs

Table client {
  client_id uuid [primary key]
  created_at timestamp
}

Table visited_location {
  id uuid [primary key]
  place_desc varchar [not null]
  latitude varchar [not null]
  longitude varchar [not null]
  created_at timestamp
  client_id_fk uuid
}

Table faved_location {
  id uuid [primary key]
  place_desc varchar [not null]
  latitude varchar [not null]
  longitude varchar [not null]
  created_at timestamp
  client_id_fk uuid
}

Ref: client.client_id > visited_location.client_id_fk
Ref: client.client_id > faved_location.client_id_fk