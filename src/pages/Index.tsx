import { useState, useEffect, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Check, Copy, ExternalLink, Sun, Moon, RefreshCw } from "lucide-react";
import logo from "@/assets/logo.png";

const REVIEW_URL = "https://search.google.com/local/writereview?placeid=ChIJ_f5S4x9eUjoR6eQvRsY2mRw";

const products = [
  "knee support", "ankle brace", "football shoes", "badminton racket",
  "gym gloves", "yoga mat", "resistance bands", "running shoes",
  "water bottle", "fitness accessories", "cricket bat", "cycling gloves",
  "swim goggles", "hiking backpack", "compression socks", "skipping rope",
  "wrist support", "sports shoes", "track pants", "dumbbell set",
];

// --- TONE TEMPLATES ---
// Each tone has its own openings, actions, and endings for natural variety.

const tones = {
  casual: {
    openingsNeutral: [
      "Went to Decathlon today, pretty chill experience.",
      "Dropped by Decathlon after work. Good vibes.",
      "Random Decathlon visit turned out really well.",
      "Was just browsing at Decathlon and ended up buying something lol.",
      "Popped into Decathlon on a whim. No regrets.",
      "Quick trip to Decathlon. Solid as always.",
      "Swung by Decathlon earlier. Easy breezy.",
    ],
    openingsWithHarish: [
      "Ran into Harish at Decathlon — dude's super chill and helpful.",
      "Harish at Decathlon is honestly the best. So laid back and helpful.",
      "Walked in and Harish was like 'hey, need help?' — loved that.",
      "Harish spotted me looking confused and came right over lol.",
    ],
    actionsWithHarish: [
      "Harish helped me grab the right",
      "Harish sorted me out with a solid",
      "Harish pointed me to the perfect",
      "Harish knew exactly what I needed and got me a",
      "Harish made it super easy to pick a",
      "Asked Harish for advice and he nailed it — got me a great",
    ],
    actionsNeutral: [
      "Ended up grabbing a pretty decent",
      "Found a solid",
      "Picked up a nice",
      "Got exactly what I needed —",
      "Walked out with a great",
    ],
    endingsNeutral: [
      "Would go back for sure.",
      "Happy with what I got.",
      "No complaints at all.",
      "Pretty satisfied tbh.",
      "Decent store, decent stuff.",
      "Will probably be back next week lol.",
    ],
    endingsWithHarish: [
      "Cheers Harish, you made it easy!",
      "Harish is the man. Will definitely ask for him again.",
      "Thanks Harish — you're a legend.",
      "Shoutout to Harish for keeping it real.",
    ],
  },

  enthusiastic: {
    openingsNeutral: [
      "Absolutely LOVED my visit to Decathlon today!",
      "What an amazing experience at Decathlon! 🙌",
      "Decathlon never disappoints — another fantastic visit!",
      "Blown away by the service at Decathlon today!",
      "Had the BEST time at Decathlon. So much good stuff!",
      "Decathlon is hands down my favorite store. Another great trip!",
      "Every time I visit Decathlon, I'm impressed all over again!",
    ],
    openingsWithHarish: [
      "Harish at Decathlon is absolutely incredible! What a welcome!",
      "HUGE shoutout to Harish — he made my Decathlon visit amazing!",
      "Harish greeted me with so much energy at Decathlon. Love it!",
      "The moment I walked in, Harish made me feel like a VIP!",
    ],
    actionsWithHarish: [
      "Harish went above and beyond to help me find the perfect",
      "Harish was SO knowledgeable and helped me pick out an amazing",
      "Harish's recommendations were spot on — I got an incredible",
      "Harish literally spent time explaining everything and I found the best",
      "I'm so glad Harish was there — he helped me discover an awesome",
    ],
    actionsNeutral: [
      "I found the most amazing",
      "The selection was incredible — I picked up a fantastic",
      "I was blown away by the quality of the",
      "Couldn't believe how perfect the",
      "So happy I found exactly the right",
    ],
    endingsNeutral: [
      "Best shopping experience in a long time! ⭐⭐⭐⭐⭐",
      "I'm telling ALL my friends about this store!",
      "Absolutely coming back. This place is gold!",
      "Can't recommend this store enough. Truly wonderful!",
      "Left the store smiling. That says it all!",
      "Outstanding experience from start to finish!",
    ],
    endingsWithHarish: [
      "Harish, you're a STAR! Thank you so much!",
      "Everyone needs a Harish at their store. Absolute gem!",
      "Can't thank Harish enough. He made my day!",
      "Harish deserves employee of the month, honestly!",
      "If you go to Decathlon, find Harish. You won't regret it!",
    ],
  },

  brief: {
    openingsNeutral: [
      "Quick visit to Decathlon.",
      "Stopped by Decathlon.",
      "Decathlon run today.",
      "In and out of Decathlon.",
      "Short trip to Decathlon.",
    ],
    openingsWithHarish: [
      "Harish at Decathlon — quick and efficient.",
      "Met Harish at Decathlon. Great help.",
      "Harish sorted me out at Decathlon.",
    ],
    actionsWithHarish: [
      "Harish helped me pick a good",
      "Harish found me the right",
      "Harish recommended a solid",
      "Got a great recommendation from Harish for a",
    ],
    actionsNeutral: [
      "Got a good",
      "Picked up a",
      "Found a nice",
      "Grabbed a solid",
    ],
    endingsNeutral: [
      "Happy with it.",
      "Would recommend.",
      "Good store.",
      "Satisfied.",
      "Will come back.",
      "👍",
    ],
    endingsWithHarish: [
      "Thanks Harish.",
      "Harish was great.",
      "Ask for Harish.",
      "Harish knows his stuff.",
    ],
  },

  friendly: {
    openingsNeutral: [
      "Had a really nice time at Decathlon today!",
      "Always enjoy going to Decathlon. Today was no different.",
      "Love this store! Another lovely visit to Decathlon.",
      "Decathlon is such a well-run store. Enjoyed my visit!",
      "Came to Decathlon with my family and we all had a great time.",
      "Nice afternoon spent at Decathlon. Good stuff all around.",
    ],
    openingsWithHarish: [
      "Harish was so friendly when I walked into Decathlon!",
      "Bumped into Harish at Decathlon — he's always so warm and welcoming.",
      "Harish remembered me from last time! Such a personal touch at Decathlon.",
      "Walked in and Harish greeted me with a big smile. Made my day!",
    ],
    actionsWithHarish: [
      "Harish patiently helped me choose a lovely",
      "Harish spent time with me and helped me find the right",
      "Harish was kind enough to walk me through the options for a",
      "Harish personally recommended a wonderful",
      "With Harish's help, I picked out a great",
    ],
    actionsNeutral: [
      "Found a really nice",
      "The team helped me pick a great",
      "Was pleasantly surprised by the quality of the",
      "Ended up choosing a wonderful",
      "Got some help and found the perfect",
    ],
    endingsNeutral: [
      "Such a warm experience. Will be back soon!",
      "Really appreciate the helpful staff here.",
      "Left with a smile. Thank you!",
      "A genuinely pleasant shopping trip.",
      "Keep up the lovely work, Decathlon!",
    ],
    endingsWithHarish: [
      "Thank you so much, Harish! You're wonderful.",
      "Harish, you always make shopping fun. See you next time!",
      "Really grateful for Harish's patience and kindness.",
      "Harish is the reason I keep coming back. Thank you!",
    ],
  },

  storytelling: {
    openingsNeutral: [
      "So I hadn't planned on going to Decathlon today, but I'm glad I did.",
      "I'd been putting off getting new gear for weeks. Finally made it to Decathlon.",
      "My friend told me to check out Decathlon for sports gear. Glad I listened.",
      "I was walking past Decathlon and thought, why not? Turned out to be a great decision.",
      "Been meaning to visit Decathlon for a while. Today was the day.",
    ],
    openingsWithHarish: [
      "I walked into Decathlon not knowing what to get, and that's when Harish stepped in.",
      "Funny story — I almost left Decathlon empty-handed until Harish came over.",
      "So there I was, staring at a wall of products at Decathlon, when Harish showed up and saved me.",
      "I was totally lost in Decathlon until Harish noticed and came to help.",
    ],
    actionsWithHarish: [
      "Harish listened to what I needed and straight away pulled out the perfect",
      "After a quick chat, Harish knew exactly what would work — he handed me a",
      "Harish asked a few questions, then confidently led me to the ideal",
      "Harish took his time, showed me the pros and cons, and I walked away with a",
    ],
    actionsNeutral: [
      "After looking around for a bit, I settled on a really solid",
      "Took my time browsing and finally landed on a great",
      "Compared a few options and went with a",
      "Did some browsing and found the right",
    ],
    endingsNeutral: [
      "All in all, a really worthwhile trip.",
      "Walked out feeling like I got exactly what I came for.",
      "Sometimes the unplanned visits are the best ones.",
      "Glad I made the trip. Won't wait so long next time.",
    ],
    endingsWithHarish: [
      "Wouldn't have found it without Harish. Genuinely grateful.",
      "Harish turned what could've been a confusing trip into a smooth one. Legend.",
      "If Harish hadn't helped me, I'd probably still be standing there lol. Thanks man!",
      "The kind of service Harish gives is rare these days. Really appreciate it.",
    ],
  },
};

