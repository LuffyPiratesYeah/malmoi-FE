
export function FeaturesSection() {
    return (
        <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="grid md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="group relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative">
                        <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ wordBreak: 'keep-all' }}>
                            다양한 수업
                        </h3>
                        <p className="text-gray-600 leading-relaxed" style={{ wordBreak: 'keep-all' }}>
                            비즈니스, K-드라마, TOPIK 등<br />
                            목적에 맞는 맞춤 수업을<br />
                            선택하세요
                        </p>
                    </div>
                </div>

                {/* Feature 2 */}
                <div className="group relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative">
                        <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ wordBreak: 'keep-all' }}>
                            전문 선생님
                        </h3>
                        <p className="text-gray-600 leading-relaxed" style={{ wordBreak: 'keep-all' }}>
                            경험 많은 원어민 선생님과<br />
                            체계적이고 즐겁게<br />
                            학습하세요
                        </p>
                    </div>
                </div>

                {/* Feature 3 */}
                <div className="group relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative">
                        <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ wordBreak: 'keep-all' }}>
                            편리한 예약
                        </h3>
                        <p className="text-gray-600 leading-relaxed" style={{ wordBreak: 'keep-all' }}>
                            원하는 시간에<br />
                            간편하게 수업을<br />
                            예약하세요
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
