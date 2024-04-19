import psycopg2
from urllib.parse import urlparse
import random
import string
from dotenv import dotenv_values
from datetime import date, datetime
import bcrypt
import requests

FIRST_NAMES = requests.get("https://www.randomlists.com/data/names-first.json").json()["data"]
LAST_NAMES = requests.get("https://www.randomlists.com/data/names-surnames.json").json()["data"]

# Parse the URL
config = dotenv_values("../gp-system/.env")
url = urlparse(config["DATABASE_URL"])

# Connect to PostgreSQL database
conn = psycopg2.connect(
    host=url.hostname,
    port=url.port,
    user=url.username,
    password=url.password,
    database=url.path[1:]
)

def create_initial_users_for_testing():
    # Create doctor
    doctor_id = random_id()
    full_name = random.choice(FIRST_NAMES) + " " + random.choice(LAST_NAMES) 
    email = f"doctor@example.com"
    email_verified = datetime.fromtimestamp(random.randint(1000000, 1000000000)) 
    password = bcrypt.hashpw("password".encode(), bcrypt.gensalt()).decode()
    image = f"{full_name.lower().replace(' ', '_')}.jpg"
    title = "Dr"
    first_name, last_name = full_name.split()

    with conn.cursor() as cursor:
        cursor.execute("""
            INSERT INTO public."gp-system_user" (id, title, "firstName", "lastName", "fullName", email, "emailVerified", password, image, "userType", "clinicId")
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
        """, (doctor_id, title, first_name, last_name, full_name, email, email_verified, password, image, "doctor", 1))

    user_id = random_id()
    full_name = random.choice(FIRST_NAMES) + " " + random.choice(LAST_NAMES) 
    email = f"user@example.com"
    password = bcrypt.hashpw("password".encode(), bcrypt.gensalt()).decode()
    image = f"{full_name.lower().replace(' ', '_')}.jpg"
    email_verified = datetime.fromtimestamp(random.randint(1583064000, 1709838848)) 


    title = random.choice(["Mr", "Ms"])
    first_name, last_name = full_name.split()

    with conn.cursor() as cursor:
        cursor.execute("""
            INSERT INTO public."gp-system_user" (id, title, "firstName", "lastName", "fullName", email, "emailVerified", password, image, "userType")
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
        """, (user_id, title, first_name, last_name, full_name, email, email_verified, password, image, "user"))


def random_string(len: int):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(len))

def random_password(len: int):
    password = random_string(len)
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def random_id():
    return random_string(16)

def create_doctor(clinic_id):
    doctor_id = random_id()
    full_name = random.choice(FIRST_NAMES) + " " + random.choice(LAST_NAMES) 
    email = f"{full_name.replace(' ', '.').lower()}@example.com"
    email_verified = datetime.fromtimestamp(random.randint(1000000, 1000000000)) 
    password = random_password(16)
    image = f"{full_name.lower().replace(' ', '_')}.jpg"
    title = "Dr"
    first_name, last_name = full_name.split()

    with conn.cursor() as cursor:
        cursor.execute("""
            INSERT INTO public."gp-system_user" (id, title, "firstName", "lastName", "fullName", email, "emailVerified", password, image, "userType", "clinicId")
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
        """, (doctor_id, title, first_name, last_name, full_name, email, email_verified, password, image, "doctor", clinic_id))

    return doctor_id

# Function to create a user
def create_user():
    user_id = random_id()
    full_name = random.choice(FIRST_NAMES) + " " + random.choice(LAST_NAMES) 
    email = f"{full_name.replace(' ', '_').lower()}@example.com"
    password = random_password(16)
    image = f"{full_name.lower().replace(' ', '_')}.jpg"
    email_verified = datetime.fromtimestamp(random.randint(1583064000, 1709838848)) 


    title = random.choice(["Mr", "Ms"])
    first_name, last_name = full_name.split()

    with conn.cursor() as cursor:
        cursor.execute("""
            INSERT INTO public."gp-system_user" (id, title, "firstName", "lastName", "fullName", email, "emailVerified", password, image, "userType")
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
        """, (user_id, title, first_name, last_name, full_name, email, email_verified, password, image, "user"))

    return user_id

# Function to create an appointment
def create_appointments(doctor_ids, user_ids):
    appointment_date = datetime.fromtimestamp(random.randint(1709838848, 1900000000))
    doctor_id = random.choice(doctor_ids)
    user_id = random.choice(user_ids)
    created_by = random.choice([doctor_id, user_id])

    with conn.cursor() as cursor:
        cursor.execute("""
            INSERT INTO public."gp-system_appointment" ("details", "doctorId", "userId", "appointmentDate", "createdById", "paymentAmount")
            VALUES ('No details', %s, %s, %s, %s, 60);
        """, (doctor_id, user_id, appointment_date, created_by))

def create_clinics() -> int:
    CLINIC_QUERY = 'INSERT INTO public."gp-system_clinic" (address, name, latitude, longitude, "openingTime", "closingTime") VALUES(%s, %s, %s, %s, %s, %s)'

    clinic_address = lambda: str(random.randint(1,100)) + " Avenue St. " + random.choice(["a", "b", "c", "d"])
    names = ["Ballyrain", "Cork clinic", "Galway clinic", "Dublin clinic", "Sligo clinic"]
    lat  = [ 54.953977,  51.893651,  53.2724040,  53.3413612,  54.2712946 ] 
    long = [-7.7084102, -8.4699587, -9.06456773, -6.28390382, -8.48407431 ]
    
    assert len(lat) == len(long) == len(names)

    cursor = conn.cursor()
    for i in range(len(names)): 
        cursor.execute(CLINIC_QUERY, (clinic_address(), names[i], lat[i], long[i], datetime(1970, 1, 1, 8, 0, 0, 0), datetime(1970, 1, 1, 16, 0, 0, 0)))
    
    cursor.close()
    return len(names)


DOCTORS = 20
PATIENTS = 10
CLINICS = create_clinics()

create_initial_users_for_testing()
doctor_ids = [create_doctor(random.randint(1, CLINICS)) for _ in range(DOCTORS)]
user_ids = [create_user() for _ in range(PATIENTS)]

# [create_appointments(doctor_ids, user_ids) for _ in range(APPOINTMENTS)]

print("Random data successfully inserted into the database.")

conn.commit()
conn.close()
