"use strict";

/**
 * Existing Spring Boot API endpoints verified from backend controllers and SecurityConfig.
 */
const API = {
    reports: "/api/reports",
    trackReport: (id) => `/api/reports/track/${encodeURIComponent(id)}`,
    reportStatus: (id) => `/api/reports/${encodeURIComponent(id)}/status`,
    reportById: (id) => `/api/reports/${encodeURIComponent(id)}`,
    authStatus: "/api/auth/status",
    adminLogin: "/api/auth/login",
    adminLogout: "/api/auth/logout"
};

/**
 * Clearly separated integration point for Citizen authentication/registration.
 * Set enabled: true and wire endpoint URLs once backend citizen auth APIs are implemented.
 */
const CITIZEN_AUTH_INTEGRATION = {
    enabled: false,
    loginEndpoint: "/api/auth/citizen/login",
    registerEndpoint: "/api/auth/citizen/register",
    async login(email, password) {
        if (!this.enabled) {
            return {
                pending: true,
                message: "Citizen login API is not implemented in the backend yet. You can still submit a report and track it by Reference ID below."
            };
        }
        const response = await fetch(this.loginEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        return { pending: false, response };
    }
};

const AWARENESS_QUOTES = [
    "Think Before You Click.",
    "Your Password Is Your First Line of Defence.",
    "Stop. Think. Verify. Then Trust.",
    "Cyber Safety Is Everyone's Responsibility.",
    "Be Alert Today, Be Secure Tomorrow."
];

const CYBER_CRIME_CATEGORIES = [
    {
        id: "phishing",
        title: "Phishing",
        explanation: "Phishing is a scam where attackers send fake emails, SMS messages, or website links pretending to be your bank, delivery company, or government office to steal passwords or card details.",
        example: "An SMS reads: 'Your bank KYC expires tonight. Click bit.ly/kyc-bank-verify immediately to avoid account freeze,' leading to a fake login page.",
        howItHappens: "Attackers copy official logos and create look-alike web addresses (like paytm-verify-secure.xyz). Once you type your password, PIN, or card details, the form sends them straight to the scammer.",
        warningSigns: [
            "Urgent threats like 'Account suspended in 2 hours'.",
            "Slightly misspelled URLs or shortened links instead of official domains.",
            "Generic greetings ('Dear Customer') paired with requests for confidential info."
        ],
        prevention: [
            "Never tap links inside unexpected SMS or email messages.",
            "Open your bank's official mobile app or type the known website address directly.",
            "Check the full sender address and website domain carefully before entering credentials."
        ],
        victimAction: "Disconnect from the fake page immediately, change your banking/email passwords from a clean device, and notify your bank to block compromised cards.",
        reporting: "Select 'Phishing' in the report form below with the fake URL/message screenshot. In India, also call 1930 or report at https://cybercrime.gov.in for financial loss."
    },
    {
        id: "upi-fraud",
        title: "UPI and Online Payment Fraud",
        explanation: "Fraudsters trick victims into authorizing outgoing UPI transfers or scanning payment QR codes under the false promise of receiving money, refunds, or prizes.",
        example: "While selling an old sofa online, a buyer sends a QR code saying 'Scan this and enter your UPI PIN to receive Rs. 5,000 advance.'",
        howItHappens: "In UPI, entering your PIN always authorizes money leaving your account. Scammers send 'Collect Requests' or payment QR codes disguised as cashback or buyer advances.",
        warningSigns: [
            "Anyone asking you to enter your UPI PIN or scan a QR code to receive money.",
            "Unexpected 'Collect Money' pop-ups inside Google Pay, PhonePe, or Paytm.",
            "Fake payment screenshots sent by buyers pushing you to ship items quickly."
        ],
        prevention: [
            "Remember: you NEVER need to enter a UPI PIN or scan a QR code to receive funds.",
            "Always confirm actual bank credit SMS/balance inside your app before handing over goods.",
            "Decline unknown UPI collect requests immediately."
        ],
        victimAction: "Alert your bank and UPI app support right away, note the 12-digit UTR/transaction ID, and preserve chat/QR screenshots.",
        reporting: "Call 1930 immediately in India (golden hour for freezing funds) and file at https://cybercrime.gov.in, plus log it here under 'UPI and Online Payment Fraud'."
    },
    {
        id: "identity-theft",
        title: "Identity Theft",
        explanation: "Identity theft happens when someone steals your personal documents or details—such as Aadhaar, PAN, passport, photos, or bank data—to open accounts, take loans, or commit crimes in your name.",
        example: "A victim discovers an unknown loan or mobile SIM card registered using scanned copies of their PAN and Aadhaar shared earlier on an unverified portal.",
        howItHappens: "Criminals collect leaked ID photos from public social media posts, fake KYC forms, or unsecured cybercafe computers and reuse them for impersonation or credit fraud.",
        warningSigns: [
            "Unfamiliar loan inquiries or credit alerts on your credit report.",
            "Bills, OTPs, or welcome letters for accounts you never opened.",
            "Unexpected alerts about new SIM cards or tax filings."
        ],
        prevention: [
            "Avoid uploading ID card photos to social media or unverified websites.",
            "Use masked Aadhaar where full Aadhaar numbers are not required, and lock biometrics when unused.",
            "Review your bank statements and credit score periodically."
        ],
        victimAction: "File a police/cyber complaint immediately so you have proof you did not authorize those accounts, and contact affected banks or credit bureaus to flag fraud.",
        reporting: "Report on https://cybercrime.gov.in and submit details under 'Identity Theft' in this portal with dates and affected document types."
    },
    {
        id: "malware-ransomware",
        title: "Malware and Ransomware",
        explanation: "Malware is harmful software that secretly spies on your device or steals data; ransomware locks or encrypts your files and demands money to unlock them.",
        example: "Downloading a 'free cracked video editor' from an unknown site locks every photo and project folder with a '.locked' extension and displays a ransom note.",
        howItHappens: "Infections typically arrive through pirated software, suspicious email attachments (.zip, .exe, .apk), or fake browser 'update required' pop-ups.",
        warningSigns: [
            "Files suddenly fail to open or get strange new file extensions.",
            "Device slows down dramatically, overheats, or opens random ads.",
            "Antivirus software turns off by itself."
        ],
        prevention: [
            "Install software and mobile apps only from official stores or verified vendor websites.",
            "Keep regular offline backups (external drive) of irreplaceable documents and photos.",
            "Keep your operating system and browser updated."
        ],
        victimAction: "Disconnect the infected computer/phone from Wi-Fi and internet to stop spreading. Do not pay ransom—paying does not guarantee recovery.",
        reporting: "Preserve photos of the ransom note or suspicious installer file and report under 'Malware and Ransomware' on this portal and https://cybercrime.gov.in."
    },
    {
        id: "cyberbullying",
        title: "Cyberbullying",
        explanation: "Cyberbullying is repeated harassment, humiliation, threats, or spreading rumors/private photos against someone using social media, messaging apps, or forums.",
        example: "Classmates create a group chat mocking a student with edited photos and post hurtful comments across Instagram every day.",
        howItHappens: "Bullies hide behind anonymous accounts or group chats to intimidate victims, often escalating when the target responds emotionally.",
        warningSigns: [
            "Repeated abusive DMs, hateful comments, or humiliating memes targeting one person.",
            "Spreading private screenshots or false rumors online.",
            "Coordinated trolling or exclusion from digital groups."
        ],
        prevention: [
            "Set social media profiles to private and restrict who can message or tag you.",
            "Never share sensitive personal photos or secrets online that could be misused.",
            "Use platform mute, block, and abuse-reporting tools early."
        ],
        victimAction: "Do not retaliate. Take full screenshots (showing usernames, URLs, and timestamps), block the accounts, and talk to a trusted parent, teacher, or counselor.",
        reporting: "Report inside the social app first, then report under 'Cyberbullying' here or at https://cybercrime.gov.in (women/children cyber helpline options available)."
    },
    {
        id: "fake-profiles",
        title: "Fake Profiles and Impersonation",
        explanation: "Scammers copy your name, profile photo, and bio to create a duplicate social media or WhatsApp account and trick your friends or colleagues into sending money.",
        example: "Your friend receives a WhatsApp message from a new number using your photo: 'I am stuck at a hospital with no UPI working, please send Rs. 4,000 urgently.'",
        howItHappens: "Attackers scrape public profile pictures from Facebook, Instagram, or LinkedIn and message people on your public friend list claiming an emergency.",
        warningSigns: [
            "A friend/boss messages from a 'new number' asking for urgent gift cards or money.",
            "Duplicate account sending fresh friend requests to people already connected to you.",
            "Excuses like 'My microphone is broken, don't call—just transfer fast.'"
        ],
        prevention: [
            "Lock your Facebook/Instagram profile photos and hide your public friend list.",
            "Always verify urgent money requests by calling the person on their original saved number.",
            "Warn contacts immediately if you hear someone is impersonating you."
        ],
        victimAction: "Alert your contacts via your real account, capture screenshots and profile URLs of the fake account, and report impersonation to the platform.",
        reporting: "Submit the fake profile link and chat evidence under 'Fake Profiles and Impersonation' here and report at https://cybercrime.gov.in."
    },
    {
        id: "online-shopping-fraud",
        title: "Online Shopping Fraud",
        explanation: "Fake online stores, social media sellers, or classifieds listings take advance payment for heavily discounted gadgets, clothes, or pets and then block the buyer or deliver junk.",
        example: "An Instagram ad sells brand-new branded sneakers for 80% off via prepaid UPI only; after payment, the seller blocks the buyer and deletes comments.",
        howItHappens: "Scammers run polished ads using stolen product photos and fake customer reviews, insist on prepaid UPI/bank transfer instead of Cash on Delivery, and vanish.",
        warningSigns: [
            "Prices that are unrealistically cheap (70–90% off flagship products).",
            "No Cash on Delivery, no verifiable business address, and no real return policy.",
            "Pressure to pay via direct personal UPI rather than a recognized checkout gateway."
        ],
        prevention: [
            "Shop from established marketplaces or verify the domain age and reviews independently.",
            "Prefer Cash on Delivery or credit cards/secure gateways with buyer protection for unfamiliar stores.",
            "Check seller contact details and avoid paying individuals for social media ads."
        ],
        victimAction: "Save the website URL, ad link, seller phone/UPI ID, and payment receipt, then contact your bank immediately to dispute the transaction.",
        reporting: "Call 1930 (India) for financial recovery, file on https://cybercrime.gov.in, and submit a record here under 'Online Shopping Fraud'."
    },
    {
        id: "otp-fraud",
        title: "Social Engineering and OTP Fraud",
        explanation: "Social engineering manipulates human trust or fear—pretending to be a courier, bank agent, or relative—to make you read out an OTP or install a screen-sharing app.",
        example: "A caller pretending to be a courier agent says: 'Your parcel is held; share the 6-digit confirmation code sent to your phone to reschedule delivery.'",
        howItHappens: "While talking to you, the scammer triggers a login, SIM activation, or bank transfer that sends a real OTP to your phone, then convinces you it is just a 'verification code'.",
        warningSigns: [
            "Caller asks for an OTP, CVV, or asks you to install AnyDesk, TeamViewer, or QuickSupport.",
            "High urgency, friendliness, or fear ('Your electricity disconnects in 30 minutes').",
            "Caller insists you stay on the line while checking SMS."
        ],
        prevention: [
            "Read every OTP SMS completely—it clearly states what transaction or login it authorizes.",
            "Never read OTPs aloud to anyone or install remote-access apps for strangers.",
            "Hang up and call the official customer care number printed on your card or official site."
        ],
        victimAction: "End the call immediately, uninstall any remote-control app, freeze your bank account/cards via official helpline, and change account passwords.",
        reporting: "Dial 1930 right away if money was debited, report at https://cybercrime.gov.in, and log the caller number under 'Social Engineering and OTP Fraud'."
    },
    {
        id: "data-breach",
        title: "Data Theft and Data Breaches",
        explanation: "A data breach occurs when hackers steal confidential databases (emails, passwords, addresses, medical or financial records) from a company, school, or app server.",
        example: "Hackers exploit an unpatched website database and leak 50,000 customer emails and weakly protected passwords on underground forums.",
        howItHappens: "Attackers break into poorly secured servers, misconfigured cloud storage, or steal insider credentials, then sell the stolen user lists to other scammers.",
        warningSigns: [
            "Security notice from a service you use warning of unauthorized data access.",
            "Sudden spike in targeted spam using your exact full name and address.",
            "Login alerts on unrelated websites where you reused the same password."
        ],
        prevention: [
            "Never reuse the same password across multiple websites.",
            "Enable Two-Factor Authentication (2FA) so leaked passwords alone cannot unlock accounts.",
            "Check breach notification services periodically and rotate exposed passwords."
        ],
        victimAction: "Change your password immediately on the breached site AND every other site where you used that password; enable 2FA.",
        reporting: "Notify the organization's security team, monitor financial statements, and report unauthorized misuse under 'Data Theft and Data Breaches'."
    },
    {
        id: "job-scams",
        title: "Job and Employment Scams",
        explanation: "Fraudsters post fake work-from-home, data entry, or 'like-and-earn' task jobs to steal registration fees, deposit money, or personal identity documents.",
        example: "A Telegram message offers Rs. 3,000/day for liking YouTube videos; after paying initial small rewards, it demands Rs. 25,000 to unlock 'VIP task earnings'.",
        howItHappens: "Scammers build false trust by paying Rs. 150–300 for tiny starter tasks, then trap victims into depositing larger sums for 'prepaid tasks' that can never be withdrawn.",
        warningSigns: [
            "Asking candidates to pay a 'registration', 'laptop deposit', or 'task recharge' fee.",
            "Unrealistic daily pay for effortless tasks via Telegram/WhatsApp.",
            "Interviews conducted solely over chat using Gmail/Outlook instead of company domains."
        ],
        prevention: [
            "Legitimate employers never charge money to give you a job.",
            "Verify job openings directly on the official company's careers website.",
            "Never join paid 'task groups' promising guaranteed returns."
        ],
        victimAction: "Stop sending further money immediately—do not pay extra 'tax' or 'unlock fees' to recover trapped money. Save all chat logs and bank details.",
        reporting: "Call 1930 in India for financial loss, report at https://cybercrime.gov.in, and submit the recruiter details under 'Job and Employment Scams'."
    },
    {
        id: "investment-scams",
        title: "Online Investment Scams",
        explanation: "Fake trading apps, WhatsApp stock-tip groups, and crypto/forex schemes show fabricated profit dashboards to persuade victims to invest life savings, then block withdrawals.",
        example: "A victim is added to a 'VIP Stock Advisory' WhatsApp group, installs an unofficial trading APK showing 300% profit, and cannot withdraw funds without paying a '20% tax'.",
        howItHappens: "Scammers impersonate well-known financial analysts, control fake app balances on their own server, and keep demanding extra 'withdrawal/tax fees' until the victim runs out of money.",
        warningSigns: [
            "Guaranteed high returns (e.g., 'Double money in 15 days' or 'Zero-risk 10% daily').",
            "Asking you to download trading apps via APK links instead of official app stores.",
            "Demanding upfront 'taxes' or 'verification deposits' before allowing withdrawals."
        ],
        prevention: [
            "Invest only through regulated brokers and official platforms (SEBI-registered in India).",
            "Be skeptical of unsolicited WhatsApp/Telegram investment groups.",
            "Remember that legitimate brokers deduct taxes automatically or via tax filing—not via personal UPI transfers."
        ],
        victimAction: "Cease all deposits immediately, preserve bank transfer proofs and app screenshots, and alert your bank.",
        reporting: "Call 1930 immediately, report at https://cybercrime.gov.in, and document the scheme under 'Online Investment Scams'."
    },
    {
        id: "loan-app-fraud",
        title: "Loan App Fraud",
        explanation: "Unregistered instant loan apps offer quick loans with zero paperwork, steal the user's phone contacts and gallery, charge extreme interest, and harass contacts if unpaid.",
        example: "After installing an instant loan APK, a user receives Rs. 3,000 for 7 days, is asked to repay Rs. 5,500, and faces threatening calls sent to their family contact list.",
        howItHappens: "During installation, predatory apps demand access to Contacts, Storage/Gallery, and Location. They upload private data to extortion servers before disbursing small sums.",
        warningSigns: [
            "Loan apps downloaded via links/APKs outside Google Play Store or without RBI-registered NBFC details.",
            "Unreasonably short repayment periods (5–7 days) with huge hidden fees.",
            "App asks for access to your photos, contacts, and call logs."
        ],
        prevention: [
            "Borrow only from RBI-authorized banks/NBFCs and official verified apps.",
            "Never grant contact list or photo gallery permissions to finance apps unless genuinely required.",
            "Check app reviews and registered lender information before applying."
        ],
        victimAction: "Do not give in to blackmail. Save threatening messages, UPI IDs, and app details; inform trusted family members about potential spam calls.",
        reporting: "Report predatory loan apps to https://cybercrime.gov.in, call 1930 if money was extorted, and log details under 'Loan App Fraud'."
    },
    {
        id: "sextortion",
        title: "Sextortion",
        explanation: "Sextortion is online blackmail where criminals record or fabricate intimate video calls or private images and threaten to share them with family or followers unless paid.",
        example: "A stranger initiates a friendly video call on social media, plays a recorded explicit clip to capture the victim's face alongside it, and demands Rs. 20,000 not to post it.",
        howItHappens: "Scammers lure targets via fake profiles, quickly move to video calls or private chats, record the screen, and immediately threaten to message the victim's followers.",
        warningSigns: [
            "Unknown attractive profiles rushing to video call or exchange private photos.",
            "Sudden threats demanding money within minutes to 'delete the video'.",
            "Screenshots showing your friend list alongside blackmail demands."
        ],
        prevention: [
            "Never accept video calls from strangers or share intimate images online.",
            "Keep social media friend/follower lists private.",
            "Cover or disable camera permissions for unfamiliar chat apps."
        ],
        victimAction: "Do NOT pay—paying almost always triggers bigger demands. Lock your social accounts, block the scammer, preserve screenshots/payment handles, and seek support.",
        reporting: "Report immediately at https://cybercrime.gov.in (you can report anonymously/confidentially) and log evidence under 'Sextortion'."
    },
    {
        id: "sim-swapping",
        title: "SIM Swapping",
        explanation: "In SIM swapping, attackers trick your mobile carrier into transferring your phone number onto their own SIM card so they receive all your banking and email OTPs.",
        example: "Your phone suddenly shows 'No Service' / 'Emergency Calls Only' for hours, and meanwhile money is transferred out of your bank account.",
        howItHappens: "Using stolen ID details or social engineering at a telecom store, scammers request a replacement SIM claiming their phone was lost, hijacking your number.",
        warningSigns: [
            "Sudden unexplained loss of mobile network signal while other phones nearby work fine.",
            "SMS alert from your telecom provider about a SIM upgrade/swap you never requested.",
            "Sudden inability to log into email or banking accounts."
        ],
        prevention: [
            "Set a telecom account PIN/lock if your carrier supports it.",
            "Prefer authenticator apps (like Google/Microsoft Authenticator) over SMS OTP wherever possible.",
            "Never share SIM numbers, PUK codes, or ID documents casually."
        ],
        victimAction: "Immediately call your mobile operator from another phone to block the swapped SIM and freeze your bank accounts right away.",
        reporting: "Call 1930 immediately if bank funds are affected, file at https://cybercrime.gov.in, and log under 'SIM Swapping'."
    },
    {
        id: "cyberstalking",
        title: "Cyberstalking",
        explanation: "Cyberstalking is persistent online monitoring, tracking, unwanted contact, or threats against a person using location sharing, spyware, or repeated accounts.",
        example: "An ex-acquaintance creates new accounts every week after being blocked, tracks the victim's daily check-ins, and sends threatening messages.",
        howItHappens: "Stalkers exploit public location tags, leaked passwords, shared family accounts, or stalkerware apps installed secretly on a phone.",
        warningSigns: [
            "Someone knows your live location or private conversations without being told.",
            "Repeated contact from newly created accounts after you block them.",
            "Unfamiliar apps or unknown logged-in devices on your Google/Apple account."
        ],
        prevention: [
            "Turn off automatic location tagging on photos and social posts.",
            "Audit active sessions on your email/social accounts and remove unrecognized devices.",
            "Protect phones with a strong screen lock and never share passwords."
        ],
        victimAction: "Log every incident with dates and screenshots, check your device for unfamiliar apps/shared location settings, and inform local police/trusted people.",
        reporting: "Report at https://cybercrime.gov.in or your local police cyber cell, and record the details under 'Cyberstalking' here."
    },
    {
        id: "email-spoofing",
        title: "Email Spoofing",
        explanation: "Email spoofing forges the 'From' display name or email header so a scam email appears to come from your boss, university principal, or a trusted company.",
        example: "An employee receives an email displaying the CEO's name asking them to urgently buy 10 gift cards or wire vendor payment to a new bank account.",
        howItHappens: "Basic email headers can be forged if domains lack strict SPF/DKIM/DMARC protections, or attackers register look-alike domains (e.g., 'company-support.com').",
        warningSigns: [
            "Display name matches someone you know, but the actual email address or Reply-To domain is different.",
            "Unusual request for secrecy, urgent bank changes, or gift cards.",
            "Tone or signature differs from how that person normally writes."
        ],
        prevention: [
            "Always click/expand the sender header to verify the real email address, not just the display name.",
            "Verify payment or bank-detail changes via a phone call or separate trusted channel.",
            "Do not open unexpected attachments from unverified senders."
        ],
        victimAction: "Do not reply or click links. Warn colleagues/classmates, mark the message as phishing, and save the full email headers.",
        reporting: "Forward details to your organization's IT team and report under 'Email Spoofing' here (plus 1930 / https://cybercrime.gov.in if money was sent)."
    },
    {
        id: "website-hacking",
        title: "Website Hacking and Defacement",
        explanation: "Attackers break into a website's admin panel or server to change its visible pages (defacement), inject scam redirects, or steal user data.",
        example: "A college club website suddenly displays political slogans or redirects visitors to a malicious download page because an outdated plugin had a weak password.",
        howItHappens: "Hackers exploit weak admin passwords ('admin/admin123'), outdated CMS plugins, or coding flaws like SQL injection to gain server control.",
        warningSigns: [
            "Homepage content replaced with unfamiliar banners or spam links.",
            "Browsers display 'Deceptive site ahead' warnings on your site.",
            "Unknown administrator accounts or unexpected files appear on the server."
        ],
        prevention: [
            "Keep CMS software, themes, plugins, and frameworks patched and updated.",
            "Use strong, unique admin passwords with 2FA and restrict admin panel access.",
            "Keep regular verified backups and sanitize all database inputs."
        ],
        victimAction: "Take the compromised site into maintenance mode, preserve server access logs, rotate all server/database passwords, and restore from a clean backup.",
        reporting: "Report severe incidents to CERT-In / https://cybercrime.gov.in and document the attack under 'Website Hacking and Defacement'."
    },
    {
        id: "online-gaming-scams",
        title: "Online Gaming Scams",
        explanation: "Scammers target gamers with fake 'free skins/diamonds/UC' generators, rigged account trades, or phishing links asking for Steam, Google, or game login details.",
        example: "A teammate sends a link promising 'Free Tournament Pass—log in with your game account,' which steals the player's account and sells their inventory.",
        howItHappens: "Fraudsters use in-game chat or Discord links promising rare items, discounted currency, or account boosting, then hijack linked Google/Apple/gaming accounts.",
        warningSigns: [
            "Promises of free in-game currency, mod APKs, or cheat tools.",
            "Strangers asking to 'borrow' your account or trade outside official game marketplaces.",
            "External websites asking for your gaming or email login password."
        ],
        prevention: [
            "Buy game currency only inside the official game store.",
            "Enable 2FA on your gaming, Steam, Google Play, and Apple accounts.",
            "Never share your game login credentials or install unofficial 'mod' APKs."
        ],
        victimAction: "Recover your linked email/gaming account immediately via official support, revoke unknown logins, and alert your bank if unauthorized card charges occurred.",
        reporting: "Report financial theft via 1930 and https://cybercrime.gov.in, and submit the incident under 'Online Gaming Scams' here."
    }
];

const SAFETY_TIPS = [
    {
        title: "Password Protection",
        icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
        points: [
            "Use long passphrases (12+ characters) mixing letters, numbers, and symbols.",
            "Never reuse your email or banking password on other websites.",
            "Avoid personal info like birthdays, phone numbers, or '123456'."
        ]
    },
    {
        title: "Two-Factor Authentication (2FA)",
        icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
        points: [
            "Turn on 2FA for email, banking, WhatsApp, and social accounts.",
            "Use an authenticator app instead of SMS OTP when offered.",
            "Save backup recovery codes safely offline."
        ]
    },
    {
        title: "UPI & Payment Safety",
        icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
        points: [
            "You NEVER enter a UPI PIN or scan a QR code to receive money.",
            "Verify the receiver name on screen before entering your PIN.",
            "Set sensible daily UPI transaction limits in your banking app."
        ]
    },
    {
        title: "Social Media Privacy",
        icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
        points: [
            "Keep your profile, photos, and friend list private.",
            "Never post Aadhaar, PAN, boarding passes, or home addresses publicly.",
            "Verify urgent money requests from friends by calling them directly."
        ]
    },
    {
        title: "Safe Browsing",
        icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9",
        points: [
            "Look for HTTPS and check the exact spelling of the website domain.",
            "Close pop-ups claiming your device has a virus or won a prize.",
            "Avoid downloading cracked software, movies, or APKs from untrusted sites."
        ]
    },
    {
        title: "Public Wi-Fi Safety",
        icon: "M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0",
        points: [
            "Avoid net banking or typing sensitive passwords on free cafe/airport Wi-Fi.",
            "Turn off auto-connect to open Wi-Fi networks on your phone.",
            "Prefer mobile data for financial transactions when away from home."
        ]
    },
    {
        title: "Email Security",
        icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
        points: [
            "Inspect the actual sender email address—not just the display name.",
            "Never open unexpected .zip, .html, .exe, or macro-enabled attachments.",
            "Treat urgent password-reset or invoice emails with healthy skepticism."
        ]
    },
    {
        title: "Mobile Security",
        icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
        points: [
            "Install apps only from Google Play Store or Apple App Store.",
            "Review permissions—a flashlight or game does not need Contacts or SMS.",
            "Keep OS updates installed and lock your screen with PIN/biometrics."
        ]
    }
];

/* DOM References */
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navLinks = document.getElementById("navLinks");
const headerAdminBadge = document.getElementById("headerAdminBadge");
const headerAdminName = document.getElementById("headerAdminName");
const headerLogoutBtn = document.getElementById("headerLogoutBtn");

const quoteText = document.getElementById("quoteText");
const quoteDots = document.getElementById("quoteDots");
const prevQuoteBtn = document.getElementById("prevQuoteBtn");
const nextQuoteBtn = document.getElementById("nextQuoteBtn");

const categorySearchInput = document.getElementById("categorySearchInput");
const categoryCountLabel = document.getElementById("categoryCountLabel");
const categoriesGrid = document.getElementById("categoriesGrid");
const noCategoriesMsg = document.getElementById("noCategoriesMsg");
const safetyTipsGrid = document.getElementById("safetyTipsGrid");

const categoryModal = document.getElementById("categoryModal");
const modalCategoryTag = document.getElementById("modalCategoryTag");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalCloseFooterBtn = document.getElementById("modalCloseFooterBtn");
const modalReportBtn = document.getElementById("modalReportBtn");

const reportForm = document.getElementById("reportForm");
const submitReportBtn = document.getElementById("submitReportBtn");
const formBanner = document.getElementById("formBanner");
const crimeTypeSelect = document.getElementById("crimeType");

const trackForm = document.getElementById("trackForm");
const trackIdInput = document.getElementById("trackIdInput");
const trackError = document.getElementById("trackError");
const trackBtn = document.getElementById("trackBtn");
const trackResult = document.getElementById("trackResult");

const citizenLoginForm = document.getElementById("citizenLoginForm");
const citizenEmail = document.getElementById("citizenEmail");
const citizenPassword = document.getElementById("citizenPassword");
const citizenEmailErr = document.getElementById("citizenEmailErr");
const citizenPasswordErr = document.getElementById("citizenPasswordErr");
const citizenBanner = document.getElementById("citizenBanner");
const citizenLoginBtn = document.getElementById("citizenLoginBtn");

const adminLoginView = document.getElementById("adminLoginView");
const adminDashboardView = document.getElementById("adminDashboardView");
const adminLoginForm = document.getElementById("adminLoginForm");
const adminUsername = document.getElementById("adminUsername");
const adminPassword = document.getElementById("adminPassword");
const adminUserErr = document.getElementById("adminUserErr");
const adminPassErr = document.getElementById("adminPassErr");
const adminLoginBanner = document.getElementById("adminLoginBanner");
const adminLoginBtn = document.getElementById("adminLoginBtn");
const dashUsername = document.getElementById("dashUsername");
const dashLogoutBtn = document.getElementById("dashLogoutBtn");

const statTotal = document.getElementById("statTotal");
const statPending = document.getElementById("statPending");
const statUnderReview = document.getElementById("statUnderReview");
const statResolved = document.getElementById("statResolved");
const adminSearchInput = document.getElementById("adminSearchInput");
const filterStatus = document.getElementById("filterStatus");
const filterCrimeType = document.getElementById("filterCrimeType");
const resetFiltersBtn = document.getElementById("resetFiltersBtn");
const reportsList = document.getElementById("reportsList");

let currentQuoteIndex = 0;
let quoteTimerId = null;
let activeModalCategory = null;
let lastFocusedBeforeModal = null;
let isAdminLoggedIn = false;
let loadedReports = [];

/* Mobile Menu */
mobileMenuBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        mobileMenuBtn.setAttribute("aria-expanded", "false");
    });
});

