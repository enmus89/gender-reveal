export type Language = 'en' | 'sq';

export interface Translations {
  header: {
    appTitle: string;
    appSubtitle: string;
    revealedTag: string;
    quizTag: string;
    parentsPortal: string;
    parentsOnly: string;
    share: string;
    copied: string;
    muteAudio: string;
    enableAudio: string;
    languageToggle: string;
  };
  stages: {
    identity: string;
    guess: string;
    confirm: string;
    ignition: string;
    reveal: string;
  };
  page1: {
    stageTag: string;
    titleStart: string;
    titleHighlight: string;
    desc: string;
    nameLabel: string;
    namePlaceholder: string;
    nameError: string;
    relationLabel: string;
    relationTags: string[];
    messageLabel: string;
    messagePlaceholder: string;
    nextBtn: string;
  };
  page2: {
    stageTag: string;
    title: string;
    desc: string;
    teamBoy: string;
    teamBoySub: string;
    teamGirl: string;
    teamGirlSub: string;
    selectBoy: string;
    selectGirl: string;
    selectedCheck: string;
    backBtn: string;
    proceedBtn: string;
  };
  page3: {
    stageTag: string;
    titleStart: string;
    titleHighlight: string;
    desc: string;
    recordLabel: string;
    relationLabel: string;
    relativeFallback: string;
    teamBoyTitle: string;
    teamGirlTitle: string;
    predictionBoy: string;
    predictionGirl: string;
    savingBtn: string;
    confirmBtn: string;
    reviseBtn: string;
    saveError: string;
  };
  page4: {
    stageTag: string;
    titleStart: string;
    titleHighlight: string;
    desc: string;
    count3: string;
    count2: string;
    count1: string;
    count0: string;
    awaitingSensor: string;
    clickToReveal: string;
    audioProtocol: string;
  };
  // Some components reference alias keys (e.g. revealTitle, incorrectMsg); the
  // objects below provide both names, so this stays permissive on purpose.
  page5: Record<string, string>;
  pinModal: {
    accessOnly: string;
    passcodeTitle: string;
    changePinTitle: string;
    passcodeDesc: string;
    changePinDesc: string;
    enterPinPlaceholder: string;
    unlockBtn: string;
    verifying: string;
    defaultPinLabel: string;
    customizePinLink: string;
    currentPinLabel: string;
    currentPinPlaceholder: string;
    newPinLabel: string;
    newPinPlaceholder: string;
    backBtn: string;
    saveNewPinBtn: string;
    pinUpdatedSuccess: string;
    pinEmptyError: string;
    bothPinsRequiredError: string;
    newPinLengthError: string;
    incorrectPinError: string;
  };
  adminModal: {
    confidentialTag: string;
    unlockedBadge: string;
    modalTitle: string;
    refreshTitle: string;
    totalParticipants: string;
    teamBoy: string;
    teamGirl: string;
    searchPlaceholder: string;
    allTab: string;
    boyTab: string;
    girlTab: string;
    loadingDb: string;
    noMatches: string;
    boyCorrectBadge: string;
    girlBadge: string;
    lockParentView: string;
    resetAll: string;
    resetConfirm: string;
    closeBtn: string;
  };
  footer: Record<string, string>;
}

