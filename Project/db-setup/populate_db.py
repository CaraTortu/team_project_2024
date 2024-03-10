import psycopg2
from urllib.parse import urlparse
import random
import string
from dotenv import dotenv_values
from datetime import datetime
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

def random_string(len: int):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(len))


def random_password(len: int):
    password = random_string(len)
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def random_id():
    return random_string(16)

def create_doctor():
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
            INSERT INTO public."gp-system_user" (id, title, "firstName", "lastName", "fullName", email, "emailVerified", password, image, "userType", "doctorId")
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
        """, (doctor_id, title, first_name, last_name, full_name, email, email_verified, password, image, "doctor", None))

    return doctor_id

# Function to create a user
def create_user(doctor_ids):
    user_id = random_id()
    full_name = random.choice(FIRST_NAMES) + " " + random.choice(LAST_NAMES) 
    email = f"{full_name.replace(' ', '_').lower()}@example.com"
    password = random_password(16)
    image = f"{full_name.lower().replace(' ', '_')}.jpg"
    email_verified = datetime.fromtimestamp(random.randint(1583064000, 1709838848)) 

    doctor_id = random.choice(doctor_ids)

    title = random.choice(["Mr", "Ms"])
    first_name, last_name = full_name.split()

    with conn.cursor() as cursor:
        cursor.execute("""
            INSERT INTO public."gp-system_user" (id, title, "firstName", "lastName", "fullName", email, "emailVerified", password, image, "userType", "doctorId")
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
        """, (user_id, title, first_name, last_name, full_name, email, email_verified, password, image, "user", doctor_id))

    return user_id

# Function to create an appointment
def create_appointments(doctor_ids, user_ids):
    appointment_date = datetime.fromtimestamp(random.randint(1709838848, 1900000000))
    doctor_id = random.choice(doctor_ids)
    user_id = random.choice(user_ids)
    created_by = random.choice([doctor_id, user_id])

    with conn.cursor() as cursor:
        cursor.execute("""
            INSERT INTO public."gp-system_appointment" ("doctorId", "userId", "appointmentDate", "createdById")
            VALUES (%s, %s, %s, %s);
        """, (doctor_id, user_id, appointment_date, created_by))


DOCTORS = 10
PATIENTS = 250
APPOINTMENTS = 50
doctor_ids = [create_doctor() for _ in range(DOCTORS)]
user_ids = [create_user(doctor_ids) for _ in range(PATIENTS)]

for _ in range(APPOINTMENTS):
    create_appointments(doctor_ids, user_ids)

print("Random data successfully inserted into the database.")

conn.commit()
conn.close()
