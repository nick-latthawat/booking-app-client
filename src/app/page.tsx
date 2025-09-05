"use client";
import Image from "next/image";
import { JSX, useState, useEffect } from "react";
import { FaHotel, FaPlane, FaCar, FaMapMarkerAlt, FaCalendarAlt, FaUser } from "react-icons/fa";
import DateRangePicker from "./component/Datepicker";
import GuestPicker from "./component/GuestPicker";
import { apiFetch } from "./lib/api";

type TabKey = "hotel" | "flight" | "car";
export default function Home() {
  const [active, setActive] = useState<TabKey>("hotel");
  const [query, setQuery] = useState("");
  const [queryHid, setQueryHid] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const [url, setUrl] = useState("");

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

  useEffect(() => {
    apiFetch("/booking").then(setUrl);
  }, []);

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

  async function Search() {
    const res = await fetch(url + "/getHotelByLocationID", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        LocationID: queryHid,
        BookDateFrom: startDate.toISOString().split("T")[0],
        BookDateTo: endDate.toISOString().split("T")[0],
        RoomNumber: rooms,
        AdultNumber: adults,
        ChildrenNumber: children
      })
    });
    // const data = JSON.stringify({
    //   LocationID: queryHid,
    //   BookDateFrom: startDate.toISOString().split("T")[0],
    //   BookDateTo: endDate.toISOString().split("T")[0],
    //   RoomNumber: rooms,
    //   AdultNumber: adults,
    //   ChildrenNumber: children
    // });
    // console.log(data);
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
          {/* Tabs */}
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

          {/* Location */}
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

          {/* Dates */}
          <div className="mt-3 overflow-hidden bg-indigo-50/40 text-gray-700">
            <DateRangePicker onSend={(start: Date, end: Date) => {
              setStartDate(start);
              setEndDate(end);
            }} />
          </div>

          {/* Guests / Rooms */}
          <div className="mt-3 rounded-lg border border-indigo-200 bg-indigo-50/40 text-gray-700">
            <div className="flex items-center gap-3 lg:px-4 lg:py-3 px-2 py-2">
              <FaUser className="text-indigo-500" />
              <GuestPicker onSend={(rooms: number, adults: number, children: number) => {
                setRooms(rooms);
                setAdults(adults);
                setChildren(children);
              }} />
            </div>
          </div>

          {/* Button */}
          <div className="mt-6 flex justify-center">
            <button
              className="w-56 rounded-lg bg-indigo-600 px-6 py-3 text-white shadow-md transition hover:bg-indigo-700 active:scale-[0.99]"
              onClick={Search}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="relative order-1 md:order-2 w-full h-full md:h-auto">
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
