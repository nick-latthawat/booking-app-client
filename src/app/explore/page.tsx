"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { FaChevronLeft } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { apiFetch } from "../../app/lib/api";
import Image from "next/image";
export default function ExplorePage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const keyword = searchParams.get("id") ?? ""; // /explore?keyword=...

    const [hotels, setHotels] = useState<any[]>([]);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [rooms, setRooms] = useState(1);
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [name, setName] = useState("");
    const [locationName, setLocationName] = useState("");
    const [roomType, setRoomtype] = useState("");
    const didInitFromURL = useRef(false);

    useEffect(() => {
        if (didInitFromURL.current) return; // ทำครั้งเดียวตอน mount
        didInitFromURL.current = true;

        const paramID = searchParams.get("id");
        const paramStartDate = searchParams.get("startDate");
        const paramEndDate = searchParams.get("endDate");
        const paramRooms = searchParams.get("rooms");
        const paramAdults = searchParams.get("adults");
        const paramChildren = searchParams.get("children");
        const paramName = searchParams.get("name");
        const paramLocationName = searchParams.get("locationName");
        const paramRoomType = searchParams.get("roomType");
        console.log({ paramID, paramStartDate, paramEndDate, paramRooms, paramAdults, paramChildren });
        if (paramStartDate) setStartDate(new Date(paramStartDate));
        if (paramEndDate) setEndDate(new Date(paramEndDate));
        if (paramAdults) setAdults(parseInt(paramAdults));
        if (paramRooms) setRooms(parseInt(paramRooms));
        if (paramChildren) setChildren(parseInt(paramChildren));
        if (paramLocationName) setLocationName(paramLocationName);
        if (paramName) setName(paramName);
        if (paramRoomType) setRoomtype(paramRoomType);
    }, [searchParams]);

    useEffect(() => {
        (async () => {
            const base = await apiFetch("/booking");
            const res = await fetch(`${base}/getHotelByLocationID`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ LocationID: keyword }),
            });
            const data = await res.json();
            setHotels(data);
        })();
    }, [keyword]);

    async function handleBook(id: string, name: string, locationName: string, roomType: string) {
        const params = new URLSearchParams({
            paramID: id,
            paramStartDate: startDate.toISOString().split("T")[0],
            paramEndDate: endDate.toISOString().split("T")[0],
            paramRooms: rooms.toString(),
            paramAdults: adults.toString(),
            paramChildren: children.toString(),
            paramName: name,
            paramLocationName: locationName,
            paramRoomType: roomType,
        });
        console.log(params.toString());
        router.push(`/detail?${params.toString()}`);
    }



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
                    <h1 className="lg:hidden text-lg font-semibold absolute left-1/2 -translate-x-1/2">Hotel</h1>
                </div>
                <div className="w-full rounded-xl bg-indigo-50 lg:px-4 lg:py-2 px-2 py-2 text-gray-400">
                    Search city, Country, Place for Travel advisory
                </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-12">
                {/* Recommended sidebar */}
                <aside className="order-1 lg:order-2 lg:col-span-2 hidden lg:block">
                    <div className="rounded-xl border border-indigo-300 bg-white p-2">
                        <h3 className="mb-2 text-sm font-semibold text-gray-700">Recommended</h3>
                        <ul className="space-y-1">
                            {hotels.map((r) => (
                                <li key={r.ID} className="block rounded-xl bg-indigo-50/40 p-2">
                                    <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-lg">
                                        <Image
                                            src={r.ImagePath}
                                            alt={r.Name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate font-medium text-gray-800">{r.Name}</p>
                                        <p className="mt-0.5 line-clamp-2 text-xs text-gray-600">Description</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                <div className="order-2 lg:order-1 lg:col-span-10">
                    {/* Header */}
                    <div className="mb-4">
                        <div className="sm:flex sm:flex-col sm:gap-2 lg:flex lg:flex-row lg:gap-4 ">
                            <h2 className="text-lg font-semibold mb-2">Best places to enjoy your stay</h2>
                            <div className="flex gap-2 lg:ml-auto">
                                <button className="cursor-pointer rounded-lg border px-3 py-1.5 text-sm text-indigo-700 hover:bg-indigo-50">
                                    Sort By
                                </button>
                                <button className="cursor-pointer rounded-lg border px-3 py-1.5 text-sm text-indigo-700 hover:bg-indigo-50">
                                    Filter
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {hotels.map((h) => (
                            <article
                                key={h.ID}
                                className="overflow-hidden rounded-xl border border-indigo-300 bg-white shadow-sm transition hover:shadow-md"
                            >
                                <div className="relative aspect-[19/8] w-full">
                                    <Image
                                        src={h.ImagePath}
                                        alt={h.Name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        priority={false}
                                    />
                                </div>

                                <div className="p-2">
                                    <h2 className="line-clamp-1 font-semibold text-gray-900">{h.Name}</h2>
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                        <p className="text-sm text-gray-500">
                                            Price starts from {h.Price.toLocaleString()}
                                        </p>

                                        <div className="mt-1">
                                            <button
                                                className="cursor-pointer w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                                onClick={() => {
                                                    handleBook(h.ID, h.Name, h.LocationName, h.RoomType);
                                                }}
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                </div>

            </div>
        </div>

    );
}