/* Rotating Quotes */
function renderQuote(index) {
    currentQuoteIndex = (index + AWARENESS_QUOTES.length) % AWARENESS_QUOTES.length;
    quoteText.textContent = `"${AWARENESS_QUOTES[currentQuoteIndex]}"`;

    quoteDots.textContent = "";
    AWARENESS_QUOTES.forEach((_, idx) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = `quote-dot${idx === currentQuoteIndex ? " active" : ""}`;
        dot.setAttribute("aria-label", `Show quote ${idx + 1}`);
        dot.setAttribute("aria-selected", String(idx === currentQuoteIndex));
        dot.addEventListener("click", () => {
            renderQuote(idx);
            restartQuoteRotation();
        });
        quoteDots.appendChild(dot);
    });
}

function restartQuoteRotation() {
    if (quoteTimerId) clearInterval(quoteTimerId);
    quoteTimerId = setInterval(() => renderQuote(currentQuoteIndex + 1), 5000);
}

prevQuoteBtn.addEventListener("click", () => {
    renderQuote(currentQuoteIndex - 1);
    restartQuoteRotation();
});

nextQuoteBtn.addEventListener("click", () => {
    renderQuote(currentQuoteIndex + 1);
    restartQuoteRotation();
});

/* Render 18 Cyber Crime Awareness Cards + Search */
function renderCategories(query = "") {
    const term = query.trim().toLowerCase();
    const matches = CYBER_CRIME_CATEGORIES.filter((cat) => {
        if (!term) return true;
        const searchable = [
            cat.title,
            cat.explanation,
            cat.example,
            cat.howItHappens,
            ...cat.warningSigns,
            ...cat.prevention
        ].join(" ").toLowerCase();
        return searchable.includes(term);
    });

    categoryCountLabel.textContent = `Showing ${matches.length} of ${CYBER_CRIME_CATEGORIES.length} categories`;
    categoriesGrid.textContent = "";
    noCategoriesMsg.classList.toggle("hidden", matches.length > 0);

    matches.forEach((cat) => {
        const origIndex = CYBER_CRIME_CATEGORIES.indexOf(cat) + 1;
        const card = document.createElement("article");
        card.className = "crime-card";

        const top = document.createElement("div");
        top.className = "crime-card-top";

        const num = document.createElement("span");
        num.className = "crime-index";
        num.textContent = `Category #${origIndex}`;
        top.appendChild(num);

        const title = document.createElement("h3");
        title.textContent = cat.title;

        const summary = document.createElement("p");
        summary.className = "crime-summary";
        summary.textContent = cat.explanation;

        const example = document.createElement("p");
        example.className = "crime-example";
        const exLabel = document.createElement("strong");
        exLabel.textContent = "Example: ";
        example.appendChild(exLabel);
        example.appendChild(document.createTextNode(cat.example));

        const actions = document.createElement("div");
        actions.className = "crime-card-actions";

        const readMoreBtn = document.createElement("button");
        readMoreBtn.type = "button";
        readMoreBtn.className = "btn btn-navy btn-sm";
        readMoreBtn.textContent = "Read More";
        readMoreBtn.addEventListener("click", () => openCategoryModal(cat, readMoreBtn));

        const reportBtn = document.createElement("button");
        reportBtn.type = "button";
        reportBtn.className = "btn btn-secondary btn-sm";
        reportBtn.textContent = "Report This";
        reportBtn.addEventListener("click", () => jumpToReportWithCategory(cat.title));

        actions.appendChild(readMoreBtn);
        actions.appendChild(reportBtn);

        card.appendChild(top);
        card.appendChild(title);
        card.appendChild(summary);
        card.appendChild(example);
        card.appendChild(actions);

        categoriesGrid.appendChild(card);
    });
}

