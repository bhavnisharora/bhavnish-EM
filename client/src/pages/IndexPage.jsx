import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsArrowRightShort } from "react-icons/bs";
import { BiLike, BiTrash } from "react-icons/bi";

export default function IndexPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get("/createEvent")
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  // Check if event is liked using localStorage
  const isEventLiked = (eventId) => {
    const likedEvents = JSON.parse(localStorage.getItem("likedEvents")) || [];
    return likedEvents.includes(eventId);
  };

  const handleLike = (eventId) => {
    let likedEvents = JSON.parse(localStorage.getItem("likedEvents")) || [];
    let isLiked = likedEvents.includes(eventId); // Check if the event is already liked

    if (isLiked) {
      likedEvents = likedEvents.filter((id) => id !== eventId); // Remove like
    } else {
      likedEvents.push(eventId); // Add like
    }

    localStorage.setItem("likedEvents", JSON.stringify(likedEvents));

    setEvents(
      events.map((event) =>
        event._id === eventId
          ? {
              ...event,
              likes:
                !isLiked && event.likes >= 0
                  ? event.likes + 1
                  : event.likes > 0
                  ? event.likes - 1
                  : 0, // Ensure likes don't go below 0
            }
          : event
      )
    );
  };

  return (
    <>
      <div className="mt-1 flex flex-col">
        <div className="flex justify-between items-center h-screen bg-gradient-to-r from-blue-500 to-blue-800 p-10">
          {/* Left Side */}
          <div className="text-white w-1/2 space-y-6">
            <h1 className="text-4xl font-bold">
              ALL-IN-ONE EVENT MANAGEMENT SOFTWARE
            </h1>
            <p className="text-xl">
              Built for the events of today—and tomorrow
            </p>
            <p className="text-lg">
              Everything you need to craft impactful event experiences all while
              staying technologically relevant, now and always.
            </p>

            {/* buttons */}
            <div className="mt-8 space-x-4">
              <button className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full text-lg font-semibold shadow-lg transition-all duration-300 ease-in-out">
                Sign Up for Free
              </button>
              <button className="px-6 py-3 bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-700 rounded-full text-lg font-semibold shadow-lg transition-all duration-300 ease-in-out">
                Request Demo
              </button>
            </div>
          </div>

          {/* Right Side */}
          <div className="w-1/2">
            <video
              id="banner-intro"
              autoPlay
              muted
              loop
              playsInline
              width="861"
              height="771"
              poster="//www.zohowebstatic.com/sites/zweb/images/backstage/home/banner-intro.webp"
              className="rounded-lg shadow-lg"
            >
              <source
                src="//www.zohowebstatic.com/sites/zweb/images/backstage/home/banner-intro.mov"
                type="video/quicktime"
              />
              <source
                src="//www.zohowebstatic.com/sites/zweb/images/backstage/home/banner-intro.webm"
                type="video/webm"
              />
            </video>
          </div>
        </div>

        <div className="text-xl lg:text-2xl text-primary text-center underline p-4 lg:p-10">
          Current/Upcoming Events
        </div>

        <div className="mx-10 my-5 grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:mx-5 ">
          {events.length > 0 &&
            events.map((event) => {
              const eventDate = new Date(event.eventDate);
              const currentDate = new Date();

              if (
                eventDate > currentDate ||
                eventDate.toDateString() === currentDate.toDateString()
              ) {
                return (
                  <div
                    className="bg-white rounded-xl relative shadow-lg"
                    key={event._id}
                  >
                    <div className="rounded-tl-[0.75rem] rounded-tr-[0.75rem] rounded-br-[0] rounded-bl-[0] object-fill aspect-16:9">
                      <div className="absolute flex gap-4 bottom-[240px] right-8 md:bottom-[20px] md:right-3 lg:bottom-[250px] lg:right-4 sm:bottom-[260px] sm:right-3">
                        <button onClick={() => handleLike(event._id)}>
                          <BiLike
                            className={`w-auto h-12 lg:h-10 sm:h-12 md:h-10 bg-white p-2 rounded-full shadow-md transition-all ${
                              isEventLiked(event._id) ? "text-primary" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <img
                      src={`http://localhost:4000/${event.image}`}
                      className="rounded-tl-[0.75rem] rounded-tr-[0.75rem] rounded-br-[0] rounded-bl-[0] object-cover w-full h-[80px] lg:h-[150px]"
                      alt="Event Logo"
                    />

                    <div className="m-2 grid gap-2">
                      <div className="flex justify-between items-center">
                        <h1 className="font-bold text-lg mt-2">
                          {event.title.toUpperCase()}
                        </h1>
                        <div className="flex gap-2 items-center mr-4 text-red-600">
                          <BiLike /> {event.likes}
                        </div>
                      </div>

                      <div className="flex text-sm flex-nowrap justify-between text-primarydark font-bold mr-4">
                        <div>
                          {event.eventDate.split("T")[0]}, {event.eventTime}
                        </div>
                        <div>
                          {event.ticketPrice === 0
                            ? "Free"
                            : "Rs. " + event.ticketPrice}
                        </div>
                      </div>

                      <div className="text-xs flex flex-col flex-wrap truncate-text">
                        {event.description}
                      </div>
                      <div className="flex justify-between items-center my-2 mr-4">
                        <div className="text-sm text-black ">
                          Organized By: <br />
                          <span className="font-bold">{event.organizedBy}</span>
                        </div>
                        <div className="text-sm text-black ">
                          Created By: <br />
                          <span className="font-semibold">
                            {event.owner.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <Link
                        to={"/event/" + event._id}
                        className="flex justify-center"
                      >
                        <button className="primary flex items-center gap-2">
                          Book Ticket
                          <BsArrowRightShort className="w-6 h-6" />
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              }
              return null;
            })}
        </div>

        <div className="mx-10 my-5 grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:mx-5 ">
          {/*-------------------------- Checking whether there is a event or not-------------------  */}
          {events.length <= 0 && <div> No Current Events</div>}
        </div>
      </div>
    </>
  );
}
