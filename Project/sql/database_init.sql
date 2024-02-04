create type user_types as enum ('admin', 'staff', 'doctor', 'user');
create type payment_status as enum ('complete', 'failed', 'pending');

create table if not exists Users (
	id serial primary key not null,
	username varchar(255) unique not null,
	email varchar(255) unique not null,
	password text not null,
	user_type user_types default 'user',
	created_at Date default now()
);

create table if not exists Appointments (
	id serial primary key not null,
	user_id int,
	doctor_id int,
	appointment_date Date not null,
	creation_date Date default now(),
	payment_status payment_status not null,
	payment_amount int not null,
	is_cancelled bool default false,
	constraint fk_user foreign key(user_id) references Users(id) on delete set null,
	constraint fk_doctor foreign key(doctor_id) references Users(id) on delete set null
);