export const translations: Record<Language, Translations> = {
  en: {
    header: {
      appTitle: 'Baby Reveal Protocol',
      appSubtitle: 'BABY_BOT // GENDER_REVEAL',
      revealedTag: 'REVEALED',
      quizTag: 'QUIZ_V1',
      parentsPortal: 'PARENTS PORTAL',
      parentsOnly: 'PARENTS ONLY',
      share: 'SHARE',
      copied: 'COPIED',
      muteAudio: 'Mute audio effects',
      enableAudio: 'Enable audio effects',
      languageToggle: 'Language',
    },
    stages: {
      identity: 'Identity',
      guess: 'Guess',
      confirm: 'Confirm',
      ignition: 'Ignition',
      reveal: 'Reveal',
    },
    page1: {
      stageTag: 'STAGE 01 // PARTICIPANT_IDENTIFICATION',
      titleStart: 'Enter Your',
      titleHighlight: 'Prediction Name',
      desc: 'State your name and relationship so the parents can record your official guess in the family tally.',
      nameLabel: 'PARTICIPANT NAME',
      namePlaceholder: 'e.g. Aunt Sarah, Grandma Maria, Uncle Joe...',
      nameError: 'Please write your name so the parents know who guessed!',
      relationLabel: 'RELATIONSHIP TO BABY (OPTIONAL)',
      relationTags: [
        'Grandparent',
        'Aunt',
        'Uncle',
        'Cousin',
        'Best Friend',
        'Godparent',
        'Sibling',
        'Family Friend',
      ],
      messageLabel: 'MESSAGE OR BLESSING (OPTIONAL)',
      messagePlaceholder: "Can't wait to meet you! Wishing joy and blessings...",
      nextBtn: 'PROCEED TO STAGE 02: CHOOSE BOY OR GIRL',
    },
    page2: {
      stageTag: 'STAGE 02 // PREDICTION_HYPOTHESIS',
      title: "What's your prediction,",
      desc: 'Cast your vote: Will the upcoming baby be a boy or a girl?',
      teamBoy: 'TEAM BOY',
      teamBoySub: 'PRINCE // BOY',
      teamGirl: 'TEAM GIRL',
      teamGirlSub: 'PRINCESS // GIRL',
      selectBoy: 'SELECT BOY',
      selectGirl: 'SELECT GIRL',
      selectedCheck: 'SELECTED ✓',
      backBtn: 'BACK',
      proceedBtn: 'PROCEED TO STAGE 03: CONFIRM CHOICE',
    },
    page3: {
      stageTag: 'STAGE 03 // LOCK_CONFIRMATION',
      titleStart: 'Lock In Your',
      titleHighlight: 'Official Guess',
      desc: 'Verify your selection below. Once locked, your prediction will be synced with the family scoreboard.',
      recordLabel: 'RECORD',
      relationLabel: 'RELATION',
      relativeFallback: 'RELATIVE',
      teamBoyTitle: 'TEAM BOY 👑',
      teamGirlTitle: 'TEAM GIRL 🎀',
      predictionBoy: 'PREDICTION // BOY',
      predictionGirl: 'PREDICTION // GIRL',
      savingBtn: 'SAVING RECORD TO DATABASE...',
      confirmBtn: 'CONFIRM & LOCK IN PREDICTION',
      reviseBtn: 'REVISE SELECTION',
      saveError: 'Failed to record your guess online',
    },
    page4: {
      stageTag: 'STAGE 04 // INITIATION_PROTOCOL',
      titleStart: 'Ready for the',
      titleHighlight: 'Grand Reveal',
      desc: 'Stand by, {name}. Triggering the protocol will unleash the smoke, fireworks, and final truth!',
      count3: 'SYSTEM_DRUMROLL_ACTIVE // 3',
      count2: 'PREPARING_PYROTECHNICS // 2',
      count1: 'IGNITING_ATMOSPHERE // 1',
      count0: 'INITIALIZING_REVEAL_NOW!',
      awaitingSensor: 'AWAITING SENSOR TRANSMISSION...',
      clickToReveal: 'CLICK HERE TO REVEAL!',
      audioProtocol: 'AUDIO_PROTOCOL: ON • FIREWORKS & SMOKE READY',
    },
    page5: {
      officialProtocol: 'OFFICIAL REVEAL PROTOCOL',
      itsABoy: "IT'S A BOY!",
      itsABoySub: 'Our little prince is arriving soon! We are overjoyed to welcome our baby boy into the family!',
      correctScore: '100% SCORE // CORRECT PREDICTION',
      correctMsg: '{name}, your intuition was spot on! Welcome to Team Boy! 👑',
      teamGirlScore: 'PREDICTION: TEAM GIRL',
      teamGirlMsg: '{name}, it turns out to be a sweet little Boy! Thank you for playing and showing your love! 💙',
      replaySound: 'REPLAY SOUND',
      shareWithRelatives: 'SHARE WITH RELATIVES',
      linkCopied: 'LINK COPIED!',
      playAgain: 'LET ANOTHER RELATIVE PLAY',
      restrictedAccess: 'RESTRICTED_ACCESS // PARENTS_ONLY',
      scoreboardTitle: 'Family Guess Scoreboard',
      scoreboardLockedDesc: "To protect everyone's personal predictions and surprises, the detailed scoreboard of who guessed what is reserved exclusively for the parents.",
      totalParticipants: 'TOTAL PARTICIPANTS',
      predictionsRoster: 'PREDICTIONS ROSTER',
      momDadVault: 'MOM & DAD VAULT 🔒',
      enterPinBtn: 'PARENTS: ENTER PIN TO VIEW GUESSES',
      parentsUnlocked: 'PARENTS DASHBOARD // UNLOCKED',
      whoGuessedWhat: 'Who Guessed What?',
      lockView: 'LOCK VIEW',
      teamBoyCorrect: 'TEAM BOY (CORRECT)',
      teamGirlLabel: 'TEAM GIRL',
      totalRelativeSubmissions: 'TOTAL RELATIVE SUBMISSIONS',
      allGuesses: 'ALL GUESSES',
      noPredictions: 'NO PREDICTIONS RECORDED IN THIS CATEGORY',
      correctTag: 'TEAM BOY (100% CORRECT!)',
      teamGirlTag: 'TEAM GIRL',
      refreshTitle: 'Refresh submissions',
      // Alias keys used by Page5Reveal
      protocolBadge: 'OFFICIAL REVEAL PROTOCOL',
      revealTitle: "IT'S A BOY!",
      revealSubtitle: 'Our little prince is arriving soon! We are overjoyed to welcome our baby boy into the family!',
      correctScoreTitle: '100% SCORE // CORRECT PREDICTION',
      incorrectScoreTitle: 'PREDICTION: TEAM GIRL',
      incorrectMsg: '{name}, it turns out to be a sweet little Boy! Thank you for playing and showing your love! 💙',
      shareBtn: 'SHARE WITH RELATIVES',
      playAgainBtn: 'LET ANOTHER RELATIVE PLAY',
      guardedTag: 'RESTRICTED_ACCESS // PARENTS_ONLY',
      guardedTitle: 'Family Guess Scoreboard',
      guardedDesc: "To protect everyone's personal predictions and surprises, the detailed scoreboard of who guessed what is reserved exclusively for the parents.",
      parentsPinBtn: 'PARENTS: ENTER PIN TO VIEW GUESSES',
      parentsDashboard: 'PARENTS DASHBOARD // UNLOCKED',
      teamGirl: 'TEAM GIRL',
      totalSubmissions: 'TOTAL RELATIVE SUBMISSIONS',
      teamBoyBadge: 'TEAM BOY ✓',
      teamGirlBadge: 'TEAM GIRL',
      tabBoy: 'BOY 👑',
      tabGirl: 'GIRL 🎀',
    },
    pinModal: {
      accessOnly: 'CONFIDENTIAL // PARENTS_ONLY',
      passcodeTitle: 'Parents Access Passcode',
      changePinTitle: 'Change Parent PIN',
      passcodeDesc: 'Enter the master PIN to view who guessed what and read all relative blessings.',
      changePinDesc: 'Set a custom secret code for parents-only scoreboard access.',
      enterPinPlaceholder: 'Enter 4-digit PIN',
      unlockBtn: 'UNLOCK SCOREBOARD',
      verifying: 'VERIFYING...',
      defaultPinLabel: 'DEFAULT PIN:',
      customizePinLink: 'Customize PIN',
      currentPinLabel: 'CURRENT PARENT PIN',
      currentPinPlaceholder: 'Current PIN (e.g. 1234)',
      newPinLabel: 'NEW PARENT PIN (MIN 4 DIGITS)',
      newPinPlaceholder: 'New secret PIN',
      backBtn: 'BACK',
      saveNewPinBtn: 'SAVE NEW PIN',
      pinUpdatedSuccess: 'PIN SUCCESSFULLY UPDATED!',
      pinEmptyError: 'Please enter the 4-digit Parent PIN',
      bothPinsRequiredError: 'Both current and new PIN are required',
      newPinLengthError: 'New PIN must be at least 4 digits',
      incorrectPinError: 'Incorrect Parent PIN. Please try again.',
    },
    adminModal: {
      confidentialTag: 'PARENTS ACCESS ONLY // CONFIDENTIAL',
      unlockedBadge: 'UNLOCKED ✓',
      modalTitle: 'Family Predictions & Scoreboard',
      refreshTitle: 'Refresh Submissions',
      totalParticipants: 'Total Participants',
      teamBoy: 'Team Boy 👑',
      teamGirl: 'Team Girl 🎀',
      searchPlaceholder: 'Search relatives or blessings...',
      allTab: 'All',
      boyTab: 'Boy 👑',
      girlTab: 'Girl 🎀',
      loadingDb: 'LOADING_DATABASE...',
      noMatches: 'NO_MATCHING_PREDICTIONS',
      boyCorrectBadge: 'BOY (CORRECT)',
      girlBadge: 'GIRL',
      lockParentView: 'LOCK PARENT VIEW',
      resetAll: 'RESET ALL',
      resetConfirm: 'Are you sure you want to reset all recorded relative votes?',
      closeBtn: 'CLOSE',
    },
    footer: {
      engineOnline: 'GENDER_REVEAL_ENGINE // PROTOCOL_ONLINE',
      celebrating: 'CELEBRATING OUR UPCOMING BABY BOY 💙',
      celebratingBoy: 'CELEBRATING OUR UPCOMING BABY BOY 💙',
    },
  },
  sq: {
    header: {
      appTitle: 'Zbulimi i Gjinisë së Bebes',
      appSubtitle: 'BABY_BOT // GENDER_REVEAL',
      revealedTag: 'E ZBULUAR',
      quizTag: 'KUIZI_V1',
      parentsPortal: 'PORTALI I PRINDËRVE',
      parentsOnly: 'VETËM PRINDËRIT',
      share: 'SHPËRNDAJE',
      copied: 'U KOPJUA',
      muteAudio: 'Hesht efektet zanore',
      enableAudio: 'Aktivizo efektet zanore',
      languageToggle: 'Gjuha',
    },
    stages: {
      identity: 'Emri',
      guess: 'Zgjedhja',
      confirm: 'Konfirmimi',
      ignition: 'Nisja',
      reveal: 'Zbulimi',
    },
    page1: {
      stageTag: 'HAPI 01 // IDENTIFIKIMI_I_PJESËMARRËSIT',
      titleStart: 'Vendosni',
      titleHighlight: 'Emrin Tuaj',
      desc: 'Shkruani emrin dhe lidhjen tuaj familjare që prindërit të regjistrojnë parashikimin tuaj zyrtar.',
      nameLabel: 'EMRI I PJESËMARRËSIT',
      namePlaceholder: 'p.sh. Teze Sara, Gjyshe Maria, Xhaxhi Ilir...',
      nameError: 'Ju lutem shkruani emrin tuaj që prindërit ta dinë se kush votoi!',
      relationLabel: 'LIDHJA ME BEBEN (OPSIONALE)',
      relationTags: [
        'Gjysh / Gjyshe',
        'Teze / Hallë',
        'Xhaxha / Dajë',
        'Kushëri / Kushërirë',
        'Mik / Shoqe e Ngushtë',
        'Kumbare / Nun',
        'Motër / Vëlla',
        'Mik i Familjes',
      ],
      messageLabel: 'URIMI OSE MESAZHI JUAJ (OPSIONAL)',
      messagePlaceholder: 'Mezi presim të të takojmë! Të urojmë shëndet e jetë të gjatë...',
      nextBtn: 'VAZHDO TE HAPI 02: ZGJIDH DJALË APO VAJZË',
    },
    page2: {
      stageTag: 'HAPI 02 // ZGJEDHJA_E_PARASHIKIMIT',
      title: 'Cili është parashikimi yt,',
      desc: 'Jepni votën tuaj: A mendoni se bebi do të jetë djalë apo vajzë?',
      teamBoy: 'SKUADRA DJALË',
      teamBoySub: 'PRINC // DJALË',
      teamGirl: 'SKUADRA VAJZË',
      teamGirlSub: 'PRINCESHË // VAJZË',
      selectBoy: 'ZGJIDH DJALË',
      selectGirl: 'ZGJIDH VAJZË',
      selectedCheck: 'E ZGJEDHUR ✓',
      backBtn: 'KTHEHU',
      proceedBtn: 'VAZHDO TE HAPI 03: KONFIRMO ZGJEDHJEN',
    },
    page3: {
      stageTag: 'HAPI 03 // KONFIRMIMI_I_VOTËS',
      titleStart: 'Konfirmoni',
      titleHighlight: 'Parashikimin Zyrtar',
      desc: 'Verifikoni zgjedhjen tuaj më poshtë. Pasi të konfirmohet, vota do të ruhet në tabelën e familjes.',
      recordLabel: 'EMRI',
      relationLabel: 'LIDHJA',
      relativeFallback: 'FAMILJAR',
      teamBoyTitle: 'SKUADRA DJALË 👑',
      teamGirlTitle: 'SKUADRA VAJZË 🎀',
      predictionBoy: 'PARASHIKIMI // DJALË',
      predictionGirl: 'PARASHIKIMI // VAJZË',
      savingBtn: 'DUKE RUAJTUR VOTËN NË BAZËN E TË DHËNAVE...',
      confirmBtn: 'KONFIRMO & RUAJ PARASHIKIMIN',
      reviseBtn: 'NDRYSHO ZGJEDHJEN',
      saveError: 'Dështoi ruajtja e votës në rrjet',
    },
    page4: {
      stageTag: 'HAPI 04 // PROTOKOLLI_I_ZBULIMIT',
      titleStart: 'Gati për',
      titleHighlight: 'Zbulimin e Madh',
      desc: 'Bëhu gati, {name}. Nisja e zbulimit do të ndezë tymuesen, fishekzjarrët dhe të vërtetën!',
      count3: 'TUPANAT PO BIEN // 3',
      count2: 'GATITJA E FISHEKZJARRËVE // 2',
      count1: 'NDEZJA E ATMOSFERËS // 1',
      count0: 'ZBULIMI PO NIS TANI!',
      awaitingSensor: 'DUKE PRITUR TRANSMETIMIN...',
      clickToReveal: 'KLIKO KËTU PËR TË ZBULUAR!',
      audioProtocol: 'PROTOKOLLI_ZANOR: AKTIV • TYMUESJA & FISHEKZJARRËT GATI',
    },
    page5: {
      officialProtocol: 'PROTOKOLLI ZYRTAR I ZBULIMIT',
      itsABoy: 'ËSHTË DJALË!',
      itsABoySub: 'Princi ynë i vogël po vjen së shpejti! Jemi tejet të lumtur të mirëpresim djalin tonë në familje!',
      correctScore: '100% E SAKTË // PARASHIKIM I DUHUR',
      correctMsg: '{name}, intuita jote ishte plotësisht e saktë! Mirë se vjen në Skuadrën Djalë! 👑',
      teamGirlScore: 'PARASHIKIMI: SKUADRA VAJZË',
      teamGirlMsg: '{name}, doli të jetë një djalë i ëmbël! Faleminderit që luajte dhe për dashurinë tuaj! 💙',
      replaySound: 'RILUAJ ZËRIN',
      shareWithRelatives: 'SHPËRNDAJE ME TË AFËRMIT',
      linkCopied: 'LINKU U KOPJUA!',
      playAgain: 'LËR NJË TË AFËRM TJETËR TË LUAJË',
      restrictedAccess: 'AKSES_I_KUFIZUAR // VETËM_PËR_PRINDËRIT',
      scoreboardTitle: 'Tabela e Parashikimeve të Familjes',
      scoreboardLockedDesc: 'Për të ruajtur surprizën dhe parashikimet e secilit, tabela e detajuar e votave është e rezervuar vetëm për prindërit.',
      totalParticipants: 'TOTALI I PJESËMARRËSVE',
      predictionsRoster: 'LISTA E PARASHIKIMEVE',
      momDadVault: 'SEFI I MAMIT & BABIT 🔒',
      enterPinBtn: 'PRINDËRIT: VENDOSNI PIN PËR TË PARË VOTAT',
      parentsUnlocked: 'PANELI I PRINDËRVE // I HAPUR',
      whoGuessedWhat: 'Kush Çfarë Parashikoi?',
      lockView: 'BLLOKO PAMJEN',
      teamBoyCorrect: 'SKUADRA DJALË (E SAKTË)',
      teamGirlLabel: 'SKUADRA VAJZË',
      totalRelativeSubmissions: 'TOTALI I PARASHIKIMEVE TË FAMILJES',
      allGuesses: 'TË GJITHA',
      noPredictions: 'NUK KA PARASHIKIME NË KËTË KATEGORI',
      correctTag: 'SKUADRA DJALË (100% E SAKTË!)',
      teamGirlTag: 'SKUADRA VAJZË',
      refreshTitle: 'Rifresko parashikimet',
      // Alias keys used by Page5Reveal
      protocolBadge: 'PROTOKOLLI ZYRTAR I ZBULIMIT',
      revealTitle: 'ËSHTË DJALË!',
      revealSubtitle: 'Princi ynë i vogël po vjen së shpejti! Jemi tejet të lumtur të mirëpresim djalin tonë në familje!',
      correctScoreTitle: '100% E SAKTË // PARASHIKIM I DUHUR',
      incorrectScoreTitle: 'PARASHIKIMI: SKUADRA VAJZË',
      incorrectMsg: '{name}, doli të jetë një djalë i ëmbël! Faleminderit që luajte dhe për dashurinë tuaj! 💙',
      shareBtn: 'SHPËRNDAJE ME TË AFËRMIT',
      playAgainBtn: 'LËR NJË TË AFËRM TJETËR TË LUAJË',
      guardedTag: 'AKSES_I_KUFIZUAR // VETËM_PËR_PRINDËRIT',
      guardedTitle: 'Tabela e Parashikimeve të Familjes',
      guardedDesc: 'Për të ruajtur surprizën dhe parashikimet e secilit, tabela e detajuar e votave është e rezervuar vetëm për prindërit.',
      parentsPinBtn: 'PRINDËRIT: VENDOSNI PIN PËR TË PARË VOTAT',
      parentsDashboard: 'PANELI I PRINDËRVE // I HAPUR',
      teamGirl: 'SKUADRA VAJZË',
      totalSubmissions: 'TOTALI I PARASHIKIMEVE TË FAMILJES',
      teamBoyBadge: 'SKUADRA DJALË ✓',
      teamGirlBadge: 'SKUADRA VAJZË',
      tabBoy: 'DJALË 👑',
      tabGirl: 'VAJZË 🎀',
    },
    pinModal: {
      accessOnly: 'KONFIDENCIALE // VETËM_PËR_PRINDËRIT',
      passcodeTitle: 'Kodi i Aksesit të Prindërve',
      changePinTitle: 'Ndrysho Kodin PIN të Prindërve',
      passcodeDesc: 'Vendosni kodin sekret PIN për të parë kush çfarë votoi dhe për të lexuar të gjitha urimet.',
      changePinDesc: 'Vendosni një kod të ri sekret vetëm për prindërit.',
      enterPinPlaceholder: 'Shkruaj PIN-in me 4 shifra',
      unlockBtn: 'HAP TABELËN',
      verifying: 'DUKE VERIFIKUAR...',
      defaultPinLabel: 'PIN-I FILLESTAR:',
      customizePinLink: 'Ndrysho PIN-in',
      currentPinLabel: 'PIN-I AKTUAL I PRINDËRVE',
      currentPinPlaceholder: 'PIN-i aktual (p.sh. 1234)',
      newPinLabel: 'PIN-I I RI (TË PAKTËN 4 SHIFRA)',
      newPinPlaceholder: 'Kodi i ri sekret',
      backBtn: 'KTHEHU',
      saveNewPinBtn: 'RUAJ PIN-IN E RI',
      pinUpdatedSuccess: 'PIN-I U NDRYSHUA ME SUKSES!',
      pinEmptyError: 'Ju lutem shkruani kodin PIN me 4 shifra',
      bothPinsRequiredError: 'Kërkohet si PIN-i aktual ashtu edhe ai i ri',
      newPinLengthError: 'PIN-i i ri duhet të ketë të paktën 4 shifra',
      incorrectPinError: 'Kodi PIN është i pasaktë. Ju lutem provoni përsëri.',
    },
    adminModal: {
      confidentialTag: 'AKSES VETËM PËR PRINDËRIT // KONFIDENCIALE',
      unlockedBadge: 'E HAPUR ✓',
      modalTitle: 'Parashikimet e Familjes & Tabela',
      refreshTitle: 'Rifresko të dhënat',
      totalParticipants: 'Total Pjesëmarrës',
      teamBoy: 'Skuadra Djalë 👑',
      teamGirl: 'Skuadra Vajzë 🎀',
      searchPlaceholder: 'Kërko të afërm ose urime...',
      allTab: 'Të gjitha',
      boyTab: 'Djalë 👑',
      girlTab: 'Vajzë 🎀',
      loadingDb: 'DUKE NGARKUAR BAZËN...',
      noMatches: 'NUK KA PARASHIKIME PËRPUTHËSE',
      boyCorrectBadge: 'DJALË (E SAKTË)',
      girlBadge: 'VAJZË',
      lockParentView: 'BLLOKO PAMJEN E PRINDËRVE',
      resetAll: 'FSHIJ TË GJITHA',
      resetConfirm: 'A jeni i/e sigurt që doni të fshini të gjitha votat e regjistruara?',
      closeBtn: 'MBYLL',
    },
    footer: {
      engineOnline: 'MOTORI_I_ZBULIMIT_TE_GJINISE // PROTOKOLLI_AKTIV',
      celebrating: 'FESTOJMË ARDHJEN E DJALIT TONË TË BUKUR 💙',
      celebratingBoy: 'FESTOJMË ARDHJEN E DJALIT TONË TË BUKUR 💙',
    },
  },
};

const LANG_STORAGE_KEY = 'gender_reveal_lang';

export function getStoredLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  const saved = localStorage.getItem(LANG_STORAGE_KEY);
  if (saved === 'sq' || saved === 'en') {
    return saved;
  }
  return 'en';
}

export function saveStoredLanguage(lang: Language) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  }
}