function createDetailBlock(heading, content, isList = false) {
    const block = document.createElement("div");
    block.className = "detail-block";

    const h4 = document.createElement("h4");
    h4.textContent = heading;
    block.appendChild(h4);

    if (isList) {
        const ul = document.createElement("ul");
        content.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item;
            ul.appendChild(li);
        });
        block.appendChild(ul);
    } else {
        const p = document.createElement("p");
        p.textContent = content;
        block.appendChild(p);
    }
    return block;
}

function openCategoryModal(category, triggerEl) {
    activeModalCategory = category;
    lastFocusedBeforeModal = triggerEl || document.activeElement;

    const index = CYBER_CRIME_CATEGORIES.indexOf(category) + 1;
    modalCategoryTag.textContent = `Cyber Crime Category #${index}`;
    modalTitle.textContent = category.title;

    modalBody.textContent = "";
    modalBody.appendChild(createDetailBlock("Clear Explanation", category.explanation));
    modalBody.appendChild(createDetailBlock("Realistic Example", category.example));
    modalBody.appendChild(createDetailBlock("How the Crime Happens", category.howItHappens));
    modalBody.appendChild(createDetailBlock("Common Warning Signs", category.warningSigns, true));
    modalBody.appendChild(createDetailBlock("Prevention Methods", category.prevention, true));
    modalBody.appendChild(createDetailBlock("What to Do If You Become a Victim", category.victimAction));
    modalBody.appendChild(createDetailBlock("Where and How to Report It", category.reporting));

    categoryModal.classList.remove("hidden");
    closeModalBtn.focus();
}

