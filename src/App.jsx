import React, { useState, useRef, useEffect } from 'react';

// 언어 옵션
const languages = [
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
];

// 다국어 번역 데이터
const translations = {
    ko: {
        title: 'POE2 색약 보정 도구',
        subtitle: '패시브 트리의 적/녹 색상을 보기 좋게 보정합니다',
        chooseOption: '아래에서 원하는 방식을 선택하세요',

        // 오프라인 버전
        offlineTitle: '오프라인 버전',
        offlineSubtitle: 'HTML 파일 다운로드',
        offlineDesc: '인터넷 없이도 사용 가능한 단일 HTML 파일입니다.\n다운로드 후 브라우저로 열기만 하면 바로 사용할 수 있습니다.',
        offlineFeature1: '완전한 오프라인 - 인터넷 연결 불필요',
        offlineFeature2: '서버 업로드 X - 이미지가 외부로 전송되지 않음',
        offlineFeature3: '설치 불필요 - 다운로드 후 더블클릭으로 실행',
        offlineFeature4: '적/녹색 선 → 파란색/흰색 등 원하는 색으로 즉시 변환',
        offlineTip: 'poe.ninja 패시브 트리 스크린샷 사용 권장',
        offlineButton: '다운로드 (HTML 파일)',

        // 크롬 확장
        extensionTitle: '크롬 확장 프로그램',
        extensionSubtitle: 'poe.ninja 실시간 보정',
        extensionDesc: 'poe.ninja 웹사이트에서 패시브 트리를 볼 때\n자동으로 색상을 보정해주는 브라우저 확장입니다.',
        extensionFeature1: '실시간 자동 적용 - 스크린샷/업로드 필요 없음',
        extensionFeature2: 'poe.ninja 전용 - 사이트 방문 시 바로 동작',
        extensionFeature3: '간편한 설정 - 원하는 색상으로 커스터마이징 가능',
        extensionFeature4: '완전 무료 - Chrome 웹 스토어에서 설치',
        extensionTip: 'poe.ninja에서 빌드를 자주 확인한다면 이 확장 추천!',
        extensionButton: 'Chrome 웹 스토어로 이동',

        comparison: '두 버전 비교',
        comparisonOffline: '오프라인 HTML',
        comparisonExtension: '크롬 확장',
        comparisonUseCase: '사용 대상',
        comparisonUseCaseOffline: '스크린샷 색상 변환',
        comparisonUseCaseExtension: 'poe.ninja 실시간 보정',
        comparisonInstall: '설치 방법',
        comparisonInstallOffline: '파일 다운로드',
        comparisonInstallExtension: '확장 프로그램 설치',
        comparisonAdvantage: '장점',
        comparisonAdvantageOffline: '어디서든 사용 가능',
        comparisonAdvantageExtension: '자동 적용, 편리함',

        footer: 'Made by IamMove'
    },
    en: {
        title: 'POE2 Color Blindness Fixer',
        subtitle: 'Adjust red/green passive tree colors for better visibility',
        chooseOption: 'Choose your preferred option below',

        // Offline version
        offlineTitle: 'Offline Version',
        offlineSubtitle: 'Download HTML File',
        offlineDesc: 'A single HTML file that works without internet.\nJust download and open in any browser - no installation required.',
        offlineFeature1: 'Fully Offline - No internet connection needed',
        offlineFeature2: 'No Server Upload - Your images stay on your device',
        offlineFeature3: 'Zero Installation - Download and double-click to run',
        offlineFeature4: 'Red/Green lines → Convert to Blue/White or any color',
        offlineTip: 'Works best with poe.ninja passive tree screenshots',
        offlineButton: 'Download (HTML File)',

        // Chrome extension
        extensionTitle: 'Chrome Extension',
        extensionSubtitle: 'Real-time fix on poe.ninja',
        extensionDesc: 'A browser extension that automatically adjusts\npassive tree colors on poe.ninja website.',
        extensionFeature1: 'Real-time Auto Fix - No screenshots or uploads needed',
        extensionFeature2: 'poe.ninja Only - Works instantly when you visit',
        extensionFeature3: 'Customizable - Choose your preferred colors',
        extensionFeature4: 'Completely Free - Install from Chrome Web Store',
        extensionTip: 'Recommended if you frequently check builds on poe.ninja!',
        extensionButton: 'Go to Chrome Web Store',

        comparison: 'Compare Both Versions',
        comparisonOffline: 'Offline HTML',
        comparisonExtension: 'Chrome Extension',
        comparisonUseCase: 'Use Case',
        comparisonUseCaseOffline: 'Screenshot color conversion',
        comparisonUseCaseExtension: 'Real-time poe.ninja fix',
        comparisonInstall: 'Installation',
        comparisonInstallOffline: 'File download',
        comparisonInstallExtension: 'Extension install',
        comparisonAdvantage: 'Advantage',
        comparisonAdvantageOffline: 'Works anywhere',
        comparisonAdvantageExtension: 'Auto-apply, convenient',

        footer: 'Made by IamMove'
    }
};

