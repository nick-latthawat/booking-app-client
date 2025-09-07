"use client";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { FaStar, FaChevronLeft } from "react-icons/fa";
import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import GuestPicker from "../component/GuestPicker";
import DateRangePicker from "../component/Datepicker";
import { apiFetch } from "../../app/lib/api";

export default function ReviewPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sp = useSearchParams();
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [rooms, setRooms] = useState(1);
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [hotels, setHotels] = useState<any[]>([]);
    const [payment, setPayment] = useState(0);
    const [id, setID] = useState("");

    const [destination, setDestination] = useState("");
    const [name, setName] = useState("");
    const [locationName, setLocationName] = useState("");
    const [roomType, setRoomtype] = useState("");
    const [price, setPrice] = useState(0);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");



    const ui = useMemo(() => {
        // const start = new Date(data.startDate);
        // const end = new Date(data.endDate);
        const nights = Math.max(1, Math.round((+startDate - +endDate) / (1000 * 60 * 60 * 24)));
        const base = price * nights * rooms;
        // const discount = 0;
        // const afterDiscount = base - discount;
        // const total = afterDiscount + data.taxFee;

        const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const fmtDay = (d: Date) => d.toLocaleDateString("en-GB", { weekday: "long", day: "2-digit", month: "short" });

        return { nights, base, fmt, fmtDay };
    }, [startDate, endDate, rooms, price]);

    const handleSearch = () => {
        // demo only
        alert(`Search → ${destination} | ${startDate} → ${endDate} | ${adults} adults, ${children} children, ${rooms} room(s)`);
    };

    const handleSubmit = () => {
        if (!firstName || !lastName || !email || !phone) {
            alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
            return;
        }

        // // ถ้าครบทุกช่อง
        // alert(`ส่งข้อมูลเรียบร้อย: ${firstName} ${lastName}, ${email}, ${phone}`);
    };

    const handleGuestPicked = useCallback(
        (rooms: number, adults: number, children: number) => {
            setRooms(rooms);
            setAdults(adults);
            setChildren(children);
        },
        []
    );

    const didInitFromURL = useRef(false);
    useEffect(() => {
        if (didInitFromURL.current) return; // ทำครั้งเดียวตอน mount
        didInitFromURL.current = true;
        const paramID = searchParams.get("ID");
        const paramStartDate = searchParams.get("StartDate");
        const paramEndDate = searchParams.get("EndDate");
        const paramRooms = searchParams.get("Rooms");
        const paramAdults = searchParams.get("Adults");
        const paramChildren = searchParams.get("Children");
        const paramName = searchParams.get("Name");
        const paramLocationName = searchParams.get("LocationName");
        const paramRoomType = searchParams.get("RoomType");
        const paramPrice = searchParams.get("Price");

        if (paramID) setID(paramID);
        if (paramStartDate) setStartDate(new Date(paramStartDate));
        if (paramEndDate) setEndDate(new Date(paramEndDate));
        if (paramAdults) setAdults(parseInt(paramAdults));
        if (paramRooms) setRooms(parseInt(paramRooms));
        if (paramChildren) setChildren(parseInt(paramChildren));
        if (paramLocationName) setLocationName(paramLocationName);
        if (paramName) setName(paramName);
        if (paramRoomType) setRoomtype(paramRoomType);
        if (paramPrice) setPrice(parseInt(paramPrice));


    }, [searchParams]);

    useEffect(() => {

        if (!id || !roomType || !ui.nights) return;

        const body = JSON.stringify({
            ID: id,
            RoomType: roomType,
            NightAmount: ui.nights,
        });

        (async () => {
            const base = await apiFetch("/booking");
            const res = await fetch(`${base}/calculatePayment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ID: id,
                    RoomType: roomType,
                    NightAmount: ui.nights,
                }),
            });

            const data = await res.json();
            setPayment(data);
        })();
    }, [id, roomType, ui.nights]);

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
                    <h2 className="text-xl font-semibold text-gray-900">Review your booking</h2>
                    <div className="mt-3 flex items-start gap-4">
                        <div className="min-w-0">
                            <button className="text-indigo-700 font-semibold hover:underline">{name}</button>
                            <div className="mt-1 flex items-center gap-2 text-amber-500">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <FaStar key={i} className={i < 4 ? "fill-current" : "opacity-30"} />
                                ))}
                            </div>
                            <p className="mt-2 text-sm text-gray-600">{locationName}</p>
                            <p className="text-sm text-gray-500">This hotel is reviewed by global firm</p>
                        </div>
                        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-md">
                            <Image src="/img/hotels/pai-mhs/hotel-1.jpg" alt="thumb" fill className="object-cover" />
                        </div>
                    </div>

                    <div className="mt-4 rounded-xl border bg-indigo-50/40 p-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 items-center">
                            <div>
                                <p className="text-xs text-gray-500">Check-in</p>
                                <p className="text-base font-semibold text-gray-900">{ui.fmtDay(new Date(startDate))}</p>
                                <p className="text-xs text-gray-500">10am</p>
                            </div>
                            <div className="flex items-center justify-center">
                                <span className="rounded-lg bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700">
                                    {ui.nights} night{ui.nights > 1 ? "s" : ""}
                                </span>
                            </div>
                            <div className="text-right sm:text-left">
                                <p className="text-xs text-gray-500">Check-out</p>
                                <p className="text-base font-semibold text-gray-900">{ui.fmtDay(new Date(endDate))}</p>
                                <p className="text-xs text-gray-500">{adults} Adult - {rooms} room</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="mb-3 text-sm font-semibold text-gray-900">Guest Details</h3>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <input className="h-11 rounded-lg border px-3 text-sm" placeholder="First Name" onChange={(e) => setFirstName(e.target.value)} />
                            <input className="h-11 rounded-lg border px-3 text-sm" placeholder="Last Name" onChange={(e) => setLastName(e.target.value)} />
                            <input className="h-11 rounded-lg border px-3 text-sm" placeholder="E-mail address" onChange={(e) => setEmail(e.target.value)} />
                            <input className="h-11 rounded-lg border px-3 text-sm" placeholder="Mobile number" onChange={(e) => setPhone(e.target.value)} />
                        </div>
                        <button className="mt-3 text-sm font-medium text-indigo-700">Add Guest +</button>
                        <div className="mt-3">
                            <p className="mb-2 text-sm text-gray-700">Special Request (optional)</p>
                            <textarea className="min-h-[120px] w-full rounded-lg border px-3 py-2 text-sm" placeholder="Type your request..." />
                        </div>

                        <div className="mt-6">
                            <button
                                // onClick={() => router.push("/payment")}
                                onClick={handleSubmit}
                                className="h-11 w-full sm:w-52 rounded-xl bg-indigo-600 px-6 text-white font-semibold hover:bg-indigo-700"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>

                <aside className="lg:col-span-4 space-y-4">
                    <div className="rounded-xl border bg-white p-4 shadow-sm text-sm">
                        <div className="flex items-center justify-between py-1">
                            <span>1 room X {ui.nights} night</span>
                            <span className="text-indigo-700">{payment}</span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                            <span>Total discount</span>
                            <span className="text-indigo-700">0</span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                            <span>Price after discount</span>
                            <span className="text-indigo-700">{payment}</span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                            <span>Taxes & service fees</span>
                            <span className="text-indigo-700">{0.00}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between border-t pt-3 font-semibold">
                            <span>Total Amount</span>
                            <span className="text-indigo-700">{payment}</span>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-white p-4 shadow-sm">
                        <h4 className="font-semibold text-gray-900">Cancellation Charges</h4>
                        <p className="mt-1 text-xs font-semibold">Non Refundable</p>
                        <p className="mt-2 text-sm text-gray-600">
                            Penalty may be charged by the airline & by MMT based on how close to departure date you cancel. View fare rules to know more.
                        </p>
                        <button className="mt-3 text-sm font-medium text-gray-700 underline underline-offset-4">VIEW POLICY</button>
                    </div>
                </aside>
            </section>
        </div>
    );
}

