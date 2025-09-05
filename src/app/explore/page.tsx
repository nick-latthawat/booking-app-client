export default function ExplorePage() {
    return (
        <section className="space-y-4">
            <h1 className="text-3xl font-bold text-blue-600">Explore</h1>
            <p className="text-gray-600">
                หน้านี้ไว้สำหรับค้นหา Hotel / Flight / Car (ตัวอย่าง placeholder)
            </p>

            {/* ตัวอย่าง content คร่าว ๆ */}
            <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border p-4">Search box</div>
                <div className="rounded-2xl border p-4">Hero / Banner</div>
            </div>
        </section>
    );
}
