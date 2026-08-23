const state = {
  screen: "landing",
  authMode: "signup",
  section: "dashboard",
  language: "en",
  user: {
    name: "",
    contact: "",
    email: "",
    phone: "",
    lastPeriod: "",
    cycleLengths: [31, 35, 33],
    unknownCycles: false,
    symptoms: {
      pain: 4,
      mood: 5,
      flow: 3,
      acne: false,
      fatigue: true,
      headaches: false,
      sleep: 6,
      stress: 5,
      lifestyle: "moderate"
    },
    cycleFactors: {
      stressLevel: "Moderate",
      mood: "Happy",
      dietQuality: "Average",
      appetiteChange: "No change",
      weightChange: "No change",
      physicalActivity: "Moderate",
      suddenExerciseIncrease: false,
      sleepQuality: "Good",
      routineConsistency: true,
      medicationsOrBirthControl: false,
      medicationsNote: "",
      healthConditions: "None",
      recentIllness: false,
      travelOrEnvironmentChange: false,
      lifestyleHabits: "Caffeine occasionally"
    },
    logs: []
  },
  chat: [
    {
      role: "assistant",
      text: "Hi, I am SAKHI. Ask me about your cycle, symptoms, food, stress, or PCOS signals."
    }
  ],
  aiInsight: null,
  aiStatus: "local",
  calendarMonthOffset: 0,
  selectedDate: "",
  selectedArticle: "",
  accountMessage: "",
  modal: null
};