function closeCategoryModal() {
    categoryModal.classList.add("hidden");
    activeModalCategory = null;
    if (lastFocusedBeforeModal && typeof lastFocusedBeforeModal.focus === "function") {
        lastFocusedBeforeModal.focus();
    }
}

closeModalBtn.addEventListener("click", closeCategoryModal);
modalCloseFooterBtn.addEventListener("click", closeCategoryModal);
categoryModal.addEventListener("click", (event) => {
    if (event.target === categoryModal) closeCategoryModal();
});
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !categoryModal.classList.contains("hidden")) {
        closeCategoryModal();
    }
});

modalReportBtn.addEventListener("click", () => {
    const title = activeModalCategory ? activeModalCategory.title : "";
    closeCategoryModal();
    jumpToReportWithCategory(title);
});

function jumpToReportWithCategory(categoryTitle) {
    if (categoryTitle) {
        crimeTypeSelect.value = categoryTitle;
    }
    document.getElementById("report-portal").scrollIntoView({ behavior: "smooth" });
    document.getElementById("reporterName").focus({ preventScroll: true });
}

categorySearchInput.addEventListener("input", () => renderCategories(categorySearchInput.value));

/* Render 8 Practical Safety Tips */
function renderSafetyTips() {
    safetyTipsGrid.textContent = "";
    SAFETY_TIPS.forEach((tip) => {
        const card = document.createElement("article");
        card.className = "tip-card";

        const iconWrap = document.createElement("div");
        iconWrap.className = "tip-icon-wrap";
        iconWrap.setAttribute("aria-hidden", "true");

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("width", "22");
        svg.setAttribute("height", "22");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-width", "2");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", tip.icon);
        svg.appendChild(path);
        iconWrap.appendChild(svg);

        const h3 = document.createElement("h3");
        h3.textContent = tip.title;

        const ul = document.createElement("ul");
        ul.className = "tip-list";
        tip.points.forEach((pt) => {
            const li = document.createElement("li");
            li.textContent = pt;
            ul.appendChild(li);
        });

        card.appendChild(iconWrap);
        card.appendChild(h3);
        card.appendChild(ul);
        safetyTipsGrid.appendChild(card);
    });
}

