"use client";

import { useEffect, useRef, useState } from "react";
type minmax = { min: number; max: number };

const Limits: Record<"rooms" | "adults" | "children", minmax> = {
    rooms: { min: 1, max: 9 },
    adults: { min: 1, max: 16 },
    children: { min: 0, max: 10 },
};

type GuestPickerProps = {
    recRooms: number;
    recAdults: number;
    recChildren: number;
    onSend: (rooms: number, adults: number, children: number) => void;
};

export default function GuestPicker({
    recRooms,
    recAdults,
    recChildren,
    onSend,
}: GuestPickerProps) {

    const [open, setOpen] = useState(false);
    const [rooms, setRooms] = useState(recRooms);
    const [adults, setAdults] = useState(recAdults);
    const [children, setChildren] = useState(recChildren);

    const rootRef = useRef<HTMLDivElement>(null);
    useEffect(() => setRooms(recRooms), [recRooms]);
    useEffect(() => setAdults(recAdults), [recAdults]);
    useEffect(() => setChildren(recChildren), [recChildren]);
    const apply = () => onSend(rooms, adults, children);
    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            if (!rootRef.current) return;
            if (!rootRef.current.contains(e.target as Node)) {
                // โหมด A: apply เมื่อปิด
                if (open) apply();
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, [open, rooms, adults, children]);

    const summary = `${adults} adult${adults > 1 ? "s" : ""} ${children > 0 ? `, ${children} child${children > 1 ? "ren" : ""}` : ""
        } • ${rooms} room${rooms > 1 ? "s" : ""}`;

    function plus(type: "rooms" | "adults" | "children") {
        if (type === "rooms") setRooms(v => Math.min(v + 1, Limits.rooms.max));
        if (type === "adults") setAdults(v => Math.min(v + 1, Limits.adults.max));
        if (type === "children") setChildren(v => Math.min(v + 1, Limits.children.max));
    }
    function minus(type: "rooms" | "adults" | "children") {
        if (type === "rooms") setRooms(v => Math.max(v - 1, Limits.rooms.min));
        if (type === "adults") setAdults(v => Math.max(v - 1, Limits.adults.min));
        if (type === "children") setChildren(v => Math.max(v - 1, Limits.children.min));
    }

    const Row = ({
        title, value, onMinus, onPlus
    }: { title: string; sub?: string; value: number; onMinus: () => void; onPlus: () => void }) => (
        <div className="flex items-center justify-between mb-1">
            <div>
                {title}
            </div>
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onMinus}
                    className="h-8 w-8 rounded-full border border-indigo-300 text-indigo-700 grid place-items-center disabled:opacity-40"
                    disabled={value <= (title === "Rooms" ? Limits.rooms.min : title === "Adults" ? Limits.adults.min : Limits.children.min)}
                    aria-label="decrease"
                >
                    -
                </button>
                <div className="w-6 text-center font-semibold">{value}</div>
                <button
                    type="button"
                    onClick={onPlus}
                    className="h-8 w-8 rounded-full border border-indigo-300 text-indigo-700 grid place-items-center disabled:opacity-40"
                    disabled={value >= (title === "Rooms" ? Limits.rooms.max : title === "Adults" ? Limits.adults.max : Limits.children.max)}
                    aria-label="increase"
                >
                    +
                </button>
            </div>
        </div>
    );

    return (
        <div ref={rootRef} className="relative w-full">
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className="flex w-full items-center gap-3 text-left"
            >
                <div className="w-full">
                    <div className="text-md text-gray-500">{summary}</div>
                </div>
                <span className={`ml-2 transition ${open ? "rotate-180" : ""}`}>▾</span>
            </button>

            {open && (
                <div className="absolute left-0 top-[calc(100%+6px)] z-20 w-full max-w-sm rounded-xl border border-indigo-300 bg-white p-4 shadow-xl md:w-96">
                    <div className="absolute -top-2 left-6 h-4 w-4 rotate-45 border-l border-t border-indigo-300 bg-white" />
                    <Row title="Rooms" value={rooms} onMinus={() => minus("rooms")} onPlus={() => plus("rooms")} />
                    <Row title="Adults" value={adults} onMinus={() => minus("adults")} onPlus={() => plus("adults")} />
                    <Row title="Children" value={children} onMinus={() => minus("children")} onPlus={() => plus("children")} />
                </div>
            )}
        </div>
    );
}
