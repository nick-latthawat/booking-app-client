"use client";
import Image from "next/image";
import { JSX, useState, useEffect, useCallback } from "react";
import { FaHotel, FaPlane, FaCar, FaMapMarkerAlt, FaUser, FaStar, FaEllipsisH, FaBath, FaWifi } from "react-icons/fa";
import DateRangePicker from "./component/Datepicker";
import GuestPicker from "./component/GuestPicker";
import { apiFetch } from "./lib/api";
import { useRouter } from "next/navigation";

type TabKey = "hotel" | "flight" | "car";
export default function Home() {
  const [active, setActive] = useState<TabKey>("hotel");
  const [query, setQuery] = useState("");
  const [queryHid, setQueryHid] = useState("");
  const [hotelID, setHotelID] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [name, setName] = useState("");
  const [locationName, setLocationName] = useState("");
  const [roomType, setRoomtype] = useState("");

  const router = useRouter();
  const tabs: { key: TabKey; label: string; icon: JSX.Element }[] = [
    { key: "hotel", label: "Hotel", icon: <FaHotel /> },
    { key: "flight", label: "Flight", icon: <FaPlane /> },
    { key: "car", label: "Car", icon: <FaCar /> },
  ];

  const location = [
    { id: "pai-mhs", label: "Pai, Mae Hong Son" },
    { id: "chiangkhan-loei", label: "Chiang Khan, Loei" },
    { id: "amphawa-ssk", label: "Amphawa, Samut Songkhram" },
    { id: "sattahip-chon", label: "Sattahip, Chonburi" },
    { id: "huahin-pkk", label: "Hua Hin, Prachuap Khiri Khan" },
    { id: "ao-luek-krabi", label: "Ao Luek, Krabi" },
    { id: "ko-lanta-krabi", label: "Ko Lanta, Krabi" },
    { id: "phanom-sni", label: "Phanom, Surat Thani" },
    { id: "ko-samui-sni", label: "Ko Samui, Surat Thani" },
    { id: "doi-saket-cnx", label: "Doi Saket, Chiang Mai" },
    { id: "mae-rim-cnx", label: "Mae Rim, Chiang Mai" },
    { id: "hang-dong-cnx", label: "Hang Dong, Chiang Mai" },
    { id: "chum-phae-kkn", label: "Chum Phae, Khon Kaen" },
    { id: "sai-yok-kan", label: "Sai Yok, Kanchanaburi" },
    { id: "khao-kho-pnb", label: "Khao Kho, Phetchabun" },
    { id: "mae-sot-tak", label: "Mae Sot, Tak" },
    { id: "sam-phran-npt", label: "Sam Phran, Nakhon Pathom" },
    { id: "bang-pain-ayt", label: "Bang Pa-In, Phra Nakhon Si Ayutthaya" },
    { id: "damnoen-rbr", label: "Damnoen Saduak, Ratchaburi" },
    { id: "mae-sai-cri", label: "Mae Sai, Chiang Rai" },
  ];

  const hotels = [{
    ID: "pai-mhs-H001",
    Name: "Pai Hotel 1",
    Price: 1107,
    LocationID: "pai-mhs",
    LocationName: "Pai, Mae Hong Son",
    ImagePath: "/img/hotels/pai-mhs/hotel-1.jpg",
    RoomType: "Standard"
  }];


  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const data = location.filter((d) =>
      d.label.toLowerCase().includes(query.toLowerCase())
    );
    setResults(data);

  }, [query]);

  async function handleSearch() {
    const params = new URLSearchParams({
      id: queryHid,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      rooms: rooms.toString(),
      adults: adults.toString(),
      children: children.toString(),
      Name: name,
      locationName: locationName,
      roomType: roomType
    });
    router.push(`/explore?${params.toString()}`);

  }

  async function handleBook(id: string, name: string, locationName: string, roomType: string) {
    const params = new URLSearchParams({
      paramID: queryHid,
      paramStartDate: startDate.toISOString().split("T")[0],
      paramEndDate: endDate.toISOString().split("T")[0],
      paramRooms: rooms.toString(),
      paramAdults: adults.toString(),
      paramChildren: children.toString(),
      paramName: name,
      paramLocationName: locationName,
      paramRoomType: roomType,
    });
    router.push(`/detail?${params.toString()}`);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      <div className="order-2 md:order-1 p-4 flex flex-col justify-start">
        <div className="w-full rounded-xl bg-indigo-50 px-4 py-2 text-gray-400">
          Search city, Country, Place for Travel advisory
        </div>
        <h1 className="lg:text-4xl text-xl font-bold p-4 text-blue-600">
          What Are You Looking For?
        </h1>
        <div className="w-full">
          <div className="mb-4 flex justify-center gap-4 w-full">
            {tabs.map((t) => {
              const isActive = active === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setActive(t.key)}
                  className="flex flex-col items-center gap-2"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full transition-all
                    ${isActive ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-gray-500 bg-white"}`}
                  >
                    <span className="text-lg">{t.icon}</span>
                  </div>
                  <span className={`text-sm ${isActive ? "text-indigo-700 font-medium" : "text-gray-500"}`}>
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="rounded-lg border border-indigo-300 text-gray-700">
            <div className="relative flex items-center gap-3 lg:px-4 lg:py-3 px-2 py-2">
              <FaMapMarkerAlt className="text-indigo-500" />
              <input
                type="text"
                className="w-full outline-none placeholder:text-gray-500"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <input
                type="text"
                hidden
                value={queryHid}
                onChange={(e) => setQueryHid(e.target.value)}
              />

              {results.length > 0 && (
                <ul className="absolute left-0 right-0 top-full z-10 max-h-60 overflow-auto rounded-lg border bg-white shadow-md">
                  {results.map((location) => (
                    <li
                      key={location.label}
                      onClick={() => {
                        setQuery(location.label);
                        setQueryHid(location.id);
                        setResults([]);
                      }}
                      className="cursor-pointer px-4 py-2 hover:bg-indigo-100"
                    >
                      {location.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="mt-3 overflow-hidden bg-indigo-50/40 text-gray-700">
            <DateRangePicker onSend={(start: Date, end: Date) => {
              setStartDate(start);
              setEndDate(end);
            }} />
          </div>

          <div className="mt-3 rounded-lg border border-indigo-200 bg-indigo-50/40 text-gray-700">
            <div className="flex items-center gap-3 lg:px-4 lg:py-3 px-2 py-2">
              <FaUser className="text-indigo-500" />
              <GuestPicker recRooms={rooms}
                recAdults={adults}
                recChildren={children}
                // onSend={handleGuestPicked} 
                onSend={(r, a, c) => {
                  setRooms(r);
                  setAdults(a);
                  setChildren(c);
                }}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              className="w-56 rounded-lg bg-indigo-600 px-6 py-3 text-white shadow-md transition hover:bg-indigo-700 active:scale-[0.99]"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
          <div className="mt-2">
            <section className="mt-4 ">
              <h2 className="mb-3 text-lg font-semibold text-gray-900">Recent Searches</h2>
              <div className="space-y-4">
                {hotels.map((h) => (
                  <article
                    key={h.ID}
                    className="group flex w-full overflow-hidden rounded-xl border bg-white shadow-sm hover:shadow-md mb-5"
                  >
                    <div className="relative w-32 h-auto shrink-0 sm:w-40 sm:h-28 md:w-48 md:h-32 lg:w-56 lg:h-auto">
                      <Image src={h.ImagePath} alt={h.Name} fill className="object-cover" />
                    </div>
                    <div className="flex min-w-0 flex-1 p-3 sm:p-4">
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-semibold text-gray-900">{h.Name}</h3>
                        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                          <div className="flex items-center text-indigo-500">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <FaStar
                                key={i}
                                className="fill-current"
                              />
                            ))}
                          </div>
                          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-rose-600 font-semibold">
                            {5}
                          </span>
                          <span className="whitespace-nowrap">1000 Reviews</span>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-gray-500">Amenities</p>
                          <div className="mt-1 flex items-center gap-2">
                            {[FaCar, FaBath, FaWifi].map((Icon, idx) => (
                              <span
                                key={idx}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-200"
                              >
                                <Icon className="text-gray-600" />
                              </span>
                            ))}
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-200">
                              <FaEllipsisH className="text-gray-600" />
                            </span>
                          </div>
                        </div>


                        <div className="mt-2">
                          <a className="text-indigo-600 hover:underline" href="#">
                            {h.Price.toLocaleString()}/night
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="flex min-w-0 flex-1 p-3 sm:p-4 ">
                      <div className="min-w-0 mt-auto">
                        <button
                          onClick={() => {
                            handleBook(h.ID, h.Name, h.LocationName, h.RoomType);
                          }}
                          className="mt-2 w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 sm:hidden"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        handleBook(h.ID, h.Name, h.LocationName, h.RoomType);
                      }}
                      className="hidden sm:flex w-12 items-center justify-center bg-indigo-600 text-white hover:bg-indigo-700"
                      aria-label={`Book ${h.Name}`}
                    >
                      <span className="[writing-mode:vertical-rl] rotate-180 font-medium tracking-wide">
                        Book Now
                      </span>
                    </button>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      <div className="relative order-1 md:order-2 w-auto h-80 md:h-auto">
        <Image
          src="/img/home-wat-arun.jpg"
          alt="wat arun"
          fill
          priority
          className="
            object-cover
            rounded-tl-none rounded-bl-2xl rounded-tr-none rounded-br-2xl
            lg:rounded-tr-none lg:rounded-br-none lg:rounded-tl-2xl lg:rounded-bl-2xl
          "
        />
      </div>
    </div>
  );
}