/* Shared Banner Helpers */
function showBanner(el, msg, type) {
    el.textContent = msg;
    el.className = `status-banner ${type}`;
}

function hideBanner(el) {
    el.textContent = "";
    el.className = "status-banner hidden";
}

/* Report Submission (POST /api/reports) */
function clearReportFieldErrors() {
    reportForm.querySelectorAll(".field-error").forEach((el) => {
        el.textContent = "";
    });
}

function validateReportFormClient(payload) {
    const errors = {};
    if (!payload.reporterName.trim()) errors.reporterName = "Reporter name is required";
    if (!payload.reporterEmail.trim()) {
        errors.reporterEmail = "Reporter email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.reporterEmail.trim())) {
        errors.reporterEmail = "Please enter a valid email address";
    }
    if (!payload.crimeType.trim()) errors.crimeType = "Please select a crime category";
    if (!payload.incidentDate) {
        errors.incidentDate = "Incident date is required";
    } else if (payload.incidentDate > new Date().toISOString().split("T")[0]) {
        errors.incidentDate = "Incident date cannot be in the future";
    }
    if (!payload.description.trim() || payload.description.trim().length < 10) {
        errors.description = "Description must be between 10 and 2000 characters";
    }
    return errors;
}

function showSubmittedSuccess(reportId) {
    formBanner.textContent = "";
    formBanner.className = "status-banner success";

    const msgSpan = document.createElement("span");
    msgSpan.textContent = `Report submitted successfully! Reference ID: ${reportId}`;

    const copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.className = "btn btn-secondary btn-xs";
    copyBtn.textContent = "Copy ID";
    copyBtn.addEventListener("click", async () => {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(reportId);
                copyBtn.textContent = "Copied!";
            }
        } catch (err) {
            trackIdInput.value = reportId;
        }
    });

    formBanner.appendChild(msgSpan);
    formBanner.appendChild(copyBtn);
    trackIdInput.value = reportId;
}

reportForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearReportFieldErrors();
    hideBanner(formBanner);

    const payload = {
        reporterName: document.getElementById("reporterName").value,
        reporterEmail: document.getElementById("reporterEmail").value,
        crimeType: crimeTypeSelect.value,
        incidentDate: document.getElementById("incidentDate").value,
        description: document.getElementById("description").value
    };

    const clientErrors = validateReportFormClient(payload);
    if (Object.keys(clientErrors).length > 0) {
        Object.entries(clientErrors).forEach(([field, msg]) => {
            const errEl = reportForm.querySelector(`[data-error-for="${field}"]`);
            if (errEl) errEl.textContent = msg;
        });
        showBanner(formBanner, "Please fix the highlighted fields before submitting.", "error");
        return;
    }

    submitReportBtn.disabled = true;
    submitReportBtn.textContent = "Submitting...";

    try {
        const response = await fetch(API.reports, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const data = await response.json();

        if (!response.ok) {
            if (data.errors) {
                Object.entries(data.errors).forEach(([field, message]) => {
                    const errorEl = reportForm.querySelector(`[data-error-for="${field}"]`);
                    if (errorEl) errorEl.textContent = message;
                });
            }
            showBanner(formBanner, data.message || "Validation failed. Please check your input.", "error");
            return;
        }

        reportForm.reset();
        showSubmittedSuccess(data.id);
        if (isAdminLoggedIn) {
            await loadReports();
        }
    } catch (err) {
        showBanner(formBanner, "Could not reach the server. Please verify Spring Boot is running.", "error");
    } finally {
        submitReportBtn.disabled = false;
        submitReportBtn.textContent = "Submit Report";
    }
});

