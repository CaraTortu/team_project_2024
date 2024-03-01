import psycopg2
from urllib.parse import urlparse
import random
import string
from dotenv import dotenv_values
from datetime import datetime
import bcrypt

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
    full_name = random.choice(["Dr John Doe", "Dr Jane Smith", "Dr Michael Johnson"])
    email = f"{full_name.replace(' ', '.').lower()}@example.com"
    email_verified = datetime.fromtimestamp(random.randint(1000000, 1000000000)) 
    password = random_password(16)
    image = f"{full_name.lower().replace(' ', '_')}.jpg"
    title = "Dr"
    _, first_name, last_name = full_name.split()

    with conn.cursor() as cursor:
        cursor.execute("""
            INSERT INTO public."gp-system_user" (id, title, "firstName", "lastName", "fullName", email, "emailVerified", password, image, "userType", "doctorId")
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
        """, (doctor_id, title, first_name, last_name, full_name, email, email_verified, password, image, "doctor", None))

    return doctor_id

# Function to create a user
def create_user(doctor_ids):
    user_id = random_id()
    full_name = random.choice(["Alice Smith", "Bob Jones", "Charlie Brown", "Diana Ross", "Eve Johnson"])
    email = f"{full_name.replace(' ', '_').lower()}@example.com"
    password = random_password(16)
    image = f"{full_name.lower().replace(' ', '_')}.jpg"
    email_verified = datetime.fromtimestamp(random.randint(1000000, 1000000000)) 

    doctor_id = random.choice(doctor_ids)

    title = random.choice(["Mr", "Ms"])
    first_name, last_name = full_name.split()

    with conn.cursor() as cursor:
        cursor.execute("""
            INSERT INTO public."gp-system_user" (id, title, "firstName", "lastName", "fullName", email, "emailVerified", password, image, "userType", "doctorId")
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
        """, (user_id, title, first_name, last_name, full_name, email, email_verified, password, image, "user", doctor_id))

    return user_id

with conn.cursor() as cursor:
    doctor_ids = [create_doctor() for _ in range(3)]  # Generating data for 3 doctors

    for _ in range(5):  # Generating data for 5 users
        create_user(doctor_ids)

    print("Random data successfully inserted into the database.")

conn.commit()
conn.close()