const toneKeys = Object.keys(tones) as (keyof typeof tones)[];
const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

const generateReview = () => {
  const tone = tones[pick(toneKeys) as keyof typeof tones];
  const harishPlacement = Math.floor(Math.random() * 3); // 0=opening, 1=action, 2=ending

  const opening = harishPlacement === 0 ? pick(tone.openingsWithHarish) : pick(tone.openingsNeutral);
  const action = (harishPlacement === 1 ? pick(tone.actionsWithHarish) : pick(tone.actionsNeutral)) + " " + pick(products) + ".";
  const ending = harishPlacement === 2 ? pick(tone.endingsWithHarish) : pick(tone.endingsNeutral);

  return [opening, action, ending].join(" ");
};

const Index = () => {
  const [copied, setCopied] = useState(false);
  const [isLight, setIsLight] = useState(false);
  const [review, setReview] = useState(generateReview);

  const shuffleReview = useCallback(() => {
    setReview(generateReview());
    setCopied(false);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("light", isLight);
  }, [isLight]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(review);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = review;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const qrColor = isLight ? "hsl(220, 20%, 16%)" : "hsl(0, 0%, 100%)";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12 transition-colors duration-300">
      {/* Theme Toggle */}
      <button
        onClick={() => setIsLight(!isLight)}
        className="fixed top-4 right-4 p-2 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground transition-colors z-50"
        aria-label="Toggle theme"
      >
        {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      </button>

      <div className="w-full max-w-[420px] sm:max-w-[460px] flex flex-col items-center gap-5 sm:gap-6">
        {/* Greeting */}
        <div className="text-center animate-fade-in-up">
          <p className="text-muted-foreground text-xs sm:text-sm tracking-wide uppercase mb-1">
            Thank you for choosing us
          </p>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground leading-tight">
            We'd love your feedback ✨
          </h1>
          <p className="text-muted-foreground mt-1.5 text-sm sm:text-base">
            Your review helps us grow and serve you better.
          </p>
        </div>

        {/* QR Code */}
        <div className="animate-fade-in-up animate-delay-1 bg-card rounded-2xl p-4 sm:p-6 flex items-center justify-center">
          <QRCodeSVG
            value={REVIEW_URL}
            size={160}
            bgColor="transparent"
            fgColor={qrColor}
            level="H"
          />
        </div>

        {/* Open Review Button */}
        <a
          href={REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="animate-fade-in-up animate-delay-2 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-medium text-sm sm:text-base py-3.5 px-6 rounded-2xl transition-opacity hover:opacity-90 active:scale-[0.98]"
        >
          Open Review Page
          <ExternalLink className="w-4 h-4" />
        </a>

        {/* Suggested Review */}
        <div className="animate-fade-in-up animate-delay-3 w-full">
          <p className="text-xs sm:text-sm text-muted-foreground mb-2 text-center">
            Or copy a suggested review below
          </p>
          <div className="bg-card rounded-2xl p-4 sm:p-5 border border-border">
            <p className="text-foreground text-xs sm:text-sm leading-relaxed select-all">
              {review}
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-medium text-xs sm:text-sm py-2.5 px-4 rounded-xl transition-colors hover:bg-accent active:scale-[0.98]"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copy Review
                  </>
                )}
              </button>
              <button
                onClick={shuffleReview}
                className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-medium text-xs sm:text-sm py-2.5 px-4 rounded-xl transition-colors hover:bg-accent active:scale-[0.98]"
                aria-label="Generate another review"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Portfolio Link */}
        <a
          href="https://harishps.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="animate-fade-in-up animate-delay-4 flex flex-col items-center gap-2"
        >
          <img
            src={logo}
            alt="Harish logo"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
          />
          <span className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
            Visit my portfolio →
          </span>
        </a>

        {/* Footer */}
        <footer className="animate-fade-in-up animate-delay-5 w-full pt-4 mt-2 border-t border-border flex flex-col items-center gap-1 text-muted-foreground/60">
          <span className="text-[10px] sm:text-xs">Made by Harish</span>
          <span className="text-[10px] sm:text-xs">© {new Date().getFullYear()} All rights reserved.</span>
        </footer>
      </div>
    </div>
  );
};

export default Index;
