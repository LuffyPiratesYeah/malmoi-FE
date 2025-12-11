"use client";

import { useSearchParams } from "next/navigation";
import { zoomDirectGuide, zoomScheduleGuide, googleDocsLinkGuide } from "@/lib/linkGuideData";
import Image from "next/image";
import { useState } from "react";

export default function DescriptionPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type"); // 'zoom' or 'docs'
  const [zoomMethod, setZoomMethod] = useState<"direct" | "schedule">("direct");

  const getGuide = () => {
    if (type === "zoom") {
      return zoomMethod === "direct" ? zoomDirectGuide : zoomScheduleGuide;
    }
    return googleDocsLinkGuide;
  };

  const guide = getGuide();
  const title = type === "zoom" ? "Zoom 링크 삽입 방법" : "Google Docs 링크 삽입 방법";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600">아래 단계를 따라 링크를 생성하고 붙여넣으세요</p>
        </div>

        {/* Zoom 방법 선택 탭 */}
        {type === "zoom" && (
          <div className="mb-8 flex justify-center gap-4">
            <button
              onClick={() => setZoomMethod("direct")}
              className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                zoomMethod === "direct"
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-primary"
              }`}
            >
              직접 생성
            </button>
            <button
              onClick={() => setZoomMethod("schedule")}
              className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                zoomMethod === "schedule"
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-primary"
              }`}
            >
              회의 예약
            </button>
          </div>
        )}

        <div className="space-y-8">
          {guide.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="bg-primary/5 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">
                  Step {index + 1}
                </h2>
              </div>
              
              <div className="p-6">
                <div className="mb-4 relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={step.image}
                    alt={`Step ${index + 1}`}
                    fill
                    className="object-contain"
                  />
                </div>
                
                <p className="text-gray-700 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => window.close()}
            className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
