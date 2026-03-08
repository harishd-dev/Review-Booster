import { useState, useEffect, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Check, Copy, ExternalLink, Sun, Moon, RefreshCw } from "lucide-react";
import logo from "@/assets/logo.png";

const REVIEW_URL = "https://maps.app.goog.gl/d2amr8xBsVdJ3zBU9";

const products = [
  "knee support", "ankle brace", "football shoes", "badminton racket",
  "gym gloves", "yoga mat", "resistance bands", "running shoes",
  "water bottle", "fitness accessories", "cricket bat", "cycling gloves",
  "swim goggles", "hiking backpack", "compression socks", "skipping rope",
  "wrist support", "sports shoes", "track pants", "dumbbell set"
];

const tones = {
  casual: {
    openingsNeutral: [
      "went to decathlon today pretty chill experience",
      "dropped by decathlon after work good vibes",
      "random decathlon visit turned out really well",
      "was just browsing at decathlon and ended up buying something lol",
      "popped into decathlon on a whim no regrets",
      "quick trip to decathlon solid as always",
      "swung by decathlon earlier easy breezy"
    ],
    openingsWithHarish: [
      "ran into harish at decathlon dudes super chill and helpful",
      "harish at decathlon is honestly the best so laid back and helpful",
      "walked in and harish was like hey need help loved that",
      "harish spotted me looking confused and came right over lol"
    ],
    actionsWithHarish: [
      "harish helped me grab the right",
      "harish sorted me out with a solid",
      "harish pointed me to the perfect",
      "harish knew exactly what i needed and got me a",
      "harish made it super easy to pick a",
      "asked harish for advice and he nailed it got me a great"
    ],
    actionsNeutral: [
      "ended up grabbing a pretty decent",
      "found a solid",
      "picked up a nice",
      "got exactly what i needed",
      "walked out with a great"
    ],
    endingsNeutral: [
      "would go back for sure",
      "happy with what i got",
      "no complaints at all",
      "pretty satisfied tbh",
      "decent store decent stuff",
      "will probably be back next week lol"
    ],
    endingsWithHarish: [
      "cheers harish you made it easy",
      "harish is the man will definitely ask for him again",
      "thanks harish youre a legend",
      "shoutout to harish for keeping it real"
    ]
  },

  enthusiastic: {
    openingsNeutral: [
      "absolutely loved my visit to decathlon today",
      "what an amazing experience at decathlon",
      "decathlon never disappoints another fantastic visit",
      "blown away by the service at decathlon today",
      "had the best time at decathlon so much good stuff",
      "decathlon is hands down my favorite store another great trip",
      "every time i visit decathlon im impressed all over again"
    ],
    openingsWithHarish: [
      "harish at decathlon is absolutely incredible what a welcome",
      "huge shoutout to harish he made my decathlon visit amazing",
      "harish greeted me with so much energy at decathlon love it",
      "the moment i walked in harish made me feel like a vip"
    ],
    actionsWithHarish: [
      "harish went above and beyond to help me find the perfect",
      "harish was so knowledgeable and helped me pick out an amazing",
      "harishs recommendations were spot on i got an incredible",
      "harish literally spent time explaining everything and i found the best",
      "im so glad harish was there he helped me discover an awesome"
    ],
    actionsNeutral: [
      "i found the most amazing",
      "the selection was incredible i picked up a fantastic",
      "i was blown away by the quality of the",
      "couldnt believe how perfect the",
      "so happy i found exactly the right"
    ],
    endingsNeutral: [
      "best shopping experience in a long time",
      "im telling all my friends about this store",
      "absolutely coming back this place is gold",
      "cant recommend this store enough truly wonderful",
      "left the store smiling that says it all",
      "outstanding experience from start to finish"
    ],
    endingsWithHarish: [
      "harish youre a star thank you so much",
      "everyone needs a harish at their store absolute gem",
      "cant thank harish enough he made my day",
      "harish deserves employee of the month honestly",
      "if you go to decathlon find harish you wont regret it"
    ]
  },

  brief: {
    openingsNeutral: [
      "quick visit to decathlon",
      "stopped by decathlon",
      "decathlon run today",
      "in and out of decathlon",
      "short trip to decathlon"
    ],
    openingsWithHarish: [
      "harish at decathlon quick and efficient",
      "met harish at decathlon great help",
      "harish sorted me out at decathlon"
    ],
    actionsWithHarish: [
      "harish helped me pick a good",
      "harish found me the right",
      "harish recommended a solid",
      "got a great recommendation from harish for a"
    ],
    actionsNeutral: [
      "got a good",
      "picked up a",
      "found a nice",
      "grabbed a solid"
    ],
    endingsNeutral: [
      "happy with it",
      "would recommend",
      "good store",
      "satisfied",
      "will come back",
      ""
    ],
    endingsWithHarish: [
      "thanks harish",
      "harish was great",
      "ask for harish",
      "harish knows his stuff"
    ]
  },

  friendly: {
    openingsNeutral: [
      "had a really nice time at decathlon today",
      "always enjoy going to decathlon today was no different",
      "love this store another lovely visit to decathlon",
      "decathlon is such a well run store enjoyed my visit",
      "came to decathlon with my family and we all had a great time",
      "nice afternoon spent at decathlon good stuff all around"
    ],
    openingsWithHarish: [
      "harish was so friendly when i walked into decathlon",
      "bumped into harish at decathlon hes always so warm and welcoming",
      "harish remembered me from last time such a personal touch at decathlon",
      "walked in and harish greeted me with a big smile made my day"
    ],
    actionsWithHarish: [
      "harish patiently helped me choose a lovely",
      "harish spent time with me and helped me find the right",
      "harish was kind enough to walk me through the options for a",
      "harish personally recommended a wonderful",
      "with harishs help i picked out a great"
    ],
    actionsNeutral: [
      "found a really nice",
      "the team helped me pick a great",
      "was pleasantly surprised by the quality of the",
      "ended up choosing a wonderful",
      "got some help and found the perfect"
    ],
    endingsNeutral: [
      "such a warm experience will be back soon",
      "really appreciate the helpful staff here",
      "left with a smile thank you",
      "a genuinely pleasant shopping trip",
      "keep up the lovely work decathlon"
    ],
    endingsWithHarish: [
      "thank you so much harish youre wonderful",
      "harish you always make shopping fun see you next time",
      "really grateful for harishs patience and kindness",
      "harish is the reason i keep coming back thank you"
    ]
  },

  storytelling: {
    openingsNeutral: [
      "so i hadnt planned on going to decathlon today but im glad i did",
      "id been putting off getting new gear for weeks finally made it to decathlon",
      "my friend told me to check out decathlon for sports gear glad i listened",
      "i was walking past decathlon and thought why not turned out to be a great decision",
      "been meaning to visit decathlon for a while today was the day"
    ],
    openingsWithHarish: [
      "i walked into decathlon not knowing what to get and thats when harish stepped in",
      "funny story i almost left decathlon empty handed until harish came over",
      "so there i was staring at a wall of products at decathlon when harish showed up and saved me",
      "i was totally lost in decathlon until harish noticed and came to help"
    ],
    actionsWithHarish: [
      "harish listened to what i needed and straight away pulled out the perfect",
      "after a quick chat harish knew exactly what would work he handed me a",
      "harish asked a few questions then confidently led me to the ideal",
      "harish took his time showed me the pros and cons and i walked away with a"
    ],
    actionsNeutral: [
      "after looking around for a bit i settled on a really solid",
      "took my time browsing and finally landed on a great",
      "compared a few options and went with a",
      "did some browsing and found the right"
    ],
    endingsNeutral: [
      "all in all a really worthwhile trip",
      "walked out feeling like i got exactly what i came for",
      "sometimes the unplanned visits are the best ones",
      "glad i made the trip wont wait so long next time"
    ],
    endingsWithHarish: [
      "wouldnt have found it without harish genuinely grateful",
      "harish turned what couldve been a confusing trip into a smooth one legend",
      "if harish hadnt helped me id probably still be standing there lol thanks man",
      "the kind of service harish gives is rare these days really appreciate it"
    ]
  }
};

const toneKeys = Object.keys(tones) as (keyof typeof tones)[];
const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

const generateReview = () => {
  const tone = tones[pick(toneKeys) as keyof typeof tones];
  const harishPlacement = Math.floor(Math.random() * 3); // 0=opening, 1=action, 2=ending

  const opening = harishPlacement === 0 ? pick(tone.openingsWithHarish) : pick(tone.openingsNeutral);
  const action = (harishPlacement === 1 ? pick(tone.actionsWithHarish) : pick(tone.actionsNeutral)) + " " + pick(products) + " ";
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
