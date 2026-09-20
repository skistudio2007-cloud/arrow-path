export type LanguageCode = 'en' | 'hi' | 'es' | 'fr' | 'de' | 'ja';

export interface LanguageOption {
  id: LanguageCode;
  name: string;
  nativeName: string;
}

export const LANGUAGES: LanguageOption[] = [
  { id: 'en', name: 'English (US)', nativeName: 'English' },
  { id: 'hi', name: 'हिन्दी (Hindi)', nativeName: 'हिन्दी' },
  { id: 'es', name: 'Español (Spanish)', nativeName: 'Español' },
  { id: 'fr', name: 'Français (French)', nativeName: 'Français' },
  { id: 'de', name: 'Deutsch (German)', nativeName: 'Deutsch' },
  { id: 'ja', name: '日本語 (Japanese)', nativeName: '日本語' },
];

export const TRANSLATIONS = {
  en: {
    // Navigation
    home: 'Home',
    collection: 'Collection',
    settings: 'Settings',

    // Home Screen
    dayStreak: 'Day Streak',
    arrowTitle: 'ARROW',
    pathPuzzle: 'PATH PUZZLE',
    level: 'Level',
    hardLevel: 'HARD LEVEL',
    continueBtn: 'Continue',

    // Header & Gameplay
    moves: 'Moves',
    parTarget: 'Par Target',
    arrowsLeft: 'arrows left',
    undo: 'Undo',
    levels: 'Levels',
    loadingPuzzle: 'Loading Puzzle...',
    hint: 'Hint',
    flawless: 'Flawless',
    greatJob: 'Great Job',
    cleared: 'Cleared',

    // Victory Screen
    levelCleared: 'Level Cleared!',
    hardLevelCleared: 'Hard Level Conquered!',
    allArrowsClearedDesc: 'All arrows released flawlessly.',
    hardLevelClearedDesc: 'Masterful! You conquered this hard challenge!',
    nextLevel: 'Next Level',
    replayLevel: 'Replay Level',
    returnHome: 'Return to Main Menu',
    allLevelsCelebration: '🎉 Congratulations! All 3,000 Levels Cleared!',

    // Game Over
    outOfLives: 'Out of Lives!',
    outOfLivesDesc: 'Watch a quick ad to get +1 Life and keep your current puzzle progress!',
    watchAdLife: 'Watch Ad (+1 Life)',
    free: 'Free',
    continueWithLives: 'Continue with 3 Lives',
    restartLevel: 'Restart Level',

    // Settings
    language: 'Language',
    vibrations: 'Vibrations',
    sounds: 'Sounds',
    darkMode: 'Dark mode',
    trajectoryGuide: 'Trajectory Guide',
    trajectoryDesc: 'Show dotted path on hover',
    boardTheme: 'Board Theme',
    autoRotate: 'Auto Rotate',
    accountConnection: 'Account Connection',
    removeAds: 'Remove Ads',
    restorePurchases: 'Restore purchases',
    rateUs: 'Rate us',
    writeUs: 'Write us',
    howToPlay: 'How to Play',
    privacy: 'Privacy',
    termsOfService: 'Terms of Service',
    resetProgress: 'Reset Progress',
    clearData: 'Clear Data',
    confirmReset: 'Confirm Reset',
    cancel: 'Cancel',

    // Toast alerts
    vibrationsEnabled: 'Vibrations enabled',
    vibrationsDisabled: 'Vibrations disabled',
    soundsEnabled: 'Sounds enabled',
    soundsDisabled: 'Sounds disabled',
    darkModeEnabled: 'Dark mode enabled',
    lightModeEnabled: 'Light mode enabled',
    trajectoryEnabled: 'Trajectory guide enabled',
    trajectoryDisabled: 'Trajectory guide disabled',
    boardThemeToast: 'Board theme',
    guestConnected: 'Guest account connected',
    accountDisconnected: 'Account disconnected',
    adsRemoved: 'Ads removed (100% Ad-Free!)',
    adsEnabled: 'Ads enabled',
    purchasesUpToDate: 'All purchases are up to date',
    ratingThanks: 'Thank you for rating 5 stars! ⭐⭐⭐⭐⭐',
    supportContact: 'Support email: support@arrowgo.app',
    privacyNotice: 'Arrow Go respects your privacy. 100% offline & client-side.',
    termsNotice: 'Terms of Service: Free to play, 3,000 levels included.',
    progressResetDone: 'Progress has been reset',

    // Collection
    records: 'Records',
    longestStreak: 'Longest Streak',
    highestWinStreak: 'Highest Win Streak',
    perfectSolves: 'Perfect Solves',
    milestones: 'Milestones',
    levelMilestones: 'Level Milestones',
    flawlessMilestones: 'Flawless Milestones',
    levelsCompleted: 'Levels Completed',
    levelsMastered: 'Levels Mastered',
  },

  hi: {
    // Navigation
    home: 'होम',
    collection: 'कलेक्शन',
    settings: 'सेटिंग्स',

    // Home Screen
    dayStreak: 'दिन की स्ट्रीक',
    arrowTitle: 'तीर',
    pathPuzzle: 'रास्ता पहेली',
    level: 'लेवल',
    hardLevel: 'कठिन लेवल',
    continueBtn: 'आगे बढ़ें',

    // Header & Gameplay
    moves: 'चालें',
    parTarget: 'लक्ष्य चालें',
    arrowsLeft: 'तीर शेष',
    undo: 'वापस लें',
    levels: 'लेवल्स',
    loadingPuzzle: 'पहेली लोड हो रही है...',
    hint: 'संकेत',
    flawless: 'उत्कृष्ट',
    greatJob: 'शानदार',
    cleared: 'पूरा हुआ',

    // Victory Screen
    levelCleared: 'लेवल पूरा हुआ!',
    hardLevelCleared: 'कठिन लेवल जीत लिया!',
    allArrowsClearedDesc: 'सभी तीर बिना रुकावट निकल गए।',
    hardLevelClearedDesc: 'अद्भुत! आपने यह कठिन चुनौती पार कर ली!',
    nextLevel: 'अगला लेवल',
    replayLevel: 'दोबारा खेलें',
    returnHome: 'मुख्य मेन्यू पर जाएं',
    allLevelsCelebration: '🎉 बधाई हो! सभी 3,000 लेवल्स पूरे हो गए!',

    // Game Over
    outOfLives: 'लाइफ खत्म!',
    outOfLivesDesc: '+1 लाइफ पाने और खेल जारी रखने के लिए विज्ञापन देखें!',
    watchAdLife: 'विज्ञापन देखें (+1 लाइफ)',
    free: 'मुफ्त',
    continueWithLives: '3 लाइफ के साथ जारी रखें',
    restartLevel: 'लेवल दोबारा शुरू करें',

    // Settings
    language: 'भाषा (Language)',
    vibrations: 'वाइब्रेशन',
    sounds: 'ध्वनि',
    darkMode: 'डार्क मोड',
    trajectoryGuide: 'दिशा संकेत',
    trajectoryDesc: 'तीर का संभावित रास्ता दिखाएं',
    boardTheme: 'बोर्ड थीम',
    autoRotate: 'ऑटो रोटेट',
    accountConnection: 'खाता कनेक्शन',
    removeAds: 'विज्ञापन हटाएं',
    restorePurchases: 'खरीदारी पुनर्स्थापित करें',
    rateUs: 'रेटिंग दें',
    writeUs: 'सुझाव भेजें',
    howToPlay: 'कैसे खेलें',
    privacy: 'गोपनीयता नीति',
    termsOfService: 'नियम व शर्तें',
    resetProgress: 'प्रगति रीसेट करें',
    clearData: 'डेटा हटाएं',
    confirmReset: 'रीसेट की पुष्टि करें',
    cancel: 'रद्द करें',

    // Toast alerts
    vibrationsEnabled: 'वाइब्रेशन चालू किया गया',
    vibrationsDisabled: 'वाइब्रेशन बंद किया गया',
    soundsEnabled: 'ध्वनि चालू की गई',
    soundsDisabled: 'ध्वनि बंद की गई',
    darkModeEnabled: 'डार्क मोड चालू',
    lightModeEnabled: 'लाइट मोड चालू',
    trajectoryEnabled: 'दिशा संकेत चालू',
    trajectoryDisabled: 'दिशा संकेत बंद',
    boardThemeToast: 'बोर्ड थीम',
    guestConnected: 'अतिथि खाता जुड़ा हुआ है',
    accountDisconnected: 'खाता डिस्कनेक्ट हो गया',
    adsRemoved: 'विज्ञापन हटा दिए गए (100% विज्ञापन मुक्त!)',
    adsEnabled: 'विज्ञापन सक्षम किए गए',
    purchasesUpToDate: 'सभी खरीदारी अपडेट हैं',
    ratingThanks: '5 स्टार रेटिंग के लिए धन्यवाद! ⭐⭐⭐⭐⭐',
    supportContact: 'सहायता ईमेल: support@arrowgo.app',
    privacyNotice: 'Arrow Go आपकी गोपनीयता का सम्मान करता है। 100% ऑफ़लाइन।',
    termsNotice: 'नियम व शर्तें: खेलने के लिए निःशुल्क, 3,000 स्तर शामिल हैं।',
    progressResetDone: 'प्रगति रीसेट कर दी गई है',

    // Collection
    records: 'रिकॉर्ड्स',
    longestStreak: 'सबसे लंबी स्ट्रीक',
    highestWinStreak: 'सर्वोच्च जीत स्ट्रीक',
    perfectSolves: 'उत्कृष्ट विजय',
    milestones: 'उपलब्धियां',
    levelMilestones: 'लेवल उपलब्धियां',
    flawlessMilestones: 'उत्कृष्ट उपलब्धियां',
    levelsCompleted: 'पूर्ण किए गए लेवल्स',
    levelsMastered: 'महारत हासिल लेवल्स',
  },

  es: {
    // Navigation
    home: 'Inicio',
    collection: 'Colección',
    settings: 'Ajustes',

    // Home Screen
    dayStreak: 'Racha de días',
    arrowTitle: 'FLECHA',
    pathPuzzle: 'PUZLE DE CAMINO',
    level: 'Nivel',
    hardLevel: 'NIVEL DIFÍCIL',
    continueBtn: 'Continuar',

    // Header & Gameplay
    moves: 'Movimientos',
    parTarget: 'Objetivo Par',
    arrowsLeft: 'flechas restantes',
    undo: 'Deshacer',
    levels: 'Niveles',
    loadingPuzzle: 'Cargando puzle...',
    hint: 'Pista',
    flawless: 'Impecable',
    greatJob: '¡Buen trabajo!',
    cleared: 'Completado',

    // Victory Screen
    levelCleared: '¡Nivel completado!',
    hardLevelCleared: '¡Nivel difícil superado!',
    allArrowsClearedDesc: 'Todas las flechas liberadas a la perfección.',
    hardLevelClearedDesc: '¡Increíble! ¡Superaste este gran desafío!',
    nextLevel: 'Siguiente nivel',
    replayLevel: 'Reintentar nivel',
    returnHome: 'Menú principal',
    allLevelsCelebration: '🎉 ¡Felicidades! ¡Completaste los 3,000 niveles!',

    // Game Over
    outOfLives: '¡Sin vidas!',
    outOfLivesDesc: '¡Mira un breve anuncio para obtener +1 vida y continuar tu puzle!',
    watchAdLife: 'Ver anuncio (+1 vida)',
    free: 'Gratis',
    continueWithLives: 'Continuar con 3 vidas',
    restartLevel: 'Reiniciar nivel',

    // Settings
    language: 'Idioma',
    vibrations: 'Vibraciones',
    sounds: 'Sonidos',
    darkMode: 'Modo oscuro',
    trajectoryGuide: 'Guía de trayectoria',
    trajectoryDesc: 'Mostrar camino punteado al tocar',
    boardTheme: 'Tema del tablero',
    autoRotate: 'Rotación automática',
    accountConnection: 'Conexión de cuenta',
    removeAds: 'Quitar anuncios',
    restorePurchases: 'Restaurar compras',
    rateUs: 'Califícanos',
    writeUs: 'Escríbenos',
    howToPlay: 'Cómo jugar',
    privacy: 'Privacidad',
    termsOfService: 'Términos de servicio',
    resetProgress: 'Restablecer progreso',
    clearData: 'Borrar datos',
    confirmReset: 'Confirmar restablecimiento',
    cancel: 'Cancelar',

    // Toast alerts
    vibrationsEnabled: 'Vibraciones activadas',
    vibrationsDisabled: 'Vibraciones desactivadas',
    soundsEnabled: 'Sonidos activados',
    soundsDisabled: 'Sonidos desactivados',
    darkModeEnabled: 'Modo oscuro activado',
    lightModeEnabled: 'Modo claro activado',
    trajectoryEnabled: 'Guía de trayectoria activada',
    trajectoryDisabled: 'Guía de trayectoria desactivada',
    boardThemeToast: 'Tema del tablero',
    guestConnected: 'Cuenta de invitado conectada',
    accountDisconnected: 'Cuenta desconectada',
    adsRemoved: 'Anuncios eliminados (¡100% sin anuncios!)',
    adsEnabled: 'Anuncios activados',
    purchasesUpToDate: 'Todas las compras están actualizadas',
    ratingThanks: '¡Gracias por calificar con 5 estrellas! ⭐⭐⭐⭐⭐',
    supportContact: 'Correo de soporte: support@arrowgo.app',
    privacyNotice: 'Arrow Go respeta tu privacidad. 100% sin conexión.',
    termsNotice: 'Términos de servicio: Gratis para jugar, 3,000 niveles incluidos.',
    progressResetDone: 'El progreso ha sido restablecido',

    // Collection
    records: 'Récords',
    longestStreak: 'Racha más larga',
    highestWinStreak: 'Mayor racha de victorias',
    perfectSolves: 'Victorias perfectas',
    milestones: 'Hitos',
    levelMilestones: 'Hitos de nivel',
    flawlessMilestones: 'Hitos impecables',
    levelsCompleted: 'Niveles completados',
    levelsMastered: 'Niveles dominados',
  },

  fr: {
    // Navigation
    home: 'Accueil',
    collection: 'Collection',
    settings: 'Paramètres',

    // Home Screen
    dayStreak: 'Série de jours',
    arrowTitle: 'FLÈCHE',
    pathPuzzle: 'PUZZLE DE TRAJET',
    level: 'Niveau',
    hardLevel: 'NIVEAU DIFFICILE',
    continueBtn: 'Continuer',

    // Header & Gameplay
    moves: 'Coups',
    parTarget: 'Objectif Par',
    arrowsLeft: 'flèches restantes',
    undo: 'Annuler',
    levels: 'Niveaux',
    loadingPuzzle: 'Chargement...',
    hint: 'Indice',
    flawless: 'Parfait',
    greatJob: 'Bravo',
    cleared: 'Réussi',

    // Victory Screen
    levelCleared: 'Niveau réussi !',
    hardLevelCleared: 'Niveau difficile conquis !',
    allArrowsClearedDesc: 'Toutes les flèches ont été libérées avec brio.',
    hardLevelClearedDesc: 'Incroyable ! Vous avez surmonté ce défi difficile !',
    nextLevel: 'Niveau suivant',
    replayLevel: 'Rejouer le niveau',
    returnHome: 'Menu principal',
    allLevelsCelebration: '🎉 Félicitations ! Les 3 000 niveaux sont terminés !',

    // Game Over
    outOfLives: 'Plus de vies !',
    outOfLivesDesc: 'Regardez une courte pub pour obtenir +1 vie et continuer !',
    watchAdLife: 'Regarder la pub (+1 Vie)',
    free: 'Gratuit',
    continueWithLives: 'Continuer avec 3 vies',
    restartLevel: 'Recommencer le niveau',

    // Settings
    language: 'Langue',
    vibrations: 'Vibrations',
    sounds: 'Sons',
    darkMode: 'Mode sombre',
    trajectoryGuide: 'Guide de trajectoire',
    trajectoryDesc: 'Afficher la ligne pointillée au survol',
    boardTheme: 'Thème du plateau',
    autoRotate: 'Rotation automatique',
    accountConnection: 'Connexion au compte',
    removeAds: 'Supprimer les pubs',
    restorePurchases: 'Restaurer les achats',
    rateUs: 'Noter le jeu',
    writeUs: 'Nous écrire',
    howToPlay: 'Comment jouer',
    privacy: 'Confidentialité',
    termsOfService: 'Conditions d\'utilisation',
    resetProgress: 'Réinitialiser le progrès',
    clearData: 'Effacer les données',
    confirmReset: 'Confirmer la réinitialisation',
    cancel: 'Annuler',

    // Toast alerts
    vibrationsEnabled: 'Vibrations activées',
    vibrationsDisabled: 'Vibrations désactivées',
    soundsEnabled: 'Sons activés',
    soundsDisabled: 'Sons désactivés',
    darkModeEnabled: 'Mode sombre activé',
    lightModeEnabled: 'Mode clair activé',
    trajectoryEnabled: 'Guide de trajectoire activé',
    trajectoryDisabled: 'Guide de trajectoire désactivé',
    boardThemeToast: 'Thème du plateau',
    guestConnected: 'Compte invité connecté',
    accountDisconnected: 'Compte déconnecté',
    adsRemoved: 'Publicités retirées (100% sans pub !)',
    adsEnabled: 'Publicités activées',
    purchasesUpToDate: 'Tous vos achats sont à jour',
    ratingThanks: 'Merci pour vos 5 étoiles ! ⭐⭐⭐⭐⭐',
    supportContact: 'Email de support : support@arrowgo.app',
    privacyNotice: 'Arrow Go respecte votre vie privée. 100% hors ligne.',
    termsNotice: 'Conditions d\'utilisation : Gratuit, 3 000 niveaux inclus.',
    progressResetDone: 'Votre progression a été réinitialisée',

    // Collection
    records: 'Records',
    longestStreak: 'Plus longue série',
    highestWinStreak: 'Meilleure série de victoires',
    perfectSolves: 'Victoires parfaites',
    milestones: 'Paliers',
    levelMilestones: 'Paliers de niveaux',
    flawlessMilestones: 'Paliers sans faute',
    levelsCompleted: 'Niveaux terminés',
    levelsMastered: 'Niveaux maîtrisés',
  },

  de: {
    // Navigation
    home: 'Start',
    collection: 'Sammlung',
    settings: 'Einstellungen',

    // Home Screen
    dayStreak: 'Tages-Serie',
    arrowTitle: 'PFEIL',
    pathPuzzle: 'WEGE-RÄTSEL',
    level: 'Level',
    hardLevel: 'SCHWERES LEVEL',
    continueBtn: 'Fortsetzen',

    // Header & Gameplay
    moves: 'Züge',
    parTarget: 'Par-Ziel',
    arrowsLeft: 'Pfeile übrig',
    undo: 'Rückgängig',
    levels: 'Level',
    loadingPuzzle: 'Rätsel lädt...',
    hint: 'Hinweis',
    flawless: 'Makellos',
    greatJob: 'Super gemacht',
    cleared: 'Geschafft',

    // Victory Screen
    levelCleared: 'Level geschafft!',
    hardLevelCleared: 'Schweres Level gemeistert!',
    allArrowsClearedDesc: 'Alle Pfeile wurden fehlerfrei gelöst.',
    hardLevelClearedDesc: 'Großartig! Du hast diese harte Herausforderung gemeistert!',
    nextLevel: 'Nächstes Level',
    replayLevel: 'Level wiederholen',
    returnHome: 'Hauptmenü',
    allLevelsCelebration: '🎉 Glückwunsch! Alle 3.000 Level wurden gelöst!',

    // Game Over
    outOfLives: 'Keine Leben mehr!',
    outOfLivesDesc: 'Schau eine kurze Werbung an, um +1 Leben zu erhalten!',
    watchAdLife: 'Werbung ansehen (+1 Leben)',
    free: 'Gratis',
    continueWithLives: 'Mit 3 Leben fortfahren',
    restartLevel: 'Level neu starten',

    // Settings
    language: 'Sprache',
    vibrations: 'Vibration',
    sounds: 'Töne',
    darkMode: 'Dunkelmodus',
    trajectoryGuide: 'Flugbahn-Hilfe',
    trajectoryDesc: 'Gepunktete Linie bei Berührung anzeigen',
    boardTheme: 'Spielfeld-Design',
    autoRotate: 'Automatischer Wechsel',
    accountConnection: 'Konto-Verbindung',
    removeAds: 'Werbung entfernen',
    restorePurchases: 'Käufe wiederherstellen',
    rateUs: 'Bewerten',
    writeUs: 'Schreiben',
    howToPlay: 'Spielanleitung',
    privacy: 'Datenschutz',
    termsOfService: 'Nutzungsbedingungen',
    resetProgress: 'Fortschritt zurücksetzen',
    clearData: 'Daten löschen',
    confirmReset: 'Zurücksetzen bestätigen',
    cancel: 'Abbrechen',

    // Toast alerts
    vibrationsEnabled: 'Vibration aktiviert',
    vibrationsDisabled: 'Vibration deaktiviert',
    soundsEnabled: 'Töne aktiviert',
    soundsDisabled: 'Töne deaktiviert',
    darkModeEnabled: 'Dunkelmodus aktiviert',
    lightModeEnabled: 'Hellmodus aktiviert',
    trajectoryEnabled: 'Flugbahn-Hilfe aktiviert',
    trajectoryDisabled: 'Flugbahn-Hilfe deaktiviert',
    boardThemeToast: 'Spielfeld-Design',
    guestConnected: 'Gastkonto verbunden',
    accountDisconnected: 'Konto getrennt',
    adsRemoved: 'Werbung entfernt (100% werbefrei!)',
    adsEnabled: 'Werbung aktiviert',
    purchasesUpToDate: 'Alle Käufe sind aktuell',
    ratingThanks: 'Danke für 5 Sterne! ⭐⭐⭐⭐⭐',
    supportContact: 'Support-E-Mail: support@arrowgo.app',
    privacyNotice: 'Arrow Go respektiert deine Privatsphäre. 100% offline.',
    termsNotice: 'Nutzungsbedingungen: Kostenlos spielbar, 3.000 Level enthalten.',
    progressResetDone: 'Fortschritt wurde zurückgesetzt',

    // Collection
    records: 'Rekorde',
    longestStreak: 'Längste Serie',
    highestWinStreak: 'Höchste Siegesserie',
    perfectSolves: 'Perfekte Siege',
    milestones: 'Meilensteine',
    levelMilestones: 'Level-Meilensteine',
    flawlessMilestones: 'Makellose Meilensteine',
    levelsCompleted: 'Abgeschlossene Level',
    levelsMastered: 'Gemeisterte Level',
  },

  ja: {
    // Navigation
    home: 'ホーム',
    collection: 'コレクション',
    settings: '設定',

    // Home Screen
    dayStreak: '日連続記録',
    arrowTitle: 'ARROW',
    pathPuzzle: '矢印迷路パズル',
    level: 'レベル',
    hardLevel: '高難易度レベル',
    continueBtn: '続ける',

    // Header & Gameplay
    moves: '手数',
    parTarget: '目標手数',
    arrowsLeft: '残りの矢印',
    undo: '元に戻す',
    levels: 'レベル一覧',
    loadingPuzzle: 'パズルを読み込み中...',
    hint: 'ヒント',
    flawless: 'パーフェクト',
    greatJob: '見事！',
    cleared: 'クリア',

    // Victory Screen
    levelCleared: 'レベルクリア！',
    hardLevelCleared: 'ハードレベル完全制覇！',
    allArrowsClearedDesc: 'すべての矢印がきれいに脱出しました。',
    hardLevelClearedDesc: '素晴らしい！難関レベルを見事に突破しました！',
    nextLevel: '次のレベルへ',
    replayLevel: 'もう一度プレイ',
    returnHome: 'メインメニューへ',
    allLevelsCelebration: '🎉 おめでとうございます！全3,000レベル完全制覇！',

    // Game Over
    outOfLives: 'ライフがなくなりました！',
    outOfLivesDesc: '短い動画広告を見てライフを+1回復し、続きからプレイしましょう！',
    watchAdLife: '広告を見て+1回復',
    free: '無料',
    continueWithLives: 'ライフ3で再開',
    restartLevel: 'レベルをやり直す',

    // Settings
    language: '言語 (Language)',
    vibrations: 'バイブレーション',
    sounds: '効果音',
    darkMode: 'ダークモード',
    trajectoryGuide: '進行ルート表示',
    trajectoryDesc: 'タップ時に矢印の軌道を表示',
    boardTheme: 'ボードテーマ',
    autoRotate: '自動切り替え',
    accountConnection: 'アカウント連携',
    removeAds: '広告を非表示',
    restorePurchases: '購入を復元',
    rateUs: '評価する',
    writeUs: 'お問い合わせ',
    howToPlay: '遊び方',
    privacy: 'プライバシーポリシー',
    termsOfService: '利用規約',
    resetProgress: '進行状況をリセット',
    clearData: 'データを削除',
    confirmReset: 'リセットを確定',
    cancel: 'キャンセル',

    // Toast alerts
    vibrationsEnabled: 'バイブレーションを有効にしました',
    vibrationsDisabled: 'バイブレーションを無効にしました',
    soundsEnabled: '効果音をオンにしました',
    soundsDisabled: '効果音をオフにしました',
    darkModeEnabled: 'ダークモードをオンにしました',
    lightModeEnabled: 'ライトモードをオンにしました',
    trajectoryEnabled: '進行ルート表示を有効にしました',
    trajectoryDisabled: '進行ルート表示を無効にしました',
    boardThemeToast: 'ボードテーマ',
    guestConnected: 'ゲストアカウントを連携しました',
    accountDisconnected: 'アカウントの連携を解除しました',
    adsRemoved: '広告を削除しました（完全広告なし！）',
    adsEnabled: '広告が有効です',
    purchasesUpToDate: '購入情報は最新です',
    ratingThanks: '高評価レビューをありがとうございます！ ⭐⭐⭐⭐⭐',
    supportContact: 'サポート宛先: support@arrowgo.app',
    privacyNotice: 'Arrow Goはプライバシーを保護します。100%オフライン動作。',
    termsNotice: '利用規約: 完全無料プレイ・全3,000レベル収録。',
    progressResetDone: '進行状況をリセットしました',

    // Collection
    records: '記録',
    longestStreak: '最長連続記録',
    highestWinStreak: '最高連勝記録',
    perfectSolves: 'パーフェクトクリア',
    milestones: 'マイルストーン',
    levelMilestones: 'レベル到達度',
    flawlessMilestones: 'ノーミス達成度',
    levelsCompleted: 'クリア済みレベル',
    levelsMastered: 'マスターレベル',
  },
} as const;

export type TranslationKey = keyof typeof TRANSLATIONS.en;

export function resolveLanguageCode(savedLang: string | null | undefined): LanguageCode {
  if (!savedLang) return 'en';
  const clean = savedLang.trim().toLowerCase();
  if (clean === 'hi' || clean.includes('hindi') || clean.includes('हिन्दी')) return 'hi';
  if (clean === 'es' || clean.includes('spanish') || clean.includes('español')) return 'es';
  if (clean === 'fr' || clean.includes('french') || clean.includes('français')) return 'fr';
  if (clean === 'de' || clean.includes('german') || clean.includes('deutsch')) return 'de';
  if (clean === 'ja' || clean.includes('japanese') || clean.includes('日本語')) return 'ja';
  return 'en';
}

export function t(lang: LanguageCode | string | null | undefined, key: TranslationKey): string {
  const code = resolveLanguageCode(lang);
  const dict = TRANSLATIONS[code] || TRANSLATIONS.en;
  return dict[key] || TRANSLATIONS.en[key] || (key as string);
}
