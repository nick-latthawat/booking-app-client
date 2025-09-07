"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { FaChevronLeft, FaCar, FaBath, FaUtensils, FaWifi, FaDumbbell, FaStar } from "react-icons/fa";
import { useCallback, useState, useEffect, useRef } from "react";
import { apiFetch } from "../../app/lib/api";
import DateRangePicker from "../component/Datepicker";
import GuestPicker from "../component/GuestPicker";

import Image from "next/image";
export default function DetailPage() {
    const searchParams = useSearchParams();
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [rooms, setRooms] = useState(1);
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [hotels, setHotels] = useState<any[]>([]);
    const [destination, setDestination] = useState("");
    const [name, setName] = useState("");
    const [locationName, setLocationName] = useState("");
    const [roomType, setRoomtype] = useState("");

    const [queryHid, setQueryHid] = useState("");
    const score = 8.4;

    const router = useRouter();

    const handleSearch = () => {
        alert(`Search → ${destination} | ${startDate} → ${endDate} | ${adults} adults, ${children} children, ${rooms} room(s)`);
    };

    const handleBook = (id: string) => {
        (async () => {
            const base = await apiFetch("/booking");
            const res = await fetch(`${base}/getHotelByID`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ID: id }),
            });

            const data = await res.json();
            setHotels(data);

        })();

        let params;
        if (hotels.length > 0) {
            params = new URLSearchParams({
                ID: queryHid,
                Name: hotels[0].Name,
                LocationName: hotels[0].LocationName,
                RoomType: hotels[0].RoomType,
                Rooms: rooms.toString(),
                Adults: adults.toString(),
                Children: children.toString(),
                StartDate: startDate.toISOString().split("T")[0],
                EndDate: endDate.toISOString().split("T")[0],
                Price: hotels[0].Price.toString(),
            });

        }

        if (params) {
            router.push(`/review?${params.toString()}`);
        }
    };

    const didInitFromURL = useRef(false);
    useEffect(() => {
        if (didInitFromURL.current) return; // ทำครั้งเดียวตอน mount
        didInitFromURL.current = true;

        const paramID = searchParams.get("paramID");
        const paramStartDate = searchParams.get("paramStartDate");
        const paramEndDate = searchParams.get("paramEndDate");
        const paramRooms = searchParams.get("paramRooms");
        const paramAdults = searchParams.get("paramAdults");
        const paramChildren = searchParams.get("paramChildren");
        const paramName = searchParams.get("paramName");
        const paramLocationName = searchParams.get("paramLocationName");
        const paramRoomType = searchParams.get("paramRoomType");

        if (paramStartDate) setStartDate(new Date(paramStartDate));
        if (paramEndDate) setEndDate(new Date(paramEndDate));
        if (paramAdults) setAdults(parseInt(paramAdults));
        if (paramRooms) setRooms(parseInt(paramRooms));
        if (paramChildren) setChildren(parseInt(paramChildren));
        if (paramLocationName) setLocationName(paramLocationName);
        if (paramName) setName(paramName);
        if (paramRoomType) setRoomtype(paramRoomType);
        if (paramID) setQueryHid(paramID);
    }, [searchParams]);

    const handleGuestPicked = useCallback(
        (rooms: number, adults: number, children: number) => {
            setRooms(rooms);
            setAdults(adults);
            setChildren(children);
        },
        []
    );

    return (
        <div className="p-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 order-2 md:order-1 lg:p-4 p-0 mb-2">
                <div className="flex items-center justify-between gap-3 w-full lg:w-auto">
                    <button
                        onClick={() => router.back()}
                        className="cursor-pointer flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 shadow hover:bg-indigo-100 transition"
                    >
                        <FaChevronLeft className="text-gray-700" />
                    </button>
                    <h1 className="lg:hidden text-lg font-semibold absolute left-1/2 -translate-x-1/2">Hotel details</h1>
                </div>
                <div className="w-full rounded-xl bg-indigo-50 lg:px-4 lg:py-2 px-2 py-2 text-gray-400">
                    Search city, Country, Place for Travel advisory
                </div>
            </div>

            <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1.2fr_160px] items-center bg-indigo-50/50 rounded-2xl p-3">
                <input
                    className="h-11 rounded-xl border border-gray-300 bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Where are you going?"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                />

                <input
                    type="date"
                    className="h-11 rounded-xl border border-gray-300 bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={startDate.toISOString().split("T")[0] ?? ""}
                    onChange={(e) => setStartDate(new Date(e.target.value))}
                />
                <input
                    type="date"
                    className="h-11 rounded-xl border border-gray-300 bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={endDate.toISOString().split("T")[0] ?? ""}
                    onChange={(e) => setEndDate(new Date(e.target.value))}
                />
                <div className="flex h-11 items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 text-sm">
                    <GuestPicker
                        recRooms={rooms}
                        recAdults={adults}
                        recChildren={children}
                        onSend={handleGuestPicked} />
                </div>
                <button onClick={handleSearch} className="h-11 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700">Search</button>
            </section>

            <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="lg:col-span-8">
                    <div className="grid grid-cols-12 gap-3">
                        <div className="relative col-span-12 md:col-span-7 aspect-[4/3] rounded-xl overflow-hidden">
                            <Image src="/img/hotels/pai-mhs/hotel-1.jpg" alt="Main" fill className="object-cover" />
                        </div>
                        <div className="relative col-span-6 md:col-span-5 aspect-[4/3] rounded-xl overflow-hidden">
                            <Image src="/img/hotels/pai-mhs/hotel-1.jpg" alt="Alt1" fill className="object-cover" />
                        </div>
                        <div className="relative col-span-3 md:col-span-2 aspect-square rounded-xl overflow-hidden">
                            <Image src="/img/hotels/pai-mhs/hotel-1.jpg" alt="Alt2" fill className="object-cover" />
                        </div>
                        <div className="relative col-span-3 md:col-span-2 aspect-square rounded-xl overflow-hidden">
                            <Image src="/img/hotels/pai-mhs/hotel-1.jpg" alt="Alt3" fill className="object-cover" />
                        </div>
                        <div className="relative col-span-6 md:col-span-3 aspect-[4/3] rounded-xl overflow-hidden">
                            <Image src="/img/hotels/pai-mhs/hotel-1.jpg" alt="See all" fill className="object-cover" />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white font-semibold">See all</div>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">{name}</h1>
                            <p className="text-sm text-indigo-600 underline underline-offset-2">{locationName}</p>
                        </div>
                        <button className="rounded-lg border border-indigo-300 px-4 py-2 text-indigo-700 hover:bg-indigo-50">
                            Price Starting from 1,000 BAHT
                        </button>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                        {[1].map((i) => (
                            <article key={i} className="group flex flex-col sm:flex-row overflow-hidden rounded-xl border bg-white shadow-sm hover:shadow-md">
                                <div className="relative w-full h-40 sm:w-44 sm:h-auto">
                                    <Image src="/img/hotels/pai-mhs/hotel-1.jpg" alt="room" fill className="object-cover" />
                                </div>
                                <div className="flex min-w-0 flex-1 p-4">
                                    <div className="min-w-0">
                                        <p className="text-sm text-gray-500">{roomType} Room</p>
                                        <p className="mt-1 text-xl font-bold text-indigo-700">1,500 BAHT/night</p>
                                    </div>
                                </div>
                                <button onClick={() => handleBook(queryHid)}
                                    className="hidden sm:flex w-12 items-center justify-center bg-indigo-600 text-white hover:bg-indigo-700">
                                    <span className="[writing-mode:vertical-rl] rotate-180 font-medium tracking-wide">Book Now</span>
                                </button>
                                <div className="border-t p-3 sm:hidden">
                                    <button onClick={() => handleBook(queryHid)} className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">Book Now</button>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>

                <aside className="lg:col-span-4">
                    <div className="rounded-xl border bg-white p-4 shadow-sm">
                        <div className="flex items-start gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white text-xl font-bold">{score}</div>
                            <div>
                                <p className="font-semibold text-gray-900">Excellent</p>
                                <p className="text-xs text-gray-500">6879 Reviews</p>
                                <div className="mt-2 space-y-1 text-sm">
                                    {[
                                        { label: "Housekeeping", value: 4 },
                                        { label: "Food", value: 4 },
                                        { label: "Service", value: 5 },
                                        { label: "Staff", value: 4 },
                                    ].map((row) => (
                                        <div key={row.label} className="flex items-center gap-3">
                                            <span className="w-28 text-gray-600">{row.label}</span>
                                            <span className="flex items-center gap-1 text-indigo-500">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <FaStar key={i} className={i < row.value ? "fill-current" : "opacity-20"} />
                                                ))}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-5 gap-2">
                            {[FaCar, FaBath, FaUtensils, FaWifi, FaDumbbell].map((Icon, idx) => (
                                <div key={idx} className="flex h-10 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
                                    <Icon className="text-gray-700" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 rounded-xl border bg-white p-4 shadow-sm text-sm text-indigo-700 mb-4">
                        <span className="mr-2 text-rose-600">✶</span>
                        This property is in highly demand today.
                    </div>
                </aside>
            </section>
        </div>

    );
}