/* Track Report (GET /api/reports/track/{id}) */
trackForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    trackError.textContent = "";
    trackResult.className = "track-result hidden";
    trackResult.textContent = "";

    const id = trackIdInput.value.trim();
    if (!id) {
        trackError.textContent = "Please enter a Reference ID.";
        return;
    }

    trackBtn.disabled = true;
    trackBtn.textContent = "Checking...";

    try {
        const response = await fetch(API.trackReport(id));
        const data = await response.json();

        if (!response.ok) {
            trackResult.className = "track-result error";
            trackResult.textContent = data.message || "No report found with that Reference ID.";
            return;
        }

        trackResult.className = "track-result";

        const topRow = document.createElement("div");
        topRow.className = "track-top-row";

        const typeText = document.createElement("strong");
        typeText.textContent = data.crimeType;

        const badge = document.createElement("span");
        badge.className = `badge badge-${data.status}`;
        badge.textContent = data.status;

        topRow.appendChild(typeText);
        topRow.appendChild(badge);

        const details = document.createElement("div");
        details.textContent = `Incident Date: ${data.incidentDate} | Reference ID: ${data.id}`;

        trackResult.appendChild(topRow);
        trackResult.appendChild(details);
    } catch (err) {
        trackResult.className = "track-result error";
        trackResult.textContent = "Network error while checking report status.";
    } finally {
        trackBtn.disabled = false;
        trackBtn.textContent = "Check Status";
    }
});

/* Citizen Login (Clearly Separated Pending Backend Integration — No Fake Success) */
citizenLoginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    citizenEmailErr.textContent = "";
    citizenPasswordErr.textContent = "";
    hideBanner(citizenBanner);

    const email = citizenEmail.value.trim();
    const pass = citizenPassword.value;
    let valid = true;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        citizenEmailErr.textContent = "Please enter a valid email address.";
        valid = false;
    }
    if (!pass || pass.length < 4) {
        citizenPasswordErr.textContent = "Please enter your password (at least 4 characters).";
        valid = false;
    }
    if (!valid) return;

    citizenLoginBtn.disabled = true;
    citizenLoginBtn.textContent = "Checking...";

    try {
        const result = await CITIZEN_AUTH_INTEGRATION.login(email, pass);
        if (result.pending) {
            showBanner(citizenBanner, result.message, "info");
        }
    } finally {
        citizenLoginBtn.disabled = false;
        citizenLoginBtn.textContent = "Citizen Login";
    }
});

/* Admin / Officer Login & Dashboard (Connected to Real Spring Security + MongoDB APIs) */
function setAdminState(authenticated, username = "") {
    isAdminLoggedIn = authenticated;
    if (authenticated) {
        headerAdminBadge.classList.remove("hidden");
        headerAdminName.textContent = `Officer: ${username}`;
        dashUsername.textContent = username;
        adminLoginView.classList.add("hidden");
        adminDashboardView.classList.remove("hidden");
        loadReports();
    } else {
        loadedReports = [];
        updateStats([]);
        headerAdminBadge.classList.add("hidden");
        headerAdminName.textContent = "";
        dashUsername.textContent = "";
        adminLoginView.classList.remove("hidden");
        adminDashboardView.classList.add("hidden");
        reportsList.textContent = "";
    }
}

async function checkAuthStatus() {
    try {
        const response = await fetch(API.authStatus);
        const data = await response.json();
        setAdminState(Boolean(data.authenticated), data.username || "");
    } catch (err) {
        setAdminState(false);
    }
}

