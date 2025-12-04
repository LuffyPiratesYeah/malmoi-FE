import { Navbar } from "@/components/layout/Navbar";
import { Badge } from "@/components/ui/Badge";
import { db } from "@/lib/db";

export default async function ClassDetailPage({ params }: { params: { id: string } }) {
    const classData = await db.class.getById(params.id);

    if (!classData) {
        return <div>Class not found</div>;
    }

    return (
        <div className="min-h-screen bg-white pb-20">
            <Navbar />

            <main className="mx-auto max-w-7xl px-8 py-12">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">수업 자세히 보기</h1>
                    <p className="text-sm text-gray-500">튜터와 함께 하기전 수업을 자세히 알아보아요</p>
                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                    {/* Hero Image */}
                    <div className="h-80 w-full bg-gray-200">
                        <img
                            src={classData.image}
                            alt={classData.title}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <div className="p-8">
                        <div className="mb-6 flex items-start justify-between">
                            <div>
                                <h2 className="mb-4 text-2xl font-bold text-gray-900">{classData.title}</h2>
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-blue-50 text-primary px-3 py-1 text-sm">{classData.level}</Badge>
                                    <span className="text-sm text-gray-500">{classData.type}</span>
                                </div>
                            </div>
                            <span className="text-sm font-medium text-primary">{classData.category}</span>
                        </div>

                        <div className="mb-12 border-b border-gray-100 pb-12">
                            <p className="text-gray-600">
                                {classData.description}
                            </p>
                        </div>

                        {classData.details && (
                            <div className="space-y-6">
                                {classData.details.map((detail, i) => (
                                    <p key={i} className="text-gray-600">
                                        {detail}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
