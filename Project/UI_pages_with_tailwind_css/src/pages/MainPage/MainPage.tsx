"use client";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import TopBar  from '../../components/TopBar/TopBar';
import { Link } from "react-router-dom"; 
import { MdAccessibility, MdSchedule, MdSecurity } from "react-icons/md";
import { MdEventAvailable, MdHistory, MdPayment, MdDescription, MdLocalPharmacy, MdQuestionAnswer, MdAccountCircle } from "react-icons/md";
import { FaStethoscope, FaNotesMedical } from "react-icons/fa";

export default function MainPage() {
  const services = [
    {
      icon: <MdEventAvailable className="text-6xl mx-auto mb-4" />,
      title: "Appointment Scheduling",
      description:
        "Patients and front desk staff can effortlessly schedule, follow up, and manage doctor appointments.",
    },
    {
      icon: <MdHistory className="text-6xl mx-auto mb-4" />,
      title: "Medical History Access",
      description:
        "Access comprehensive past medical histories through our app or website, ensuring informed healthcare decisions.",
    },
    {
      icon: <MdPayment className="text-6xl mx-auto mb-4" />,
      title: "Payment and Billing",
      description:
        "Get transparent payment estimations, access billing details, and view complete payment statistics.",
    },
    {
      icon: <FaStethoscope className="text-6xl mx-auto mb-4" />,
      title: "Daily Schedule for Doctors",
      description:
        "Doctors can view and manage their daily schedules, ensuring an organized and efficient workflow.",
    },
    {
      icon: <MdLocalPharmacy className="text-6xl mx-auto mb-4" />,
      title: "Pharmacy Locator",
      description:
        "Patients can find the nearest pharmacies, ensuring they have quick access to their medications.",
    },
    {
      icon: <MdQuestionAnswer className="text-6xl mx-auto mb-4" />,
      title: "FAQ and Support",
      description:
        "Get answers to common questions regarding medical cards and other healthcare queries.",
    },
    {
      icon: <MdAccountCircle className="text-6xl mx-auto mb-4" />,
      title: "Easy Account Creation",
      description:
        "Outsiders can create an account using their PPS number and email, seamlessly joining the system.",
    },
    {
      icon: <MdDescription className="text-6xl mx-auto mb-4" />,
      title: "Prescription Details",
      description:
        "Instant access to prescription details and history, streamlining the medication management process for both patients and doctors.",
    },
    {
      icon: <FaNotesMedical className="text-6xl mx-auto mb-4" />,
      title: "Medical Notes Access",
      description:
        "Doctors can create, manage, and share medical notes, ensuring seamless communication and record-keeping.",
    },
    // Add more services as needed
  ];
  
  const testimonials = [
    {
      quote: "This appointment system has made scheduling visits with my GP so much easier!",
      author: "Jane Doe",
    },
    {
      quote: "I appreciate the reminders and easy rescheduling. The interface is very user-friendly.",
      author: "John Smith",
    },
    {
      quote: "A robust system that respects privacy and provides all the necessary functionalities.",
      author: "Alice Johnson",
    },
    // Add more testimonials as needed
  ];
  return (
    <div className="">
      <TopBar />

      <header className="text-center my-10">
        <h1 className="text-5xl font-bold mb-4">Welcome to the GP Appointment System</h1>
        <p className="text-xl font-light mb-4">Your health, our priority. Manage your medical appointments with ease and confidence.</p>
        <Link to="/register" className="inline-block bg-blue-500 text-white py-2 px-4 rounded-full text-lg font-medium hover:bg-blue-600 transition duration-300">
          Register now
        </Link>
      </header>

      <section className="my-20">
        <h2 className="text-3xl text-center font-bold mb-6">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-10 text-center">
          {/* Service Block 1 */}
          <div className="service-block">
            <span className="inline-block text-4xl mb-4">
              <MdAccessibility />
            </span>
            <h3 className="font-bold text-lg mb-2">Seamless Appointments</h3>
            <p>Book your appointments with ease and receive timely reminders to ensure you never miss a visit.</p>
          </div>
          {/* Service Block 2 */}
          <div className="service-block">
            <span className="inline-block text-4xl mb-4">
              <MdSchedule />
            </span>
            <h3 className="font-bold text-lg mb-2">Flexible Scheduling</h3>
            <p>View doctor availability in real-time and choose times that fit your busy schedule.</p>
          </div>
          {/* Service Block 3 */}
          <div className="service-block">
            <span className="inline-block text-4xl mb-4">
              <MdSecurity />
            </span>
            <h3 className="font-bold text-lg mb-2">Privacy & Security</h3>
            <p>Your health information is encrypted and securely stored, accessible only to your chosen GP.</p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Our Services</h2>
          <p className="mb-12">
            Explore the wide range of services offered by our GP Appointment System, designed to enhance your healthcare experience.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="service-card p-6 rounded-lg shadow-lg text-center">
              {service.icon}
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-100 py-10 my-20">
        <h2 className="text-3xl text-center font-bold mb-6">What Our Users Say</h2>
        <Carousel
          showArrows={true}
          autoPlay={true}
          infiniteLoop={true}
          showThumbs={false}
          showStatus={false}
          interval={5000}
        >
          {testimonials.map((testimonial, index) => (
            <div key={index} className="my-4 p-8">
              <blockquote className="italic text-center">&ldquo;{testimonial.quote}&rdquo;</blockquote>
              <p className="text-center mt-4 font-semibold">{testimonial.author}</p>
            </div>
          ))}
        </Carousel>
      </section>

      <footer className="text-center py-10">
        <h3 className="text-2xl font-semibold mb-2">Join Us Today</h3>
        <Link to="/register" className="inline-block bg-green-500 text-white py-2 px-4 rounded-full text-lg font-medium hover:bg-green-600 transition duration-300">
          Get Started
        </Link>
      </footer>
    </div>
  );
}
