"use client";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { TopBar } from "~/app/_components/ui/topbar";
import Link from "next/link";
import { MdAccessibility, MdSchedule, MdSecurity } from "react-icons/md";
import {
    MdEventAvailable,
    MdHistory,
    MdPayment,
    MdDescription,
    MdLocalPharmacy,
    MdQuestionAnswer,
    MdAccountCircle,
} from "react-icons/md";
import { FaStethoscope, FaNotesMedical } from "react-icons/fa";
import { Session } from "next-auth";

const MainPage: React.FC<{ session: Session | null }> = ({ session }) => {
    const services = [
        {
            icon: <MdEventAvailable className="mx-auto mb-4 text-6xl" />,
            title: "Appointment Scheduling",
            description:
                "Patients and front desk staff can effortlessly schedule, follow up, and manage doctor appointments.",
        },
        {
            icon: <MdHistory className="mx-auto mb-4 text-6xl" />,
            title: "Medical History Access",
            description:
                "Access comprehensive past medical histories through our app or website, ensuring informed healthcare decisions.",
        },
        {
            icon: <MdPayment className="mx-auto mb-4 text-6xl" />,
            title: "Payment and Billing",
            description:
                "Get transparent payment estimations, access billing details, and view complete payment statistics.",
        },
        {
            icon: <FaStethoscope className="mx-auto mb-4 text-6xl" />,
            title: "Daily Schedule for Doctors",
            description:
                "Doctors can view and manage their daily schedules, ensuring an organized and efficient workflow.",
        },
        {
            icon: <MdLocalPharmacy className="mx-auto mb-4 text-6xl" />,
            title: "Pharmacy Locator",
            description:
                "Patients can find the nearest pharmacies, ensuring they have quick access to their medications.",
        },
        {
            icon: <MdQuestionAnswer className="mx-auto mb-4 text-6xl" />,
            title: "FAQ and Support",
            description:
                "Get answers to common questions regarding medical cards and other healthcare queries.",
        },
        {
            icon: <MdAccountCircle className="mx-auto mb-4 text-6xl" />,
            title: "Easy Account Creation",
            description:
                "Outsiders can create an account using their PPS number and email, seamlessly joining the system.",
        },
        {
            icon: <MdDescription className="mx-auto mb-4 text-6xl" />,
            title: "Prescription Details",
            description:
                "Instant access to prescription details and history, streamlining the medication management process for both patients and doctors.",
        },
        {
            icon: <FaNotesMedical className="mx-auto mb-4 text-6xl" />,
            title: "Medical Notes Access",
            description:
                "Doctors can create, manage, and share medical notes, ensuring seamless communication and record-keeping.",
        },
    ];

   return (
        <div className="">
            <TopBar session={session} />

            <header className="h-screen flex items-center flex-col justify-center text-center bg-gradient-to-b from-blue-100 to-white">
                <h1 className="mb-4 text-5xl font-bold">
                    Welcome to the GP Appointment System
                </h1>
                <p className="mb-4 text-xl font-light">
                    Your health, our priority. Manage your medical appointments
                    with ease and confidence.
                </p>
                <Link
                    href="/register"
                    className="inline-block rounded-full bg-blue-500 px-4 py-2 text-lg font-medium text-white transition duration-300 hover:bg-blue-600"
                >
                    Register now
                </Link>
            </header>

            <section className="my-20">
                <h2 className="mb-6 text-center text-3xl font-bold">
                    Why Choose Us?
                </h2>
                <div className="grid gap-10 px-24 text-center md:grid-cols-3">
                    {/* Service Block 1 */}
                    <div className="service-block">
                        <span className="mb-4 inline-block text-4xl">
                            <MdAccessibility />
                        </span>
                        <h3 className="mb-2 text-lg font-bold">
                            Seamless Appointments
                        </h3>
                        <p>
                            Book your appointments with ease and receive timely
                            reminders to ensure you never miss a visit.
                        </p>
                    </div>
                    {/* Service Block 2 */}
                    <div className="service-block">
                        <span className="mb-4 inline-block text-4xl">
                            <MdSchedule />
                        </span>
                        <h3 className="mb-2 text-lg font-bold">
                            Flexible Scheduling
                        </h3>
                        <p>
                            View doctor availability in real-time and choose
                            times that fit your busy schedule.
                        </p>
                    </div>
                    {/* Service Block 3 */}
                    <div className="service-block">
                        <span className="mb-4 inline-block text-4xl">
                            <MdSecurity />
                        </span>
                        <h3 className="mb-2 text-lg font-bold">
                            Privacy & Security
                        </h3>
                        <p>
                            Your health information is encrypted and securely
                            stored, accessible only to your chosen GP.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-12">
                <div className="text-center">
                    <h2 className="mb-6 text-3xl font-bold">Our Services</h2>
                    <p className="mb-12">
                        Explore the wide range of services offered by our GP
                        Appointment System, designed to enhance your healthcare
                        experience.
                    </p>
                </div>

                <div className="grid gap-8 px-8 md:grid-cols-3">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="service-card rounded-lg p-6 text-center shadow-xl"
                        >
                            {service.icon}
                            <h3 className="mb-3 text-xl font-semibold">
                                {service.title}
                            </h3>
                            <p>{service.description}</p>
                        </div>
                    ))}
                </div>
            </section>
       </div>
    );
};

export { MainPage };
