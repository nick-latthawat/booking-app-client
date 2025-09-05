// "use client";

// import { useState } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// export default function DateRangePicker() {
//     const [startDate, setStartDate] = useState<Date | undefined>(new Date());
//     const [endDate, setEndDate] = useState<Date | undefined>(undefined);

//     return (
//         <div className="flex gap-3">
//             <div className="flex-1">
//                 <DatePicker
//                     selected={startDate}
//                     onChange={(date) => setStartDate(date ?? undefined)}
//                     selectsStart
//                     startDate={startDate}
//                     endDate={endDate}
//                     className="w-full rounded-lg border px-3 py-2 rounded-lg border border-indigo-200"
//                 />
//             </div>
//             <div className="flex-1">
//                 <DatePicker
//                     selected={endDate}
//                     onChange={(date) => setEndDate(date ?? undefined)}
//                     selectsEnd
//                     startDate={startDate}
//                     endDate={endDate}
//                     minDate={startDate}
//                     className="w-full rounded-lg border px-3 py-2 rounded-lg border border-indigo-200"
//                 />
//             </div>
//         </div>
//     );
// }

"use client";

import { useState, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";

type BtnProps = { value?: string; onClick?: () => void; placeholder?: string };
const InputLike = forwardRef<HTMLButtonElement, BtnProps>(
    ({ value, onClick, placeholder }, ref) => (
        <button
            type="button"
            onClick={onClick}
            ref={ref}
            className="w-full text-left bg-transparent outline-none"
        >
            {value || placeholder}
        </button>
    )
);
InputLike.displayName = "InputLike";

export default function DateRangePicker({ onSend }: { onSend: (startDate: Date, endDate: Date) => void }) {
    const [startDate, setStartDate] = useState<Date | undefined>(new Date());
    const [endDate, setEndDate] = useState<Date | undefined>(new Date());

    return (
        <div className="grid grid-cols-2 overflow-hidden rounded-lg border border-indigo-200 bg-indigo-50/40 text-gray-700">
            <div className="flex items-center gap-3 lg:px-4 lg:py-3 px-2 py-2">
                <FaCalendarAlt className="text-indigo-500 shrink-0" />
                <DatePicker
                    selected={startDate}
                    onChange={() => onSend(startDate!, endDate!)}
                    // onChange={(d) => setStartDate(d ?? undefined)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    maxDate={endDate}
                    dateFormat="EEE, dd-MMM-yyyy"
                    placeholderText="Start date"
                    customInput={<InputLike />}
                    wrapperClassName="w-full"
                    className="w-full bg-transparent outline-none"
                />
            </div>

            <div className="flex items-center gap-3 border-l border-indigo-200 lg:px-4 lg:py-3 px-2 py-2">
                <DatePicker
                    selected={endDate}
                    // onChange={(d) => setEndDate(d ?? undefined)}
                    onChange={() => onSend(startDate!, endDate!)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    dateFormat="EEE, dd-MMM-yyyy"
                    placeholderText="End date"
                    customInput={<InputLike />}
                    wrapperClassName="w-full"
                    className="w-full bg-transparent outline-none"
                />
            </div>
        </div>
    );
}
