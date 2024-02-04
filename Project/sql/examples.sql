insert into users (username, email, "password", user_type) values 
	('k4os', 'javier@javier.ie', 'testing', 'admin'),
	('john', 'john@doctor.ie', 'doctorR0cks!', 'doctor'),
	('cora', 'cora@javier.ie', 'hello123!', 'user');

insert into appointments (user_id, doctor_id, appointment_date, payment_status, payment_amount) values
	(1, 3, '2024-02-14 12:00:00', 'pending', 60),
	(1, 3, '2024-02-16 14:00:00', 'pending', 120);

select appointment_date, payment_status, payment_amount, is_cancelled 
from appointments 
where user_id = (select id from users where email = 'javier@javier.ie');