const CHROME_EXTENSION_URL = 'https://chromewebstore.google.com/detail/poe-%EC%83%89%EC%95%BD-%EB%B3%B4%EC%A0%95/pimelcjgneoahamgdflkdfhhmgopcpia';
const OFFLINE_FILE_NAME = 'POE2-ColorFixer-Offline.html';

function App() {
    const [lang, setLang] = useState('ko');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const t = translations[lang];

    const currentLang = languages.find(l => l.code === lang);

    // 드롭다운 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLangChange = (code) => {
        setLang(code);
        setIsDropdownOpen(false);
    };

    return (
        <div className="min-h-screen bg-poe-bg text-gray-200 p-4 md:p-8 font-sans">
            {/* Language Dropdown */}
            <div className="max-w-6xl mx-auto flex justify-end mb-4">
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-zinc-700 text-sm transition-colors min-w-[140px]"
                    >
                        <span className="text-base leading-none">{currentLang?.flag}</span>
                        <span className="flex-1 text-left">{currentLang?.name}</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-full bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl overflow-hidden z-50">
                            {languages.map((language) => (
                                <button
                                    key={language.code}
                                    onClick={() => handleLangChange(language.code)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-zinc-700 transition-colors ${lang === language.code ? 'bg-zinc-700/50 text-poe-accent' : ''
                                        }`}
                                >
                                    <span className="text-base leading-none">{language.flag}</span>
                                    <span>{language.name}</span>
                                    {lang === language.code && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-auto text-poe-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Header */}
            <header className="max-w-6xl mx-auto mb-12 text-center">
                <h1 className="text-3xl md:text-5xl font-bold text-poe-accent mb-4">{t.title}</h1>
                <p className="text-lg text-gray-400">{t.subtitle}</p>
                <p className="text-sm text-gray-500 mt-2">{t.chooseOption}</p>
            </header>

            {/* Main Cards */}
            <main className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">

                    {/* Offline Version Card */}
                    <div className="bg-poe-panel rounded-xl border border-poe-border shadow-2xl overflow-hidden hover:border-poe-accent/50 transition-colors">
                        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-6 border-b border-zinc-700">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">{t.offlineTitle}</h2>
                                    <p className="text-sm text-gray-400">{t.offlineSubtitle}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <p className="text-gray-300 mb-4 whitespace-pre-line leading-relaxed">{t.offlineDesc}</p>

                            <ul className="space-y-2 mb-6">
                                <li className="flex items-start gap-2 text-sm">
                                    <span className="text-green-400 mt-0.5">✓</span>
                                    <span className="text-gray-300">{t.offlineFeature1}</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm">
                                    <span className="text-green-400 mt-0.5">✓</span>
                                    <span className="text-gray-300">{t.offlineFeature2}</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm">
                                    <span className="text-green-400 mt-0.5">✓</span>
                                    <span className="text-gray-300">{t.offlineFeature3}</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm">
                                    <span className="text-green-400 mt-0.5">✓</span>
                                    <span className="text-gray-300">{t.offlineFeature4}</span>
                                </li>
                            </ul>

                            <div className="bg-zinc-800/50 rounded-lg p-3 mb-6 border border-zinc-700">
                                <p className="text-xs text-gray-400">
                                    <span className="text-yellow-400">📌</span> {t.offlineTip}
                                </p>
                            </div>

                            <a
                                href={`/${OFFLINE_FILE_NAME}`}
                                download={OFFLINE_FILE_NAME}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                {t.offlineButton}
                            </a>
                        </div>
                    </div>

                    {/* Chrome Extension Card */}
                    <div className="bg-poe-panel rounded-xl border border-poe-border shadow-2xl overflow-hidden hover:border-poe-accent/50 transition-colors">
                        <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 p-6 border-b border-zinc-700">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">{t.extensionTitle}</h2>
                                    <p className="text-sm text-gray-400">{t.extensionSubtitle}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <p className="text-gray-300 mb-4 whitespace-pre-line leading-relaxed">{t.extensionDesc}</p>

                            <ul className="space-y-2 mb-6">
                                <li className="flex items-start gap-2 text-sm">
                                    <span className="text-green-400 mt-0.5">✓</span>
                                    <span className="text-gray-300">{t.extensionFeature1}</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm">
                                    <span className="text-green-400 mt-0.5">✓</span>
                                    <span className="text-gray-300">{t.extensionFeature2}</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm">
                                    <span className="text-green-400 mt-0.5">✓</span>
                                    <span className="text-gray-300">{t.extensionFeature3}</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm">
                                    <span className="text-green-400 mt-0.5">✓</span>
                                    <span className="text-gray-300">{t.extensionFeature4}</span>
                                </li>
                            </ul>

                            <div className="bg-zinc-800/50 rounded-lg p-3 mb-6 border border-zinc-700">
                                <p className="text-xs text-gray-400">
                                    <span className="text-yellow-400">📌</span> {t.extensionTip}
                                </p>
                            </div>

                            <a
                                href={CHROME_EXTENSION_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-orange-500/25 flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                {t.extensionButton}
                            </a>
                        </div>
                    </div>
                </div>

                {/* Comparison Table */}
                <div className="bg-poe-panel rounded-xl border border-poe-border p-6 mb-12">
                    <h3 className="text-lg font-semibold text-white mb-4 text-center">{t.comparison}</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-zinc-700">
                                    <th className="py-3 px-4 text-left text-gray-400"></th>
                                    <th className="py-3 px-4 text-center text-blue-400">{t.comparisonOffline}</th>
                                    <th className="py-3 px-4 text-center text-orange-400">{t.comparisonExtension}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-zinc-800">
                                    <td className="py-3 px-4 text-gray-400">{t.comparisonUseCase}</td>
                                    <td className="py-3 px-4 text-center text-gray-300">{t.comparisonUseCaseOffline}</td>
                                    <td className="py-3 px-4 text-center text-gray-300">{t.comparisonUseCaseExtension}</td>
                                </tr>
                                <tr className="border-b border-zinc-800">
                                    <td className="py-3 px-4 text-gray-400">{t.comparisonInstall}</td>
                                    <td className="py-3 px-4 text-center text-gray-300">{t.comparisonInstallOffline}</td>
                                    <td className="py-3 px-4 text-center text-gray-300">{t.comparisonInstallExtension}</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 text-gray-400">{t.comparisonAdvantage}</td>
                                    <td className="py-3 px-4 text-center text-gray-300">{t.comparisonAdvantageOffline}</td>
                                    <td className="py-3 px-4 text-center text-gray-300">{t.comparisonAdvantageExtension}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-12 text-center text-gray-600 text-xs pb-8">
                POE2 Color Blindness Fixer &bull; {t.footer}
            </footer>
        </div>
    );
}

export default App;