function updateStats(reports) {
    statTotal.textContent = String(reports.length);
    statPending.textContent = String(reports.filter((r) => r.status === "PENDING").length);
    statUnderReview.textContent = String(reports.filter((r) => r.status === "UNDER_REVIEW").length);
    statResolved.textContent = String(reports.filter((r) => r.status === "RESOLVED").length);
}

async function loadReports() {
    if (!isAdminLoggedIn) return;

    const params = new URLSearchParams();
    if (filterStatus.value) params.set("status", filterStatus.value);
    if (filterCrimeType.value) params.set("crimeType", filterCrimeType.value);

    const query = params.toString();
    const url = query ? `${API.reports}?${query}` : API.reports;

    try {
        const response = await fetch(url);
        if (response.status === 401) {
            setAdminState(false);
            return;
        }
        if (!response.ok) throw new Error("Failed to load reports");
        loadedReports = await response.json();
        updateStats(loadedReports);
        applyAdminSearch();
    } catch (err) {
        reportsList.textContent = "";
        const p = document.createElement("p");
        p.className = "empty-box";
        p.textContent = "Unable to load reports from backend.";
        reportsList.appendChild(p);
    }
}

function applyAdminSearch() {
    const q = adminSearchInput.value.trim().toLowerCase();
    if (!q) {
        renderAdminReports(loadedReports);
        return;
    }
    const filtered = loadedReports.filter((r) =>
        (r.id || "").toLowerCase().includes(q)
        || (r.reporterName || "").toLowerCase().includes(q)
        || (r.reporterEmail || "").toLowerCase().includes(q)
        || (r.description || "").toLowerCase().includes(q)
    );
    renderAdminReports(filtered);
}

function renderAdminReports(reports) {
    reportsList.textContent = "";
    if (!reports.length) {
        const empty = document.createElement("p");
        empty.className = "empty-box";
        empty.textContent = "No reports match the selected filters.";
        reportsList.appendChild(empty);
        return;
    }

    reports.forEach((report) => {
        const card = document.createElement("article");
        card.className = "report-item";

        const top = document.createElement("div");
        top.className = "report-top";

        const title = document.createElement("div");
        title.className = "report-title";
        title.textContent = `${report.crimeType} — ${report.reporterName}`;

        const badge = document.createElement("span");
        badge.className = `badge badge-${report.status}`;
        badge.textContent = report.status;

        top.appendChild(title);
        top.appendChild(badge);

        const meta = document.createElement("div");
        meta.className = "report-meta";
        meta.textContent = `ID: ${report.id} | Email: ${report.reporterEmail} | Date: ${report.incidentDate}`;

        const desc = document.createElement("p");
        desc.className = "report-desc";
        desc.textContent = report.description;

        const actions = document.createElement("div");
        actions.className = "report-actions";

        const statusSelect = document.createElement("select");
        statusSelect.setAttribute("aria-label", `Change status for report ${report.id}`);
        ["PENDING", "UNDER_REVIEW", "RESOLVED"].forEach((optVal) => {
            const opt = document.createElement("option");
            opt.value = optVal;
            opt.textContent = optVal;
            opt.selected = report.status === optVal;
            statusSelect.appendChild(opt);
        });
        statusSelect.addEventListener("change", () => updateReportStatus(report.id, statusSelect.value));

        const delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.className = "btn btn-danger";
        delBtn.textContent = "Delete";
        delBtn.addEventListener("click", () => deleteReport(report.id));

        actions.appendChild(statusSelect);
        actions.appendChild(delBtn);

        card.appendChild(top);
        card.appendChild(meta);
        card.appendChild(desc);
        card.appendChild(actions);
        reportsList.appendChild(card);
    });
}

async function updateReportStatus(id, newStatus) {
    try {
        const response = await fetch(API.reportStatus(id), {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus })
        });
        if (response.status === 401) {
            setAdminState(false);
            return;
        }
        if (!response.ok) throw new Error("Status update failed");
        await loadReports();
    } catch (err) {
        alert("Failed to update report status.");
    }
}

async function deleteReport(id) {
    if (!confirm("Are you sure you want to delete this report from MongoDB?")) return;
    try {
        const response = await fetch(API.reportById(id), { method: "DELETE" });
        if (response.status === 401) {
            setAdminState(false);
            return;
        }
        if (!response.ok) throw new Error("Delete failed");
        await loadReports();
    } catch (err) {
        alert("Failed to delete report.");
    }
}

adminLoginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    adminUserErr.textContent = "";
    adminPassErr.textContent = "";
    hideBanner(adminLoginBanner);

    const username = adminUsername.value.trim();
    const password = adminPassword.value;
    let valid = true;

    if (!username) {
        adminUserErr.textContent = "Officer username is required.";
        valid = false;
    }
    if (!password) {
        adminPassErr.textContent = "Password is required.";
        valid = false;
    }
    if (!valid) return;

    adminLoginBtn.disabled = true;
    adminLoginBtn.textContent = "Signing in...";

    const body = new URLSearchParams();
    body.set("username", username);
    body.set("password", password);

    try {
        const response = await fetch(API.adminLogin, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: body.toString()
        });
        const data = await response.json();

        if (!response.ok) {
            showBanner(adminLoginBanner, data.message || "Invalid username or password.", "error");
            return;
        }

        adminLoginForm.reset();
        setAdminState(true, data.username);
    } catch (err) {
        showBanner(adminLoginBanner, "Network error while signing in.", "error");
    } finally {
        adminLoginBtn.disabled = false;
        adminLoginBtn.textContent = "Login as Admin/Officer";
    }
});

async function handleLogout() {
    try {
        await fetch(API.adminLogout, { method: "POST" });
    } finally {
        setAdminState(false);
    }
}

dashLogoutBtn.addEventListener("click", handleLogout);
headerLogoutBtn.addEventListener("click", handleLogout);

adminSearchInput.addEventListener("input", applyAdminSearch);
filterStatus.addEventListener("change", loadReports);
filterCrimeType.addEventListener("change", loadReports);
resetFiltersBtn.addEventListener("click", () => {
    adminSearchInput.value = "";
    filterStatus.value = "";
    filterCrimeType.value = "";
    loadReports();
});

/* Initial Boot */
renderQuote(0);
restartQuoteRotation();
renderCategories();
renderSafetyTips();
checkAuthStatus();