const api = {
  base: "http://localhost:5000/api",
  token: localStorage.getItem("sakhi-token") || "",
  async request(path, options = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {})
    };

    const response = await fetch(`${this.base}${path}`, {
      ...options,
      headers: { ...headers, ...(options.headers || {}) }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "API request failed");
    }

    return response.json();
  },
  async auth(mode, payload) {
    const endpoint = mode === "signup" ? "/auth/signup" : "/auth/login";
    const result = await this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(payload)
    });
    this.token = result.token;
    localStorage.setItem("sakhi-token", result.token);
    return result;
  },
  async updateProfile(payload) {
    return this.request("/profile", {
      method: "PUT",
      body: JSON.stringify(payload)
    });
  },
  async logPeriod(payload) {
    return this.request("/periods", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  async chat(message) {
    return this.request("/chat", {
      method: "POST",
      body: JSON.stringify({ message })
    });
  },
  async predictions() {
    return this.request("/predictions");
  },
  async periodLogs() {
    return this.request("/periods");
  }
};

const copy = {
  en: {
    signUp: "Sign Up",
    login: "Login",
    continue: "Continue",
    back: "Back",
    logout: "Logout",
    heroText: "Personal cycle predictions, symptom-led insights, and compassionate health support for real bodies, not fixed assumptions.",
    authTitleSignup: "Create your secure account",
    authTitleLogin: "Welcome back",
    authText: "Use email or phone to begin. This prototype stores data locally in your browser.",
    name: "Name",
    contact: "Email or phone",
    password: "Password",
    languageTitle: "Choose your language",
    languageText: "SAKHI can translate the full experience, including dashboard labels, reminders, and chat guidance.",
    onboardingTitle: "Initial health setup",
    onboardingText: "Share what you know. If you do not remember cycle lengths, SAKHI will begin with symptom-based estimation and learn over time.",
    lastPeriod: "Last period date",
    cycle1: "Cycle length 1",
    cycle2: "Cycle length 2",
    cycle3: "Cycle length 3",
    dontRemember: "I do not remember",
    pain: "Pain level",
    mood: "Mood changes",
    flow: "Flow intensity",
    sleep: "Sleep hours",
    stress: "Stress level",
    acne: "Acne",
    fatigue: "Fatigue",
    headaches: "Headaches",
    lifestyle: "Lifestyle",
    dashboard: "Dashboard",
    insights: "Insights",
    chat: "AI Chat",
    notifications: "Notifications",
    account: "Account",
    dashboardText: "Your predictions adapt to the cycle history and symptoms you provide.",
    nextPeriod: "Next period",
    ovulation: "Ovulation",
    fertileWindow: "Fertile window",
    pcosRisk: "PCOS/PCOD risk",
    hormonalScore: "Hormonal balance",
    regularity: "Cycle regularity",
    logPeriod: "Log period",
    healthAnalysis: "Health analysis",
    smartCalendar: "Smart calendar",
    insightsText: "Education for menstrual health, PCOS awareness, food, movement, sleep, and everyday body literacy.",
    notificationsText: "Smart reminders based on your personalized predictions.",
    accountText: "Profile, symptom history, language settings, and account controls.",
    send: "Send",
    askPlaceholder: "Ask SAKHI anything...",
    startDate: "Start date",
    endDate: "End date",
    notes: "Symptoms or notes",
    save: "Save"
  },
  hi: {
    signUp: "साइन अप",
    login: "लॉगिन",
    continue: "जारी रखें",
    back: "वापस",
    logout: "लॉगआउट",
    heroText: "निश्चित 28-दिन के अनुमान नहीं, बल्कि आपके शरीर और लक्षणों पर आधारित व्यक्तिगत पीरियड भविष्यवाणी।",
    authTitleSignup: "अपना सुरक्षित खाता बनाएं",
    authTitleLogin: "वापसी पर स्वागत है",
    authText: "ईमेल या फोन से शुरू करें। यह प्रोटोटाइप डेटा आपके ब्राउज़र में रखता है।",
    name: "नाम",
    contact: "ईमेल या फोन",
    password: "पासवर्ड",
    languageTitle: "अपनी भाषा चुनें",
    languageText: "SAKHI डैशबोर्ड, रिमाइंडर और चैट मार्गदर्शन को आपकी भाषा में दिखा सकती है।",
    onboardingTitle: "प्रारंभिक स्वास्थ्य सेटअप",
    onboardingText: "जो याद है वह भरें। यदि चक्र लंबाई याद नहीं है, SAKHI लक्षणों से अनुमान शुरू करेगी।",
    lastPeriod: "आखिरी पीरियड तारीख",
    cycle1: "चक्र लंबाई 1",
    cycle2: "चक्र लंबाई 2",
    cycle3: "चक्र लंबाई 3",
    dontRemember: "मुझे याद नहीं",
    pain: "दर्द स्तर",
    mood: "मूड बदलाव",
    flow: "फ्लो तीव्रता",
    sleep: "नींद के घंटे",
    stress: "तनाव स्तर",
    acne: "एक्ने",
    fatigue: "थकान",
    headaches: "सिरदर्द",
    lifestyle: "जीवनशैली",
    dashboard: "डैशबोर्ड",
    insights: "जानकारी",
    chat: "AI चैट",
    notifications: "सूचनाएं",
    account: "खाता",
    dashboardText: "आपकी भविष्यवाणियां आपके चक्र इतिहास और लक्षणों के साथ बेहतर होती हैं।",
    nextPeriod: "अगला पीरियड",
    ovulation: "ओव्यूलेशन",
    fertileWindow: "फर्टाइल विंडो",
    pcosRisk: "PCOS/PCOD जोखिम",
    hormonalScore: "हार्मोन संतुलन",
    regularity: "चक्र नियमितता",
    logPeriod: "पीरियड लॉग करें",
    healthAnalysis: "स्वास्थ्य विश्लेषण",
    smartCalendar: "स्मार्ट कैलेंडर",
    insightsText: "पीरियड स्वास्थ्य, PCOS, भोजन, व्यायाम, नींद और शरीर की समझ।",
    notificationsText: "आपकी व्यक्तिगत भविष्यवाणियों पर आधारित रिमाइंडर।",
    accountText: "प्रोफाइल, लक्षण इतिहास, भाषा सेटिंग और खाता नियंत्रण।",
    send: "भेजें",
    askPlaceholder: "SAKHI से पूछें...",
    startDate: "शुरू तारीख",
    endDate: "अंत तारीख",
    notes: "लक्षण या नोट्स",
    save: "सेव"
  },
  ta: {
    signUp: "பதிவு",
    login: "உள்நுழை",
    continue: "தொடரவும்",
    back: "பின்",
    logout: "வெளியேறு",
    heroText: "நிலையான 28 நாள் கணிப்பு அல்ல; உங்கள் உடல் தரவு மற்றும் அறிகுறிகளை கற்றுக்கொள்ளும் தனிப்பட்ட மாதவிடாய் துணை.",
    authTitleSignup: "பாதுகாப்பான கணக்கு உருவாக்கவும்",
    authTitleLogin: "மீண்டும் வரவேற்கிறோம்",
    authText: "மின்னஞ்சல் அல்லது தொலைபேசியால் தொடங்குங்கள். இந்த முன்மாதிரி தரவை உலாவியில் சேமிக்கும்.",
    name: "பெயர்",
    contact: "மின்னஞ்சல் அல்லது தொலைபேசி",
    password: "கடவுச்சொல்",
    languageTitle: "மொழியைத் தேர்வுசெய்க",
    languageText: "SAKHI முழு அனுபவத்தையும் உங்கள் மொழியில் காட்டும்.",
    onboardingTitle: "ஆரம்ப ஆரோக்கிய அமைப்பு",
    onboardingText: "உங்களுக்கு தெரிந்ததை பகிருங்கள். சுழற்சி நீளம் நினைவில் இல்லையெனில், அறிகுறிகளால் SAKHI கற்றுக்கொள்ளத் தொடங்கும்.",
    lastPeriod: "கடைசி மாதவிடாய் தேதி",
    cycle1: "சுழற்சி நீளம் 1",
    cycle2: "சுழற்சி நீளம் 2",
    cycle3: "சுழற்சி நீளம் 3",
    dontRemember: "எனக்கு நினைவில் இல்லை",
    pain: "வலி நிலை",
    mood: "மனநிலை மாற்றம்",
    flow: "ஓட்ட தீவிரம்",
    sleep: "தூக்க மணிநேரம்",
    stress: "மன அழுத்தம்",
    acne: "முகப்பரு",
    fatigue: "சோர்வு",
    headaches: "தலைவலி",
    lifestyle: "வாழ்க்கை முறை",
    dashboard: "டாஷ்போர்டு",
    insights: "விழிப்புணர்வு",
    chat: "AI அரட்டை",
    notifications: "அறிவிப்புகள்",
    account: "கணக்கு",
    dashboardText: "உங்கள் சுழற்சி வரலாறு மற்றும் அறிகுறிகளுடன் கணிப்புகள் மேம்படும்.",
    nextPeriod: "அடுத்த மாதவிடாய்",
    ovulation: "ஒவுலேஷன்",
    fertileWindow: "கருவுறும் நாட்கள்",
    pcosRisk: "PCOS/PCOD அபாயம்",
    hormonalScore: "ஹார்மோன் சமநிலை",
    regularity: "சுழற்சி ஒழுங்கு",
    logPeriod: "மாதவிடாய் பதிவு",
    healthAnalysis: "ஆரோக்கிய பகுப்பாய்வு",
    smartCalendar: "ஸ்மார்ட் காலண்டர்",
    insightsText: "மாதவிடாய் ஆரோக்கியம், PCOS, உணவு, உடற்பயிற்சி, தூக்கம் பற்றிய அறிவு.",
    notificationsText: "உங்கள் தனிப்பட்ட கணிப்புகளின் அடிப்படையிலான நினைவூட்டல்கள்.",
    accountText: "சுயவிவரம், அறிகுறி வரலாறு, மொழி அமைப்பு மற்றும் கணக்கு கட்டுப்பாடுகள்.",
    send: "அனுப்பு",
    askPlaceholder: "SAKHI-யிடம் கேளுங்கள்...",
    startDate: "தொடக்க தேதி",
    endDate: "முடிவு தேதி",
    notes: "அறிகுறிகள் அல்லது குறிப்புகள்",
    save: "சேமி"
  }
};

const languages = [
  ["en", "English"],
  ["hi", "हिन्दी"],
  ["ta", "தமிழ்"]
];

const lifestyleOptions = ["low activity", "moderate", "active"];

const factorOptions = {
  stressLevel: ["Low", "Moderate", "High"],
  factorMood: ["Happy", "Anxious", "Irritable", "Low", "Mood Swings"],
  dietQuality: ["Good", "Average", "Poor"],
  appetiteChange: ["No change", "Eating less", "Eating more"],
  weightChange: ["No change", "Loss", "Gain"],
  physicalActivity: ["Low", "Moderate", "High"],
  sleepQuality: ["Good", "Poor"],
  healthConditions: ["None", "PCOS", "Thyroid"]
};

function t(key) {
  return copy[state.language][key] || copy.en[key] || key;
}

function save() {
  localStorage.setItem("sakhi-state", JSON.stringify(state));
}

function load() {
  const stored = localStorage.getItem("sakhi-state");
  if (!stored) return;
  try {
    Object.assign(state, JSON.parse(stored));
  } catch {
    localStorage.removeItem("sakhi-state");
  }
}

function daysFrom(date, days) {
  const value = new Date(date);
  value.setDate(value.getDate() + days);
  return value;
}

function fmt(date) {
  return new Intl.DateTimeFormat(state.language === "en" ? "en-IN" : state.language, {
    day: "numeric",
    month: "short"
  }).format(date);
}

function iso(date) {
  const value = new Date(date);
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateAtStart(value) {
  const date = new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function inDateRange(date, start, end) {
  const current = dateAtStart(date).getTime();
  return current >= dateAtStart(start).getTime() && current <= dateAtStart(end).getTime();
}

function sameDate(a, b) {
  return iso(a) === iso(b);
}

function monthLabel(date) {
  return new Intl.DateTimeFormat(state.language === "en" ? "en-IN" : state.language, {
    month: "long",
    year: "numeric"
  }).format(date);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function prediction() {
  const symptoms = state.user.symptoms;
  const factors = state.user.cycleFactors || {};
  const known = state.user.cycleLengths.map(Number).filter((v) => v >= 18 && v <= 60);
  let cycleLength;
  let confidence;

  if (state.user.unknownCycles || known.length < 3) {
    const symptomAdjustment = Math.round((symptoms.stress - 5) * 1.3 + (7 - symptoms.sleep) * 0.8 + (symptoms.acne ? 1.5 : 0) + factorAdjustment(factors));
    cycleLength = clamp(30 + symptomAdjustment, 24, 42);
    confidence = 48;
  } else {
    const weighted = (known[0] * 0.2 + known[1] * 0.3 + known[2] * 0.5);
    const variability = Math.max(...known) - Math.min(...known);
    cycleLength = Math.round(weighted);
    confidence = clamp(92 - variability * 4, 54, 94);
  }

  const start = state.user.lastPeriod ? new Date(state.user.lastPeriod) : new Date();
  const nextPeriod = daysFrom(start, cycleLength);
  const ovulation = daysFrom(nextPeriod, -14);
  return {
    cycleLength,
    confidence,
    nextPeriod,
    ovulation,
    fertileStart: daysFrom(ovulation, -5),
    fertileEnd: daysFrom(ovulation, 1),
    periodEnd: daysFrom(nextPeriod, 4)
  };
}

function factorAdjustment(factors = {}) {
  let adjustment = 0;
  if (factors.stressLevel === "High") adjustment += 2;
  if (factors.stressLevel === "Low") adjustment -= 1;
  if (["Anxious", "Irritable", "Low", "Mood Swings"].includes(factors.mood)) adjustment += 1;
  if (factors.dietQuality === "Poor") adjustment += 1;
  if (factors.weightChange === "Gain" || factors.weightChange === "Loss") adjustment += 1;
  if (factors.suddenExerciseIncrease) adjustment += 1;
  if (factors.sleepQuality === "Poor") adjustment += 2;
  if (factors.routineConsistency === false) adjustment += 1;
  if (factors.medicationsOrBirthControl) adjustment += 1;
  if (factors.healthConditions === "PCOS" || factors.healthConditions === "Thyroid") adjustment += 2;
  if (factors.recentIllness) adjustment += 1;
  if (factors.travelOrEnvironmentChange) adjustment += 1;
  return adjustment;
}

function factorSignals(factors = {}) {
  const signals = [];
  if (factors.stressLevel === "High") signals.push("high stress factor");
  if (["Anxious", "Irritable", "Low", "Mood Swings"].includes(factors.mood)) signals.push("mood instability");
  if (factors.dietQuality === "Poor") signals.push("poor diet quality");
  if (factors.appetiteChange && factors.appetiteChange !== "No change") signals.push("appetite change");
  if (factors.weightChange && factors.weightChange !== "No change") signals.push("weight change");
  if (factors.physicalActivity === "Low") signals.push("low activity");
  if (factors.suddenExerciseIncrease) signals.push("sudden exercise increase");
  if (factors.sleepQuality === "Poor") signals.push("poor sleep quality");
  if (factors.routineConsistency === false) signals.push("routine inconsistency");
  if (factors.medicationsOrBirthControl) signals.push("medication or birth control");
  if (factors.healthConditions && factors.healthConditions !== "None") signals.push(`${factors.healthConditions} condition`);
  if (factors.recentIllness) signals.push("recent illness");
  if (factors.travelOrEnvironmentChange) signals.push("travel or environment change");
  return signals;
}

function healthScores() {
  const p = prediction();
  const s = state.user.symptoms;
  const factors = state.user.cycleFactors || {};
  const lengths = state.user.cycleLengths.map(Number).filter(Boolean);
  const variability = lengths.length ? Math.max(...lengths) - Math.min(...lengths) : 10;
  const irregularity = clamp((variability * 4) + (p.cycleLength > 35 ? 16 : 0) + (p.cycleLength < 21 ? 12 : 0), 0, 100);
  const symptomLoad = s.acne * 12 + s.fatigue * 10 + s.headaches * 6 + s.flow * 3 + s.pain * 3 + s.stress * 4 + Math.max(0, 7 - s.sleep) * 5 + factorAdjustment(factors) * 4;
  const pcosRisk = clamp(Math.round(irregularity * 0.52 + symptomLoad * 0.48 + (s.acne ? 6 : 0)), 4, 96);
  const pcodRisk = clamp(Math.round(irregularity * 0.64 + symptomLoad * 0.28 + (p.cycleLength > 35 ? 10 : 0) + (s.flow >= 4 ? 4 : 0)), 4, 96);
  const combinedRisk = Math.round((pcosRisk + pcodRisk) / 2);
  const hormonal = clamp(100 - Math.round(combinedRisk * 0.5 + s.stress * 3 + Math.max(0, 7 - s.sleep) * 4), 20, 96);
  const regularity = clamp(100 - irregularity, 8, 98);
  const riskFactors = [];
  if (variability >= 8) riskFactors.push("cycle length varies by 8+ days");
  if (p.cycleLength > 35) riskFactors.push("cycle length above 35 days");
  if (s.stress >= 7) riskFactors.push("high stress score");
  if (s.sleep < 6) riskFactors.push("sleep below 6 hours");
  if (s.acne) riskFactors.push("acne logged");
  if (s.fatigue) riskFactors.push("fatigue logged");
  if (s.pain >= 7) riskFactors.push("high pain score");
  riskFactors.push(...factorSignals(factors));
  return {
    pcosRisk,
    pcodRisk,
    combinedRisk,
    hormonal,
    hormonalBalance: hormonal,
    regularity,
    cycleRegularity: regularity,
    riskLevel: combinedRisk >= 70 ? "high" : combinedRisk >= 40 ? "moderate" : "low",
    pcosLevel: pcosRisk >= 70 ? "high" : pcosRisk >= 40 ? "moderate" : "low",
    pcodLevel: pcodRisk >= 70 ? "high" : pcodRisk >= 40 ? "moderate" : "low",
    riskFactors: riskFactors.length ? riskFactors : ["no strong risk factor in current inputs"],
    recommendations: aiRecommendations(s, p, combinedRisk)
  };
}

function aiRecommendations(symptoms, predictionValue, pcosRisk) {
  const tips = [];
  if (symptoms.stress >= 7) tips.push("Add a stress log for the next 7 days and compare it with cycle timing.");
  if (symptoms.sleep < 6) tips.push("Prioritize a stable sleep window; sleep disruption can shift ovulation.");
  if (symptoms.pain >= 7) tips.push("Track pain location and severity; sudden or severe pain should be discussed with a clinician.");
  if (pcosRisk >= 60) tips.push("If this pattern repeats for 2-3 cycles, prepare your logs for a gynecology consultation.");
  if (predictionValue.confidence < 60) tips.push("Log at least three period start dates to improve prediction confidence.");
  if (!tips.length) tips.push("Keep logging period start/end dates and symptoms to improve personalization.");
  return tips;
}

function landing() {
  return `
    <main class="landing">
      <section class="hero">
        <div class="brand"><span class="brand-mark">S</span><span>SAKHI</span></div>
        <div class="hero-copy">
          <h1>SAKHI</h1>
          <p>${t("heroText")}</p>
        </div>
      </section>
      <aside class="auth-panel">
        <div class="panel">
          <h2>${state.authMode === "signup" ? t("authTitleSignup") : t("authTitleLogin")}</h2>
          <p>${t("authText")}</p>
          <form class="form" data-action="auth">
            ${state.authMode === "signup" ? field("name", t("name"), state.user.name, "text") : ""}
            ${field("contact", t("contact"), state.user.contact, "text")}
            ${field("password", t("password"), "", "password")}
            <div class="actions">
              <button class="btn primary" type="submit">${state.authMode === "signup" ? t("signUp") : t("login")}</button>
              <button class="btn secondary" type="button" data-click="toggleAuth">${state.authMode === "signup" ? t("login") : t("signUp")}</button>
            </div>
          </form>
        </div>
      </aside>
    </main>
  `;
}

function field(name, label, value = "", type = "text", attrs = "") {
  return `<label>${label}<input name="${name}" type="${type}" value="${value || ""}" ${attrs}></label>`;
}

function languageScreen() {
  return shellScreen(t("languageTitle"), t("languageText"), `
    <div class="choice-grid">
      ${languages.map(([code, label]) => `<button class="choice ${state.language === code ? "active" : ""}" data-language="${code}">${label}</button>`).join("")}
    </div>
    <div class="button-row">
      <button class="btn primary" data-click="goOnboarding">${t("continue")}</button>
      <button class="btn ghost" data-click="goLanding">${t("back")}</button>
    </div>
  `);
}

function onboarding() {
  const u = state.user;
  const s = u.symptoms;
  return shellScreen(t("onboardingTitle"), t("onboardingText"), `
    <form class="form" data-action="onboarding">
      ${field("lastPeriod", t("lastPeriod"), u.lastPeriod, "date", "required")}
      <label class="choice"><input type="checkbox" name="unknownCycles" ${u.unknownCycles ? "checked" : ""}> ${t("dontRemember")}</label>
      <div class="form-row">
        ${field("cycle1", t("cycle1"), u.cycleLengths[0], "number", "min='18' max='60'")}
        ${field("cycle2", t("cycle2"), u.cycleLengths[1], "number", "min='18' max='60'")}
        ${field("cycle3", t("cycle3"), u.cycleLengths[2], "number", "min='18' max='60'")}
      </div>
      <div class="form-row">
        ${range("pain", t("pain"), s.pain)}
        ${range("mood", t("mood"), s.mood)}
        ${range("flow", t("flow"), s.flow, 1, 5)}
      </div>
      <div class="form-row">
        ${field("sleep", t("sleep"), s.sleep, "number", "min='0' max='14'")}
        ${range("stress", t("stress"), s.stress)}
        <label>${t("lifestyle")}<select name="lifestyle">${lifestyleOptions.map((item) => `<option ${s.lifestyle === item ? "selected" : ""}>${item}</option>`).join("")}</select></label>
      </div>
      <div class="actions">
        ${check("acne", t("acne"), s.acne)}
        ${check("fatigue", t("fatigue"), s.fatigue)}
        ${check("headaches", t("headaches"), s.headaches)}
      </div>
      <button class="btn primary" type="submit">${t("continue")}</button>
    </form>
  `);
}

function range(name, label, value, min = 0, max = 10) {
  return `<label>${label}: <strong data-range-value="${name}">${value}</strong><input name="${name}" type="range" min="${min}" max="${max}" value="${value}"></label>`;
}

function check(name, label, checked) {
  return `<label class="choice"><input type="checkbox" name="${name}" ${checked ? "checked" : ""}> ${label}</label>`;
}

function shellScreen(title, text, content) {
  return `<main class="landing"><section class="hero"><div class="brand"><span class="brand-mark">S</span><span>SAKHI</span></div><div class="hero-copy"><h1>SAKHI</h1><p>${t("heroText")}</p></div></section><aside class="auth-panel"><div class="panel"><h2>${title}</h2><p>${text}</p>${content}</div></aside></main>`;
}

function appWorkspace() {
  const nav = [
    ["dashboard", t("dashboard")],
    ["insights", t("insights")],
    ["chat", t("chat")],
    ["notifications", t("notifications")],
    ["account", "Profile"]
  ];
  return `
    <main class="workspace">
      <aside class="sidebar">
        <div class="brand"><span class="brand-mark">S</span><span>SAKHI</span></div>
        <nav class="nav">
          ${nav.map(([id, label]) => `<button class="nav-item ${state.section === id ? "active" : ""}" data-section="${id}"><span class="nav-label">${label}</span></button>`).join("")}
        </nav>
      </aside>
      <section class="main">${section()}</section>
      ${state.modal === "period" ? periodModal() : ""}
    </main>
  `;
}

function titleBlock(title, text, action = "") {
  return `<div class="topbar"><div class="screen-title"><h2>${title}</h2><p>${text}</p></div>${action}</div>`;
}

function section() {
  if (state.section === "insights") return insights();
  if (state.section === "chat") return chat();
  if (state.section === "notifications") return notifications();
  if (state.section === "account") return account();
  return dashboard();
}

function dashboard() {
  const insight = frontendInsight();
  const p = normalizePrediction(insight.prediction);
  const scores = insight.healthScores;
  return `
    ${dashboardHero(insight)}
    <div class="grid dashboard-grid">
      <div class="grid">
        <div class="grid metric-grid">
          ${metric(t("nextPeriod"), insightDate(insight.prediction.nextPeriod), `${p.confidence}% confidence`)}
          ${metric("Current phase", phaseLabel(insight.prediction.currentPhase), `Day ${insight.prediction.currentCycleDay || "?"}`)}
          ${metric(t("fertileWindow"), `${insightDate(insight.prediction.fertileWindow?.start)} - ${insightDate(insight.prediction.fertileWindow?.end)}`, "Estimated")}
        </div>
        ${aiSummaryPanel(insight)}
        <div class="panel dashboard-card">
          <div class="card-heading">
            <div>
              <span>Cycle view</span>
              <h2>${t("smartCalendar")}</h2>
            </div>
          </div>
          ${calendar(p)}
          <div class="legend"><span><i class="dot red"></i>Period</span><span><i class="dot green"></i>Ovulation</span><span><i class="dot white"></i>Normal</span></div>
        </div>
        ${cycleFactorsSection()}
      </div>
      <div class="dashboard-side">
        <div class="panel score dashboard-card">
          <div class="card-heading">
            <div>
              <span>AI health scan</span>
              <h2>${t("healthAnalysis")}</h2>
            </div>
          </div>
          ${score("Combined PCOS/PCOD risk", scores.combinedRisk ?? scores.pcosRisk, true)}
          ${score("PCOS signal", scores.pcosRisk, true)}
          ${score("PCOD signal", scores.pcodRisk ?? scores.pcosRisk, true)}
          ${score(t("hormonalScore"), scores.hormonalBalance ?? scores.hormonal)}
          ${score(t("regularity"), scores.cycleRegularity ?? scores.regularity)}
          <p class="small">Awareness only. SAKHI does not diagnose medical conditions.</p>
        </div>
        ${riskPanel(scores)}
      </div>
      <div class="account-badge">${api.token ? "Signed in" : "Local mode"}</div>
    </div>
  `;
}

function dashboardHero(insight) {
  return `
    <section class="dashboard-hero">
      <div>
        <span class="ai-chip">${state.aiStatus === "cloud" ? "Synced with MongoDB" : "Local AI mode"}</span>
        <h1>${t("dashboard")}</h1>
        <p>${t("dashboardText")}</p>
      </div>
      <div class="hero-actions">
        <div class="hero-stat">
          <span>Next period</span>
          <strong>${insightDate(insight.prediction.nextPeriod)}</strong>
        </div>
        <button class="btn primary" data-click="openPeriodModal">+ ${t("logPeriod")}</button>
      </div>
    </section>
  `;
}

function normalizePrediction(value) {
  const local = prediction();
  return {
    ...local,
    cycleLength: value.cycleLength || local.cycleLength,
    confidence: value.confidence || local.confidence,
    nextPeriod: value.nextPeriod ? new Date(value.nextPeriod) : local.nextPeriod,
    ovulation: value.ovulation ? new Date(value.ovulation) : local.ovulation,
    fertileStart: value.fertileWindow?.start ? new Date(value.fertileWindow.start) : local.fertileStart,
    fertileEnd: value.fertileWindow?.end ? new Date(value.fertileWindow.end) : local.fertileEnd,
    periodEnd: value.periodWindow?.end ? new Date(value.periodWindow.end) : local.periodEnd
  };
}

function aiSummaryPanel(insight) {
  const signals = insight.prediction.symptomSignals || [];
  return `
    <div class="ai-panel dashboard-card">
      <div>
        <span class="ai-chip">${state.aiStatus === "cloud" ? "MongoDB AI" : "Local AI"}</span>
        <h2>AI cycle intelligence</h2>
        <p>${insight.summary || "SAKHI is learning from cycle history, period logs, and symptoms."}</p>
      </div>
      <div class="ai-facts">
        <span>Model: ${insight.modelVersion || "sakhi-local-v2"}</span>
        <span>Learned cycles: ${insight.prediction.learnedFromCycles || 0}</span>
        <span>Signals: ${signals.length ? signals.join(", ") : "none strong"}</span>
      </div>
    </div>
  `;
}

function riskPanel(scores) {
  const factors = scores.riskFactors || [];
  const recommendations = scores.recommendations || [];
  return `
    <div class="panel dashboard-card insight-list-card">
      <div class="card-heading">
        <div>
          <span>What SAKHI noticed</span>
          <h2>Guidance</h2>
        </div>
      </div>
      <div class="ai-list compact">
        <strong>Risk level: ${scores.riskLevel || "low"}</strong>
        <span>PCOS: ${scores.pcosRisk}/100 (${scores.pcosLevel || "low"})</span>
        <span>PCOD: ${scores.pcodRisk ?? scores.pcosRisk}/100 (${scores.pcodLevel || "low"})</span>
        ${factors.slice(0, 4).map((item) => `<span>${item}</span>`).join("")}
      </div>
      <div class="ai-list compact">
        <strong>Recommendations</strong>
        ${recommendations.slice(0, 3).map((item) => `<span>${item}</span>`).join("")}
      </div>
    </div>
  `;
}

function optionField(name, label, value, options) {
  return `<label>${label}<select name="${name}">${options.map((item) => `<option value="${item}" ${value === item ? "selected" : ""}>${item}</option>`).join("")}</select></label>`;
}

function yesNoField(name, label, value) {
  return `<label>${label}<select name="${name}"><option value="No" ${!value ? "selected" : ""}>No</option><option value="Yes" ${value ? "selected" : ""}>Yes</option></select></label>`;
}

function cycleFactorsSection() {
  const f = state.user.cycleFactors || {};
  return `
    <section class="panel factors-card">
      <div class="section-heading">
        <div>
          <span class="ai-chip">Prediction inputs</span>
          <h2>Cycle Factors</h2>
          <p>Update lifestyle and routine changes so SAKHI can adjust cycle predictions with more context.</p>
        </div>
      </div>
      <form class="form factors-form" data-action="cycleFactors">
        ${optionField("stressLevel", "Stress Level", f.stressLevel, factorOptions.stressLevel)}
        ${optionField("factorMood", "Mood", f.mood, factorOptions.factorMood)}
        ${optionField("dietQuality", "Diet Quality", f.dietQuality, factorOptions.dietQuality)}
        ${optionField("appetiteChange", "Appetite Change", f.appetiteChange, factorOptions.appetiteChange)}
        ${optionField("weightChange", "Weight Change", f.weightChange, factorOptions.weightChange)}
        ${optionField("physicalActivity", "Physical Activity", f.physicalActivity, factorOptions.physicalActivity)}
        ${yesNoField("suddenExerciseIncrease", "Sudden Exercise Increase", f.suddenExerciseIncrease)}
        ${optionField("sleepQuality", "Sleep Quality", f.sleepQuality, factorOptions.sleepQuality)}
        ${yesNoField("routineConsistency", "Routine Consistency", f.routineConsistency)}
        ${yesNoField("medicationsOrBirthControl", "Medications / Birth Control", f.medicationsOrBirthControl)}
        ${field("medicationsNote", "Medication details", f.medicationsNote || "", "text")}
        ${optionField("healthConditions", "Health Conditions", f.healthConditions, factorOptions.healthConditions)}
        ${yesNoField("recentIllness", "Recent Illness", f.recentIllness)}
        ${yesNoField("travelOrEnvironmentChange", "Travel / Environmental Change", f.travelOrEnvironmentChange)}
        ${field("lifestyleHabits", "Lifestyle Habits", f.lifestyleHabits || "", "text", "placeholder='Smoking / alcohol / caffeine frequency'")}
        <button class="btn primary" type="submit">Save factors & update AI</button>
      </form>
    </section>
  `;
}

function metric(label, value, meta) {
  return `<div class="metric"><span>${label}</span><strong>${value}</strong><p class="small">${meta}</p></div>`;
}

function score(label, value, inverse = false) {
  const color = inverse && value > 65 ? "var(--danger)" : inverse && value > 38 ? "var(--warn)" : "var(--mint)";
  return `<div><div class="profile-row"><span>${label}</span><strong style="color:${color}">${value}/100</strong></div><div class="score-line"><i style="--value:${value}%; background:${color}"></i></div></div>`;
}

function calendar(p) {
  const today = new Date();
  const visibleMonth = new Date(today.getFullYear(), today.getMonth() + state.calendarMonthOffset, 1);
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const first = new Date(year, month, 1);
  const gridStart = daysFrom(first, -first.getDay());
  const selected = state.selectedDate ? dateAtStart(state.selectedDate) : dateAtStart(today);
  const days = Array.from({ length: 42 }, (_, i) => {
    const date = daysFrom(gridStart, i);
    const dateIso = iso(date);
    const status = calendarDayStatus(date, p);
    const classes = [
      "day",
      status.type,
      date.getMonth() !== month ? "outside" : "",
      sameDate(date, today) ? "today" : "",
      sameDate(date, selected) ? "selected" : ""
    ].join(" ");
    return `
      <button class="${classes}" data-date="${dateIso}" type="button">
        <span>${date.getDate()}</span>
        <i></i>
      </button>
    `;
  }).join("");
  const selectedStatus = calendarDayStatus(selected, p);
  const weekdays = ["S", "M", "T", "W", "T", "F", "S"].map((d) => `<div class="weekday">${d}</div>`).join("");

  return `
    <div class="smart-calendar">
      <div class="calendar-toolbar">
        <button class="icon-btn" data-click="prevMonth" type="button" title="Previous month">‹</button>
        <div>
          <strong>${monthLabel(visibleMonth)}</strong>
          <span>${selectedStatus.phase}</span>
        </div>
        <button class="icon-btn" data-click="nextMonth" type="button" title="Next month">›</button>
      </div>
      <div class="calendar">${weekdays}${days}</div>
      <div class="day-detail">
        <span>${fmt(selected)}</span>
        <strong>${selectedStatus.title}</strong>
        <p>${selectedStatus.detail}</p>
      </div>
    </div>
  `;
}

function calendarDayStatus(date, p) {
  const dateIso = iso(date);
  const logged = state.user.logs.find((log) => dateIso >= log.start && dateIso <= log.end);
  if (logged) {
    return {
      type: "period",
      title: "Logged period day",
      phase: "Period phase",
      detail: logged.notes || "This day is part of a period you logged."
    };
  }

  const baseStart = state.user.lastPeriod ? dateAtStart(state.user.lastPeriod) : dateAtStart(new Date());
  const cycleLength = p.cycleLength || 30;
  const dayDistance = Math.floor((dateAtStart(date) - baseStart) / 86400000);
  const cycleIndex = Math.floor(dayDistance / cycleLength);
  const cycleStart = daysFrom(baseStart, cycleIndex * cycleLength);
  const periodStart = cycleStart;
  const periodEnd = daysFrom(periodStart, 4);
  const nextPeriodStart = daysFrom(cycleStart, cycleLength);
  const ovulation = daysFrom(nextPeriodStart, -14);
  const fertileStart = daysFrom(ovulation, -5);
  const fertileEnd = daysFrom(ovulation, 1);

  if (inDateRange(date, periodStart, periodEnd)) {
    return {
      type: "period",
      title: "Predicted period day",
      phase: "Period phase",
      detail: `Expected period window: ${fmt(periodStart)} - ${fmt(periodEnd)}.`
    };
  }

  if (sameDate(date, ovulation)) {
    return {
      type: "ovulation",
      title: "Ovulation day",
      phase: "Ovulation phase",
      detail: "Highest fertility estimate for this cycle."
    };
  }

  if (inDateRange(date, fertileStart, fertileEnd)) {
    return {
      type: "ovulation",
      title: "Fertile window",
      phase: "Fertile phase",
      detail: `Fertile window estimate: ${fmt(fertileStart)} - ${fmt(fertileEnd)}.`
    };
  }

  return {
    type: "normal",
    title: "Normal cycle day",
    phase: "Tracking phase",
    detail: "No period or ovulation marker predicted for this day."
  };
}

function localCycleInsight() {
  const p = prediction();
  const scores = healthScores();
  const lastPeriod = state.user.lastPeriod ? dateAtStart(state.user.lastPeriod) : dateAtStart(new Date());
  const cycleDay = clamp(Math.floor((dateAtStart(new Date()) - lastPeriod) / 86400000) + 1, 1, p.cycleLength);
  const phase = cycleDay <= 5
    ? "menstrual"
    : cycleDay >= p.cycleLength - 19 && cycleDay <= p.cycleLength - 13
      ? "fertile"
      : cycleDay === p.cycleLength - 14
        ? "ovulation"
        : cycleDay < p.cycleLength - 14
          ? "follicular"
          : "luteal";
  const signals = [];
  if (state.user.symptoms.stress >= 7) signals.push("high stress");
  if (state.user.symptoms.sleep < 6) signals.push("low sleep");
  if (state.user.symptoms.pain >= 7) signals.push("high pain");
  if (state.user.symptoms.acne) signals.push("acne");
  if (state.user.symptoms.fatigue) signals.push("fatigue");
  signals.push(...factorSignals(state.user.cycleFactors || {}));
  return { p, scores, cycleDay, phase, signals };
}

function frontendInsight() {
  if (state.aiInsight?.prediction && state.aiInsight?.healthScores) {
    return state.aiInsight;
  }

  const { p, scores, cycleDay, phase, signals } = localCycleInsight();
  const uncertainty = clamp(Math.ceil((100 - p.confidence) / 12), 1, 6);
  return {
    prediction: {
      cycleLength: p.cycleLength,
      confidence: p.confidence,
      currentCycleDay: cycleDay,
      currentPhase: phase,
      nextPeriod: iso(p.nextPeriod),
      predictionWindow: {
        earliest: iso(daysFrom(p.nextPeriod, -uncertainty)),
        latest: iso(daysFrom(p.nextPeriod, uncertainty))
      },
      ovulation: iso(p.ovulation),
      fertileWindow: {
        start: iso(p.fertileStart),
        end: iso(p.fertileEnd)
      },
      periodWindow: {
        start: iso(p.nextPeriod),
        end: iso(p.periodEnd)
      },
      learnedFromCycles: state.user.cycleLengths.filter(Boolean).length + state.user.logs.length,
      symptomSignals: signals
    },
    healthScores: scores,
    summary: `SAKHI is using local AI mode. Current phase: ${phase}. Next period window: ${fmt(daysFrom(p.nextPeriod, -uncertainty))} - ${fmt(daysFrom(p.nextPeriod, uncertainty))}.`,
    modelVersion: "sakhi-local-v2"
  };
}

function insightDate(value) {
  return value ? fmt(new Date(value)) : "Not enough data";
}

function phaseLabel(value) {
  const labels = {
    menstrual: "Menstrual phase",
    follicular: "Follicular phase",
    fertile: "Fertile phase",
    ovulation: "Ovulation phase",
    luteal: "Luteal phase"
  };
  return labels[value] || "Tracking phase";
}

async function refreshAiInsight() {
  if (!api.token) {
    state.aiInsight = null;
    state.aiStatus = "local";
    state.accountMessage = "";
    return;
  }

  try {
    state.aiInsight = await api.predictions();
    state.aiStatus = "cloud";
    save();
    if (state.screen === "app") render();
  } catch (error) {
    console.warn("Backend AI insight unavailable, using local AI mode:", error.message);
    state.aiStatus = "local";
  }
}

async function refreshAccountData() {
  if (!api.token) return;
  try {
    const logs = await api.periodLogs();
    state.user.logs = logs.map((log) => ({
      start: iso(log.start),
      end: iso(log.end),
      notes: log.symptoms?.notes || ""
    }));
    save();
    if (state.screen === "app" && state.section === "account") render();
  } catch (error) {
    console.warn("Backend period logs unavailable, using local account data:", error.message);
  }
}

const insightArticles = [
  {
    id: "irregular-cycles",
    title: "Irregular cycles",
    topic: "Cycle tracking",
    preview: "A single late period is not always a problem. The pattern over several cycles matters more.",
    body: [
      "An irregular cycle means the time between period start dates changes more than expected for your body. Many people do not have a perfect 28-day cycle, and that alone does not mean something is wrong.",
      "SAKHI looks at cycle length, recent logs, sleep, stress, pain, flow, mood, and symptoms together. This helps separate a one-time delay from a repeated pattern.",
      "Useful things to track include period start date, period end date, pain level, flow, stress, sleep, travel, illness, medication changes, and major routine changes.",
      "If cycles are repeatedly very long, very short, suddenly different, or paired with severe pain or heavy bleeding, it is a good idea to discuss the pattern with a clinician."
    ]
  },
  {
    id: "pcos-awareness",
    title: "PCOS/PCOD awareness",
    topic: "Hormonal health",
    preview: "PCOS/PCOD risk is about repeated patterns, not one symptom by itself.",
    body: [
      "PCOS/PCOD can show up differently for different people. Common signals may include irregular cycles, acne, fatigue, hair changes, weight changes, and signs of insulin resistance.",
      "SAKHI does not diagnose PCOS/PCOD. Instead, it gives an awareness score based on cycle irregularity and symptom patterns so you can notice what is worth tracking.",
      "When you log several cycles, your history becomes more useful. A clinician can use your notes to decide whether tests such as hormone panels, thyroid checks, glucose markers, or ultrasound are needed.",
      "Seek medical advice if irregular cycles repeat, periods are absent for several months, symptoms are worsening, or you feel something is not normal for your body."
    ]
  },
  {
    id: "nutrition",
    title: "Nutrition for cycle support",
    topic: "Food and energy",
    preview: "Food cannot fix every symptom, but steady nutrition can support energy, mood, and cramps.",
    body: [
      "During periods, the body may feel more tired because of blood loss, pain, poor sleep, or inflammation. Iron-rich foods, protein, hydration, and regular meals can help support energy.",
      "Useful options include lentils, beans, leafy greens, eggs, fish, nuts, seeds, fruit, yogurt, whole grains, and warm fluids. Pairing iron-rich foods with vitamin C can improve absorption.",
      "For cramps, some people benefit from magnesium-rich foods, omega-3 sources, hydration, and reducing excess caffeine. Responses vary, so tracking food and symptoms together can reveal your own pattern.",
      "If bleeding is very heavy, fatigue is intense, or dizziness occurs, nutrition alone is not enough. It may be worth checking for anemia or other causes."
    ]
  },
  {
    id: "movement",
    title: "Movement and exercise",
    topic: "Lifestyle",
    preview: "Movement can be adapted to the cycle phase instead of forcing the same routine every day.",
    body: [
      "Gentle movement may help cramps and mood during periods. Walking, stretching, yoga-style mobility, or light activity can be enough when energy is low.",
      "In the follicular phase, some people feel more energetic and may tolerate strength training or higher intensity workouts better. In the luteal phase, sleep and recovery may matter more.",
      "For PCOS/PCOD patterns, regular movement can support insulin sensitivity, mood, and metabolic health. The goal is consistency, not punishment.",
      "If exercise causes severe pain, dizziness, unusual bleeding, or exhaustion, slow down and consider getting medical guidance."
    ]
  },
  {
    id: "sleep-stress",
    title: "Sleep, stress, and hormones",
    topic: "Daily rhythm",
    preview: "Stress and poor sleep can shift ovulation timing, which can shift the next period.",
    body: [
      "Ovulation is sensitive to the body's overall state. Stress, poor sleep, illness, travel, and major routine changes can delay ovulation, and a delayed ovulation often means a later period.",
      "This is why SAKHI asks about sleep and stress. They are not small details; they can explain why two cycles with similar symptoms still have different timing.",
      "Helpful tracking includes bedtime, wake time, sleep hours, stress level, mood, headaches, cravings, and energy. Even a simple 1-10 score can reveal a trend.",
      "If stress feels unmanageable, sleep is consistently poor, or mood symptoms are severe, support from a professional can be important."
    ]
  },
  {
    id: "myths",
    title: "Menstrual health myths",
    topic: "Myth busting",
    preview: "A healthy cycle does not have to be exactly 28 days.",
    body: [
      "Myth: Every healthy cycle is 28 days. Reality: Many healthy cycles are shorter or longer. Your personal baseline and consistency matter.",
      "Myth: Period pain is always normal. Reality: Mild cramps are common, but severe pain, fainting, vomiting, or pain that disrupts life deserves attention.",
      "Myth: Tracking is only for predicting periods. Reality: Tracking can help connect symptoms, sleep, stress, food, flow, pain, and mood over time.",
      "Myth: Apps can diagnose conditions. Reality: Apps can highlight patterns and support conversations, but diagnosis belongs with qualified healthcare professionals."
    ]
  }
];

function insights() {
  const article = insightArticles.find((item) => item.id === state.selectedArticle);
  if (article) {
    return `${titleBlock(t("insights"), article.topic, `<button class="btn secondary" data-click="closeArticle">Back to topics</button>`)}${articleView(article)}`;
  }

  return `
    ${titleBlock(t("insights"), t("insightsText"))}
    <div class="grid article-grid">
      ${insightArticles.map((item) => articleCard(item)).join("")}
    </div>
  `;
}

function articleCard(article) {
  return `
    <article class="article">
      <span>${article.topic}</span>
      <strong>${article.title}</strong>
      <p>${article.preview}</p>
      <button class="btn secondary" data-article="${article.id}" type="button">Read More</button>
    </article>
  `;
}

function articleView(article) {
  return `
    <article class="blog-view">
      <span>${article.topic}</span>
      <h2>${article.title}</h2>
      ${article.body.map((paragraph) => `<p>${paragraph}</p>`).join("")}
    </article>
  `;
}

function chat() {
  return `
    ${titleBlock(t("chat"), "Ask cycle questions and receive guidance shaped by your profile.")}
    <div class="panel chat">
      <div class="chat-log">${state.chat.map(chatMessage).join("")}</div>
      <form class="chat-input" data-action="chat">
        <input name="message" placeholder="${t("askPlaceholder")}" autocomplete="off">
        <button class="btn primary" type="submit">${t("send")}</button>
      </form>
    </div>
  `;
}

function chatMessage(msg) {
  const insight = msg.insight;
  return `
    <div class="chat-bubble ${msg.role === "user" ? "user" : ""}">
      <p>${msg.text}</p>
      ${insight ? chatInsightCard(insight) : ""}
    </div>
  `;
}

function chatInsightCard(insight) {
  return `
    <div class="chat-ai-card">
      <span>${phaseLabel(insight.prediction.currentPhase)} · ${insight.prediction.confidence}% confidence</span>
      <strong>Next period: ${insightDate(insight.prediction.nextPeriod)}</strong>
      <small>PCOS ${insight.healthScores.pcosRisk}/100 · PCOD ${insight.healthScores.pcodRisk ?? insight.healthScores.pcosRisk}/100</small>
    </div>
  `;
}

function notifications() {
  const p = prediction();
  const scores = healthScores();
  const items = [
    [t("nextPeriod"), `Reminder scheduled for ${fmt(daysFrom(p.nextPeriod, -2))}.`],
    [t("ovulation"), `Ovulation time is estimated around ${fmt(p.ovulation)}. SAKHI will remind you 1 day before and on the ovulation day.`],
    [t("fertileWindow"), `Fertile window reminder from ${fmt(p.fertileStart)} to ${fmt(p.fertileEnd)}.`],
    ["Drink water", "Hydration reminder: drink water regularly today, especially if flow, cramps, fatigue, or headaches are logged."],
    ["Sleep routine", "Sleep reminder: aim for a steady bedtime and 7-8 hours of rest. Poor sleep can shift ovulation timing."],
    ["Diet support", "Diet reminder: include protein, iron-rich foods, fruits, and warm fluids. Keep caffeine moderate if cramps or anxiety are high."],
    [t("pcosRisk"), (scores.combinedRisk ?? scores.pcosRisk) > 60 ? `PCOS signal ${scores.pcosRisk}/100 and PCOD signal ${scores.pcodRisk ?? scores.pcosRisk}/100. Consider discussing repeated patterns with a clinician.` : "No strong high-risk PCOS/PCOD pattern in current inputs."],
    ["Health recommendation", "Log sleep, stress, pain, and flow for better predictions."]
  ];
  return `${titleBlock(t("notifications"), t("notificationsText"))}<div class="grid">${items.map(([title, text]) => `<div class="notice"><strong>${title}</strong><p>${text}</p></div>`).join("")}</div>`;
}

function account() {
  const u = state.user;
  const insight = frontendInsight();
  const logs = [...u.logs].sort((a, b) => new Date(b.start) - new Date(a.start));
  const primaryContact = u.email || u.phone || u.contact || "";
  const userId = `SAKHI-${Math.abs((primaryContact || "demo").split("").reduce((a, c) => a + c.charCodeAt(0), 0))}`;
  const averagePeriodLength = logs.length
    ? Math.round(logs.reduce((sum, log) => sum + Math.max(1, daysBetweenDates(log.start, log.end) + 1), 0) / logs.length)
    : 0;
  return `
    ${titleBlock(t("account"), t("accountText"), `<button class="btn secondary" data-click="logout">${t("logout")}</button>`)}
    <div class="account-header">
      <div class="avatar">${(u.name || "S").slice(0, 1).toUpperCase()}</div>
      <div>
        <span>Profile</span>
        <h2>${u.name || "Demo user"}</h2>
        <p>${u.email || "Email not added"} · ${u.phone || "Phone not added"}</p>
      </div>
    </div>
    <div class="account-columns">
      <div class="panel account-edit-card">
        <div class="card-heading">
          <div>
            <span>Personal details</span>
            <h2>Edit account details</h2>
          </div>
        </div>
        <form class="form account-form" data-action="accountProfile">
          ${field("profileName", "User name", u.name || "", "text", "placeholder='Enter your name'")}
          ${field("profileEmail", "Email address", u.email || (u.contact.includes("@") ? u.contact : ""), "email", "placeholder='name@example.com'")}
          ${field("profilePhone", "Phone number", u.phone || (!u.contact.includes("@") ? u.contact : ""), "tel", "placeholder='+91 98765 43210'")}
          <button class="btn primary" type="submit">Save account details</button>
        </form>
        ${accountMessage()}
      </div>
      <div class="panel">
        <div class="card-heading">
          <div>
            <span>AI inputs</span>
            <h2>Update symptoms for AI</h2>
          </div>
        </div>
        ${accountSymptomsForm(u.symptoms)}
      </div>
    </div>
    ${symptomAiResult(insight)}
    <div class="grid profile-grid">
      ${profile("User ID", userId)}
      ${profile("User name", u.name || "Demo user")}
      ${profile("Email address", u.email || (u.contact.includes("@") ? u.contact : "Not added"))}
      ${profile("Phone number", u.phone || (!u.contact.includes("@") ? u.contact : "Not added"))}
      ${profile("Login contact", u.contact || "Not added")}
      ${profile(t("lastPeriod"), u.lastPeriod || "Not added")}
      ${profile(t("languageTitle"), languages.find(([code]) => code === state.language)?.[1])}
      ${profile("Total period logs", `${logs.length}`)}
      ${profile("Average period length", logs.length ? `${averagePeriodLength} days` : "Not enough logs")}
      ${profile("Known cycle lengths", cycleLengthText(u.cycleLengths))}
    </div>
    <div class="panel" style="margin-top:16px">
      <h2>Period log history</h2>
      ${periodLogHistory(logs)}
    </div>
    <div class="panel" style="margin-top:16px">
      <h2>${t("languageTitle")}</h2>
      <div class="choice-grid">${languages.map(([code, label]) => `<button class="choice ${state.language === code ? "active" : ""}" data-language="${code}">${label}</button>`).join("")}</div>
    </div>
  `;
}

function accountSymptomsForm(symptoms) {
  return `
    <form class="form symptoms-form" data-action="accountSymptoms">
      ${range("accountPain", "Pain level", symptoms.pain)}
      ${range("accountMood", "Mood changes", symptoms.mood)}
      ${range("accountFlow", "Flow intensity", symptoms.flow, 1, 5)}
      ${field("accountSleep", "Sleep hours", symptoms.sleep, "number", "min='0' max='14'")}
      ${range("accountStress", "Stress level", symptoms.stress)}
      <label>Lifestyle<select name="accountLifestyle">${lifestyleOptions.map((item) => `<option ${symptoms.lifestyle === item ? "selected" : ""}>${item}</option>`).join("")}</select></label>
      <div class="actions">
        ${check("accountAcne", "Acne", symptoms.acne)}
        ${check("accountFatigue", "Fatigue", symptoms.fatigue)}
        ${check("accountHeadaches", "Headaches", symptoms.headaches)}
      </div>
      <button class="btn primary" type="submit">Examine symptoms with AI</button>
    </form>
  `;
}

function symptomAiResult(insight) {
  const scores = insight.healthScores;
  const predictionValue = insight.prediction;
  const signals = predictionValue.symptomSignals || [];
  return `
    <div class="panel symptom-result">
      <div>
        <span class="ai-chip">${state.aiStatus === "cloud" ? "MongoDB AI updated" : "Local AI preview"}</span>
        <h2>AI symptom examination</h2>
        <p>${signals.length ? `Detected signals: ${signals.join(", ")}.` : "No strong symptom signal detected yet."}</p>
      </div>
      <div class="grid metric-grid">
        ${metric("PCOS signal", `${scores.pcosRisk}/100`, scores.pcosLevel || "low")}
        ${metric("PCOD signal", `${scores.pcodRisk ?? scores.pcosRisk}/100`, scores.pcodLevel || "low")}
        ${metric("Prediction confidence", `${predictionValue.confidence}%`, `${predictionValue.learnedFromCycles || 0} learned cycles`)}
      </div>
    </div>
  `;
}

function profile(label, value) {
  return `<div class="profile-row"><span>${label}</span><p>${value}</p></div>`;
}

function accountMessage() {
  if (!state.accountMessage) return "";
  const isError = state.accountMessage.toLowerCase().includes("error") || state.accountMessage.toLowerCase().includes("already");
  return `<div class="account-message ${isError ? "error" : "success"}">${state.accountMessage}</div>`;
}

function daysBetweenDates(start, end) {
  return Math.round((dateAtStart(end) - dateAtStart(start)) / 86400000);
}

function cycleLengthText(lengths) {
  const known = lengths.map(Number).filter(Boolean);
  return known.length ? `${known.join(", ")} days` : "Not added";
}

function periodLogHistory(logs) {
  if (!logs.length) {
    return `<p class="small">No period logs yet. Use the dashboard log button to add your first period start and end date.</p>`;
  }

  return `
    <div class="log-list">
      ${logs.slice(0, 5).map((log, index) => `
        <div class="log-item">
          <strong>Period ${logs.length - index}</strong>
          <span>${insightDate(log.start)} - ${insightDate(log.end)} · ${Math.max(1, daysBetweenDates(log.start, log.end) + 1)} days</span>
          <p>${log.notes || "No symptoms note added."}</p>
        </div>
      `).join("")}
    </div>
  `;
}

function periodModal() {
  return `
    <div class="modal-backdrop" data-click="closeModal">
      <div class="panel modal" data-stop>
        <h2>${t("logPeriod")}</h2>
        <form class="form" data-action="periodLog">
          ${field("start", t("startDate"), iso(new Date()), "date", "required")}
          ${field("end", t("endDate"), iso(new Date()), "date", "required")}
          <label>${t("notes")}<textarea name="notes"></textarea></label>
          <div class="actions">
            <button class="btn primary" type="submit">${t("save")}</button>
            <button class="btn ghost" type="button" data-click="closeModal">${t("back")}</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function aiReply(message) {
  const lower = message.toLowerCase();
  const { p, scores, cycleDay, phase, signals } = localCycleInsight();
  if (lower.includes("pcos") || lower.includes("pcod") || lower.includes("pocs")) {
    return `Your combined PCOS/PCOD awareness score is ${scores.combinedRisk}/100 (${scores.riskLevel}). PCOS signal: ${scores.pcosRisk}/100 (${scores.pcosLevel}). PCOD signal: ${scores.pcodRisk}/100 (${scores.pcodLevel}). Main signals: ${signals.length ? signals.join(", ") : "no major symptom signal logged"}. This is not a diagnosis, but repeated patterns are worth discussing with a clinician.`;
  }
  if (lower.includes("irregular") || lower.includes("late")) {
    return `Your predicted cycle length is ${p.cycleLength} days with ${p.confidence}% confidence. You are around cycle day ${cycleDay} in the ${phase} phase. Signals affecting timing: ${signals.length ? signals.join(", ") : "no major symptom signal logged"}.`;
  }
  if (lower.includes("food") || lower.includes("diet") || lower.includes("eat")) {
    return `For your ${phase} phase, focus on steady meals, protein, hydration, and iron-rich foods. If fatigue or cramps are present, log food and energy together so SAKHI can compare patterns over time.`;
  }
  if (lower.includes("pain") || lower.includes("cramp")) {
    return "For cramps, heat, hydration, gentle stretching, rest, and tracking pain intensity can help. Sudden severe pain, heavy bleeding, fever, or fainting needs medical attention.";
  }
  if (lower.includes("ovulation") || lower.includes("fertile")) {
    return `Ovulation is estimated around ${fmt(p.ovulation)}. Fertile window: ${fmt(p.fertileStart)} - ${fmt(p.fertileEnd)}. Confidence is ${p.confidence}%, so treat this as a planning estimate.`;
  }
  return `Based on your profile, next period is estimated around ${fmt(p.nextPeriod)}, ovulation around ${fmt(p.ovulation)}, and today looks like cycle day ${cycleDay} in the ${phase} phase.`;
}

function render() {
  const root = document.getElementById("app");
  if (state.screen === "app" && !api.token && !state.user.contact) {
    state.screen = "landing";
  }
  root.innerHTML = state.screen === "landing" ? landing() : state.screen === "language" ? languageScreen() : state.screen === "onboarding" ? onboarding() : appWorkspace();
  save();
}

document.addEventListener("click", (event) => {
  const language = event.target.closest("[data-language]");
  if (language) {
    state.language = language.dataset.language;
    render();
    return;
  }

  const sectionButton = event.target.closest("[data-section]");
  if (sectionButton) {
    state.section = sectionButton.dataset.section;
    if (state.section !== "insights") state.selectedArticle = "";
    if (state.section === "dashboard" || state.section === "chat") refreshAiInsight();
    if (state.section === "account") refreshAccountData();
    render();
    return;
  }

  const dateButton = event.target.closest("[data-date]");
  if (dateButton) {
    state.selectedDate = dateButton.dataset.date;
    render();
    return;
  }

  const articleButton = event.target.closest("[data-article]");
  if (articleButton) {
    state.selectedArticle = articleButton.dataset.article;
    render();
    return;
  }

  const action = event.target.closest("[data-click]")?.dataset.click;
  if (!action) return;
  if (action === "toggleAuth") state.authMode = state.authMode === "signup" ? "login" : "signup";
  if (action === "goOnboarding") state.screen = "onboarding";
  if (action === "goLanding") state.screen = "landing";
  if (action === "openPeriodModal") state.modal = "period";
  if (action === "closeModal") state.modal = null;
  if (action === "closeArticle") state.selectedArticle = "";
  if (action === "prevMonth") state.calendarMonthOffset -= 1;
  if (action === "nextMonth") state.calendarMonthOffset += 1;
  if (action === "logout") {
    localStorage.removeItem("sakhi-state");
    localStorage.removeItem("sakhi-token");
    api.token = "";
    state.user.name = "";
    state.user.contact = "";
    state.user.email = "";
    state.user.phone = "";
    state.user.lastPeriod = "";
    state.user.logs = [];
    state.aiInsight = null;
    state.aiStatus = "local";
    state.chat = [{ role: "assistant", text: "Hi, I am SAKHI. Ask me about your cycle, symptoms, food, stress, or PCOS signals." }];
    state.screen = "landing";
    state.section = "dashboard";
    state.modal = null;
  }
  render();
});

document.addEventListener("click", (event) => {
  if (event.target.closest("[data-stop]")) event.stopPropagation();
}, true);

document.addEventListener("input", (event) => {
  if (event.target.type === "range") {
    const output = document.querySelector(`[data-range-value="${event.target.name}"]`);
    if (output) output.textContent = event.target.value;
  }
});

document.addEventListener("submit", async (event) => {
  const form = event.target.closest("form");
  if (!form) return;
  event.preventDefault();
  const data = new FormData(form);
  const action = form.dataset.action;

  if (action === "auth") {
    const payload = {
      name: data.get("name") || state.user.name || "SAKHI user",
      contact: data.get("contact") || state.user.contact,
      password: data.get("password")
    };
    state.user.name = payload.name;
    state.user.contact = payload.contact;
    try {
      const result = await api.auth(state.authMode, payload);
      state.user.name = result.user.name || state.user.name;
      state.user.contact = result.user.contact || state.user.contact;
      state.user.email = result.user.email || (state.user.contact.includes("@") ? state.user.contact : state.user.email);
      state.user.phone = result.user.phone || (!state.user.contact.includes("@") ? state.user.contact : state.user.phone);
      state.user.cycleFactors = result.user.cycleFactors || state.user.cycleFactors;
      state.language = result.user.language || state.language;
      await refreshAiInsight();
    } catch (error) {
      console.warn("Backend auth unavailable, using local prototype mode:", error.message);
    }
    state.screen = "language";
  }

  if (action === "onboarding") {
    const payload = {
      language: state.language,
      lastPeriod: data.get("lastPeriod"),
      unknownCycles: data.has("unknownCycles"),
      cycleLengths: [data.get("cycle1"), data.get("cycle2"), data.get("cycle3")].map((value) => Number(value || 0)),
      symptoms: {
      pain: Number(data.get("pain")),
      mood: Number(data.get("mood")),
      flow: Number(data.get("flow")),
      acne: data.has("acne"),
      fatigue: data.has("fatigue"),
      headaches: data.has("headaches"),
      sleep: Number(data.get("sleep")),
      stress: Number(data.get("stress")),
      lifestyle: data.get("lifestyle")
      }
    };
    state.user.lastPeriod = payload.lastPeriod;
    state.user.unknownCycles = payload.unknownCycles;
    state.user.cycleLengths = payload.cycleLengths;
    state.user.symptoms = payload.symptoms;
    if (api.token) {
      try {
        await api.updateProfile(payload);
        await refreshAiInsight();
      } catch (error) {
        console.warn("Backend profile update unavailable, using local prototype mode:", error.message);
      }
    }
    state.screen = "app";
  }

  if (action === "accountProfile") {
    const email = String(data.get("profileEmail") || "").trim();
    const phone = String(data.get("profilePhone") || "").trim();
    if (!email && !phone) {
      state.accountMessage = "Error: add at least one contact method, email or phone.";
      render();
      return;
    }

    const payload = {
      name: String(data.get("profileName") || "").trim() || state.user.name,
      email,
      phone,
      contact: email || phone || state.user.contact
    };

    state.user.name = payload.name;
    state.user.email = payload.email;
    state.user.phone = payload.phone;
    state.user.contact = payload.contact;
    state.accountMessage = api.token ? "Saving account details..." : "Account details saved locally.";

    if (api.token) {
      try {
        const user = await api.updateProfile(payload);
        state.user.name = user.name || state.user.name;
        state.user.email = user.email || state.user.email;
        state.user.phone = user.phone || state.user.phone;
        state.user.contact = user.contact || state.user.contact;
        state.accountMessage = "Account details saved to MongoDB.";
      } catch (error) {
        console.warn("Backend account update unavailable, using local account data:", error.message);
        state.accountMessage = `Error: ${error.message}`;
      }
    }
  }

  if (action === "accountSymptoms") {
    const symptoms = {
      pain: Number(data.get("accountPain")),
      mood: Number(data.get("accountMood")),
      flow: Number(data.get("accountFlow")),
      acne: data.has("accountAcne"),
      fatigue: data.has("accountFatigue"),
      headaches: data.has("accountHeadaches"),
      sleep: Number(data.get("accountSleep")),
      stress: Number(data.get("accountStress")),
      lifestyle: data.get("accountLifestyle")
    };

    state.user.symptoms = symptoms;
    state.aiInsight = null;
    state.aiStatus = "local";

    if (api.token) {
      try {
        await api.updateProfile({ symptoms });
        await refreshAiInsight();
      } catch (error) {
        console.warn("Backend symptom update unavailable, using local AI mode:", error.message);
        alert(error.message);
      }
    }
  }

  if (action === "cycleFactors") {
    const cycleFactors = {
      stressLevel: data.get("stressLevel"),
      mood: data.get("factorMood"),
      dietQuality: data.get("dietQuality"),
      appetiteChange: data.get("appetiteChange"),
      weightChange: data.get("weightChange"),
      physicalActivity: data.get("physicalActivity"),
      suddenExerciseIncrease: data.get("suddenExerciseIncrease") === "Yes",
      sleepQuality: data.get("sleepQuality"),
      routineConsistency: data.get("routineConsistency") === "Yes",
      medicationsOrBirthControl: data.get("medicationsOrBirthControl") === "Yes",
      medicationsNote: String(data.get("medicationsNote") || "").trim(),
      healthConditions: data.get("healthConditions"),
      recentIllness: data.get("recentIllness") === "Yes",
      travelOrEnvironmentChange: data.get("travelOrEnvironmentChange") === "Yes",
      lifestyleHabits: String(data.get("lifestyleHabits") || "").trim()
    };

    state.user.cycleFactors = cycleFactors;
    state.aiInsight = null;
    state.aiStatus = "local";

    if (api.token) {
      try {
        await api.updateProfile({ cycleFactors });
        await refreshAiInsight();
      } catch (error) {
        console.warn("Backend cycle factors update unavailable, using local AI mode:", error.message);
        alert(error.message);
      }
    }
  }

  if (action === "periodLog") {
    const log = {
      start: data.get("start"),
      end: data.get("end"),
      symptoms: { notes: data.get("notes") }
    };
    state.user.logs.push({
      start: log.start,
      end: log.end,
      notes: log.symptoms.notes
    });
    state.user.lastPeriod = data.get("start");
    if (api.token) {
      try {
        await api.logPeriod(log);
        await refreshAiInsight();
      } catch (error) {
        console.warn("Backend period log unavailable, using local prototype mode:", error.message);
      }
    }
    state.modal = null;
  }

  if (action === "chat") {
    const message = String(data.get("message") || "").trim();
    if (message) {
      state.chat.push({ role: "user", text: message });
      let reply = aiReply(message);
      if (api.token) {
        try {
          const result = await api.chat(message);
          reply = result.reply;
          if (result.insight) {
            state.aiInsight = result.insight;
            state.aiStatus = "cloud";
          }
        } catch (error) {
          console.warn("Backend chat unavailable, using local prototype mode:", error.message);
        }
      }
      state.chat.push({ role: "assistant", text: reply, insight: state.aiInsight || frontendInsight() });
    }
  }

  render();
});

load();
render();
