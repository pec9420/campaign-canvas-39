export const generateMockCampaign = (goal: string, profile: any) => {
  const isStackCreamery = profile.id === "stack_creamery";
  const isPlumbing = profile.id === "quick_fix_plumbing";

  if (isStackCreamery && goal.toLowerCase().includes("catering")) {
    return {
      strategy: {
        overview: {
          title: "Stack Creamery Catering Awareness Campaign",
          objective: "Drive 15+ catering inquiries over 14 days",
          target_audience: "Event planners, families planning parties, and corporate event coordinators in Springfield, IL",
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          metrics: ["Catering form submissions", "DM inquiries", "Link clicks to catering page"]
        },
        funnel: [
          {
            stage: "Awareness",
            description: "Show the visual impact of Stack Creamery at events through vibrant pop-art styled content"
          },
          {
            stage: "Consideration",
            description: "Highlight unique selling points: local flavors, customizable options, hassle-free service"
          },
          {
            stage: "Conversion",
            description: "Direct call-to-actions for catering bookings with limited-time incentives"
          }
        ],
        content_plan: {
          total_posts: 8,
          platforms: {
            instagram: 4,
            tiktok: 2,
            facebook: 2
          }
        },
        post_outline: [
          {
            date: new Date(Date.now() + 0 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            platform: "Instagram Reel",
            format: "Video",
            stage: "Awareness",
            goal: "Show catering setup",
            description: "Visual showcase of Stack Creamery's professional catering setup with pop-art aesthetic to create immediate visual impact",
            purpose: "Increase awareness of catering services and establish premium positioning in the market",
            persona: "Event planners and party hosts looking for memorable catering options",
            cta: "Book your event",
            kpi: "2% of viewers save or share post, 1.5% click link in bio"
          },
          {
            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            platform: "TikTok",
            format: "Video",
            stage: "Awareness",
            goal: "Behind-the-scenes prep",
            description: "Time-lapse of organized preparation process showing professionalism and attention to detail",
            purpose: "Build trust through transparency and showcase the effort that goes into each event",
            persona: "Detail-oriented event coordinators who value organization and reliability",
            cta: "Link in bio",
            kpi: "3% of viewers visit link in bio, 5% engagement rate"
          },
          {
            date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            platform: "Facebook",
            format: "Carousel",
            stage: "Consideration",
            goal: "Showcase menu options",
            description: "Detailed breakdown of three catering packages with pricing and inclusions to aid decision-making",
            purpose: "Provide clear package options and pricing transparency to reduce friction in booking process",
            persona: "Budget-conscious event planners comparing catering options and pricing",
            cta: "View menu",
            kpi: "4% click through to full menu, 1% submit inquiry form"
          },
          {
            date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            platform: "Instagram Story",
            format: "Story",
            stage: "Consideration",
            goal: "Customer testimonial",
            description: "Authentic customer review highlighting satisfaction and positive experience with past catering",
            purpose: "Build social proof and credibility through real customer experiences",
            persona: "Risk-averse customers who need reassurance before making catering investment",
            cta: "Swipe up",
            kpi: "8% swipe up rate, 2% of story viewers book consultation"
          },
          {
            date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            platform: "Instagram Reel",
            format: "Video",
            stage: "Conversion",
            goal: "Limited offer",
            description: "Promotional content featuring time-sensitive discount on topping upgrades to drive immediate action",
            purpose: "Create urgency and incentivize immediate booking decisions with limited-time value add",
            persona: "Price-sensitive customers ready to book but need final push with added value",
            cta: "Book now",
            kpi: "6% click link in bio, 3% complete booking form"
          },
          {
            date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            platform: "TikTok",
            format: "Video",
            stage: "Conversion",
            goal: "Easy booking process",
            description: "Screen recording tutorial showing simple 2-minute booking process to reduce booking friction",
            purpose: "Eliminate perceived complexity barriers and demonstrate how easy it is to book catering",
            persona: "Busy customers who need convenience and simple processes",
            cta: "Link in bio",
            kpi: "7% visit booking page, 4% start booking process"
          },
          {
            date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            platform: "Facebook",
            format: "Image",
            stage: "Conversion",
            goal: "Last chance offer",
            description: "Final urgency post reminding audience of limited promotion ending with direct contact encouragement",
            purpose: "Capture remaining interested prospects before promotion expires",
            persona: "Procrastinators who need final urgency push to make booking decision",
            cta: "Message us",
            kpi: "10% direct message rate, 5% phone calls generated"
          },
          {
            date: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            platform: "Instagram Post",
            format: "Carousel",
            stage: "Nurture",
            goal: "Recap + thank you",
            description: "Gratitude post celebrating campaign success and encouraging ongoing community engagement",
            purpose: "Maintain relationship with audience and encourage user-generated content for future social proof",
            persona: "New followers and recent customers who need continued engagement",
            cta: "Tag us",
            kpi: "15% use branded hashtag, 3% tag business in posts"
          }
        ]
      },
      scripts: `# Post 1 - Instagram Reel (Day 1)

**Hook:** "POV: Your event just got 10x more memorable 🍦"

**Script:**
[Scene 1: Wide shot of colorful ice cream station setup]
Your guests walk in...

[Scene 2: Close-up of stacked ice cream cones]
And see THIS.

[Scene 3: Happy reactions]
Stack Creamery catering = instant party upgrade

**Caption:**
Making events DRIP since day one 🎉✨

We bring the full Stack Creamery experience to your party:
🍦 Pop-art ice cream station
🎨 Custom flavor packs
📸 Insta-worthy setup

Perfect for birthdays, corporate events, weddings + more.

Book your date before summer fills up! Link in bio 👆

**Hashtags:** #SpringfieldIL #IceCreamCatering #EventCatering #PartyIdeas #StackCreamery

---

# Post 2 - TikTok (Day 3)

**Hook:** "What we're loading for a 50-person event"

**Script:**
[Time-lapse of loading ice cream tubs into coolers]
12 flavors...

[Packing toppings in containers]
27 different toppings...

[Loading pop-art backdrop]
Our signature setup...

[Final reveal of packed van]
Ready to make someone's day 🔥

**Caption:**
Behind the scenes = organized chaos 😅

We don't just show up with ice cream. We bring:
✨ Full aesthetic setup
🍨 Fresh-made flavors
🎉 Zero stress for you

Catering slots going fast for May & June! Link in bio

**Hashtags:** #BehindTheScenes #EventPlanning #IceCreamTok #CateringSoFar #Springfield

---

# Post 3 - Facebook Carousel (Day 5)

**Slide 1 Title:** "Stack Creamery Event Packages"
**Caption:** Choose your vibe 🎨

**Slide 2 - Classic Stack ($8/person)**
- 6 signature flavors
- 12 toppings
- Cups & cones

**Slide 3 - Loaded Stack ($12/person)**
- 10 flavors including local collabs
- 20+ toppings
- Cups, cones, + waffle bowls
- Branded setup

**Slide 4 - Full Experience ($16/person)**
- All 12 flavors
- 27 toppings bar
- Full pop-art setup
- Photo backdrop
- Staff service

**Main Caption:**
📢 Springfield's favorite ice cream, now at YOUR event!

Whether it's an intimate birthday or a 200-person corporate shindig, we've got a package that fits.

✅ We handle setup + breakdown
✅ Licensed & insured
✅ Aesthetic on point
✅ Max 4 events per weekend (book early!)

Drop a 🍦 if you're planning an event this summer!
DM us or visit [website] to check availability.

---

# Post 4 - Instagram Story (Day 7)

**Slide 1:** Text overlay: "What clients are saying"
[Background: photo of happy event]

**Slide 2:** Testimonial screenshot:
"Stack Creamery MADE our daughter's graduation party. Everyone asked where we found them!"
- Jennifer M.

**Slide 3:** CTA
"Book catering for YOUR event"
[Swipe up link sticker]

---

# Post 5 - Instagram Reel (Day 9)

**Hook:** "We're running a catering special and it's LOADED 🍦"

**Script:**
[Scene 1: Text overlay appears]
Book catering by May 15th...

[Scene 2: Dramatic reveal]
Get a FREE topping upgrade (worth $50)

[Scene 3: Show toppings spread]
That's our FULL topping bar

[Scene 4: CTA text]
Limited to 10 bookings
Link in bio 👆

**Caption:**
Consider this your sign to book that summer event 😏

🎉 FREE topping upgrade (worth $50)
📅 Must book by May 15
🍨 Only 10 spots available

Perfect for:
• Birthdays
• Graduations  
• Corporate events
• Weddings
• Just because

Link in bio to claim your spot!

**Hashtags:** #LimitedOffer #EventCatering #SpringfieldEvents #IceCreamParty #BookNow

---

# Post 6 - TikTok (Day 11)

**Hook:** "Booking Stack Creamery catering takes 2 minutes"

**Script:**
[Scene 1: Phone screen recording]
Step 1: Click link in bio

[Scene 2: Form fill]
Step 2: Pick your date + package

[Scene 3: Confirmation screen]
Step 3: Done. We'll handle the rest.

[Scene 4: Party footage]
Show up and look like a hero ✨

**Caption:**
Why stress when you can just... not? 😌

We make it stupid easy:
1️⃣ Click link
2️⃣ Fill quick form  
3️⃣ We confirm
4️⃣ We show up and slay

You get all the credit, we do all the work.

Still have 6 slots left for our May special (FREE topping upgrade) 👀

**Hashtags:** #EasyBooking #PartyPlanning #EventTok #NoStress #IceCreamCatering

---

# Post 7 - Facebook (Day 13)

**Image:** Text overlay on ice cream photo: "Last call for May special ⏰"

**Caption:**
⚠️ Only 3 catering slots left for our May promotion!

Book by midnight TOMORROW (May 15) and get a FREE topping upgrade worth $50.

This is perfect if you're planning:
🎓 Graduation parties
🎂 Summer birthdays
💼 Corporate events
💍 Wedding receptions
🏠 Neighborhood gatherings

Don't let your event be basic when it could be STACKED 🍦

Message us RIGHT NOW to lock in your date!
[Phone number] or DM us here.

---

# Post 8 - Instagram Carousel (Day 14)

**Slide 1:** "Thank you Springfield! 🙏"
[Photo: Collage of recent events]

**Slide 2:** "This campaign = 17 bookings 🎉"
[Graphic: Thank you message]

**Slide 3:** "We still have summer dates available"
[Text: "Book yours before it's too late!"]

**Slide 4:** "Tag us in your event photos"
[CTA: Use #StackedEvent]

**Caption:**
What a week! 🤯

17 of you booked catering and we couldn't be more hyped. Summer is about to be LOADED.

If you missed the special, don't worry - we still have dates available for June-August!

And if we catered YOUR event, tag us in your pics! We love seeing the Stack Creamery experience in action 🍦💕

Link in bio to check summer availability!

**Hashtags:** #ThankYou #Springfield #CommunityLove #IceCream #LocalBusiness`,
      visuals: `# Visual Direction & Shot Lists

## Post 1 - Instagram Reel (Day 1)

**Shot List:**
1. Wide establishing shot of full ice cream catering setup (3 sec)
2. Quick pan across colorful ice cream tubs in pop-art containers (2 sec)
3. Close-up: staff member stacking 3-scoop cone with dramatic drip (3 sec)
4. Cut to guest reactions - genuine surprise/excitement (2 sec)
5. Final: Wide shot with text overlay (2 sec)

**Props:**
- Full catering station with pop-art backdrop
- 6-8 colorful ice cream tubs
- Toppings bar with containers
- Staff wearing branded apparel
- Happy guests (staff/friends for shoot)

**Styling:**
- Bright, saturated colors (pink, teal, yellow dominant)
- Pop-art aesthetic throughout
- Clean white serving station
- Colorful napkins/cups arranged artfully

**Technical:**
- Shoot vertical 9:16
- Natural light or soft LED panels
- Fast-paced cuts (each scene 2-3 sec max)
- Upbeat trending audio
- Use 0.75x slow-mo for stacking/dripping shots

---

## Post 2 - TikTok (Day 3)

**Shot List:**
1. Time-lapse: Empty cooler → filled with tubs (5 sec)
2. Overhead shot: Organizing toppings in containers (3 sec)
3. Mid-shot: Rolling up pop-art backdrop banner (2 sec)
4. Overhead: Packed van from above (3 sec)
5. Cut to: Person closing van door with confidence (2 sec)

**Props:**
- Commercial coolers
- Multiple ice cream tubs with labels
- Topping containers (gummy bears, sprinkles, etc.)
- Pop-art backdrop rolled up
- Stack Creamery branded van or vehicle

**Styling:**
- Organized chaos aesthetic
- Keep colors vibrant
- Show branded packaging
- Include clipboard with event details

**Technical:**
- Shoot vertical 9:16
- Time-lapse at 4x speed for packing
- Regular speed for final reveal
- Use trending "getting ready" audio
- Text overlays with punch

---

## Post 3 - Facebook Carousel (Day 5)

**Shot List (4 images):**
1. Hero shot: All three package setups side-by-side
2. Classic package: Close-up of 6 flavors + basic toppings
3. Loaded package: Mid-shot of 10 flavors + waffle bowls + setup
4. Full Experience: Wide shot with backdrop + full topping bar

**Props:**
- All serving materials for each tier
- Printed menu cards
- Price markers (optional - can add in design)
- Full pop-art setup for tier 3

**Styling:**
- Clean, bright, professional
- Each tier clearly differentiated
- Use branded containers
- Arrange toppings artfully

**Technical:**
- Shoot horizontal 4:5 or square 1:1
- Bright, even lighting
- Overhead angle for product shots
- Eye-level for setup shots
- Add graphic overlays in post (package names, prices)

---

## Post 4 - Instagram Story (Day 7)

**Shot List:**
1. Photo: Happy event guests enjoying ice cream
2. Screenshot: Testimonial with 5 stars
3. Graphic: CTA with swipe up

**Props:**
- Real (or staged) event photo
- Phone screenshot of review

**Styling:**
- Authentic, candid photo
- Brand colors in CTA graphic
- Clean text overlays

**Technical:**
- Vertical 9:16 format
- Use Instagram story text tools
- Add stickers: star ratings, swipe up indicator
- 5 second display per slide

---

## Post 5 - Instagram Reel (Day 9)

**Shot List:**
1. Text reveal: "Book by May 15th..." (2 sec)
2. Dramatic zoom: From overhead on topping bar (3 sec)
3. Close-up pans: Each topping container (4 sec)
4. Final text: "Link in bio" with ice cream visual (2 sec)

**Props:**
- FULL topping bar spread
- All 27+ toppings in clear containers
- $50 upgrade value indicator (printed card)

**Styling:**
- Abundant, generous look
- Organized but exciting
- Bright colors, high contrast
- Brand colors prominent

**Technical:**
- Vertical 9:16
- Use dramatic zoom effect
- Smooth gimbal pans
- Upbeat, exciting audio
- Bold text overlays

---

## Post 6 - TikTok (Day 11)

**Shot List:**
1. Screen recording: Phone clicking bio link (3 sec)
2. Screen recording: Scrolling form, filling details (4 sec)
3. Screen recording: Confirmation screen (2 sec)
4. B-roll: Event footage with happy faces (3 sec)

**Props:**
- Smartphone with actual booking page
- Screen recording software

**Styling:**
- Clean interface
- Simple, easy-to-follow
- Real booking flow

**Technical:**
- Vertical 9:16
- Clear screen capture
- Smooth transitions between recording and live footage
- Use satisfying "click" sound effects
- Trending "tutorial" audio

---

## Post 7 - Facebook (Day 13)

**Shot List:**
Single image: Text overlay on high-quality ice cream photo

**Props:**
- Hero ice cream shot (colorful, stacked, dripping)
- Shot in Stack Creamery brand aesthetic

**Styling:**
- Dramatic, eye-catching
- Text overlay: "Last Call for May Special ⏰"
- Urgency without being pushy

**Technical:**
- Horizontal or square format
- Professional food photography
- High contrast for text readability
- Use brand colors for text

---

## Post 8 - Instagram Carousel (Day 14)

**Shot List (4 images):**
1. Collage: 6-9 photos from recent catered events
2. Graphic: "17 Bookings" celebration message
3. Text graphic: "Summer dates still available"
4. Call-to-action: "Tag us #StackedEvent"

**Props:**
- Collection of event photos (get permission from clients)
- Branded thank-you graphics

**Styling:**
- Cohesive brand colors throughout
- Celebratory, grateful tone
- Clean graphic design
- Consistent fonts

**Technical:**
- Square 1:1 format
- Use Canva or similar for graphic slides
- Keep text minimal and readable
- Brand colors + white backgrounds for graphics`
    };
  }

  // Generic response for other profiles
  return {
    strategy: {
      overview: {
        title: `${profile.business_name} Growth Campaign`,
        objective: `Increase ${goal.toLowerCase()} over 14-day period`,
        target_audience: profile.audience.primary.join(", "),
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        metrics: ["Engagement rate", "Website clicks", "Inquiries"]
      },
      funnel: [
        {
          stage: "Awareness",
          description: "Introduce your business and unique value proposition"
        },
        {
          stage: "Consideration",
          description: "Showcase services, testimonials, and differentiators"
        },
        {
          stage: "Conversion",
          description: "Direct call-to-actions with clear next steps"
        }
      ],
      content_plan: {
        total_posts: 8,
        platforms: profile.audience.platforms.reduce((acc: any, p: string) => {
          acc[p] = Math.ceil(8 / profile.audience.platforms.length);
          return acc;
        }, {})
      },
      post_outline: [
        {
          date: new Date(Date.now() + 0 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          platform: profile.audience.platforms[0],
          format: "Post",
          stage: "Awareness",
          goal: "Introduce business",
          description: `Professional introduction showcasing ${profile.business_name}'s unique value proposition and brand personality`,
          purpose: "Establish brand presence and introduce business to new potential customers",
          persona: profile.audience.primary[0] || "Target customers discovering the business for the first time",
          cta: "Learn more",
          kpi: "2% of viewers visit profile, 1% click link in bio"
        },
        {
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          platform: profile.audience.platforms[1] || profile.audience.platforms[0],
          format: "Post",
          stage: "Awareness",
          goal: "Show personality",
          description: "Behind-the-scenes content that humanizes the brand and showcases company culture",
          purpose: "Build emotional connection and trust through authentic brand storytelling",
          persona: "Potential customers seeking authentic, relatable businesses",
          cta: "Follow",
          kpi: "3% follow rate, 4% engagement rate"
        },
        {
          date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          platform: profile.audience.platforms[0],
          format: "Post",
          stage: "Consideration",
          goal: "Highlight service",
          description: `Detailed showcase of ${profile.business_name}'s key services and unique selling points`,
          purpose: "Educate audience about service offerings and demonstrate expertise",
          persona: profile.audience.primary[0] || "Customers comparing service providers",
          cta: "See details",
          kpi: "3% click for more details, 2% save post"
        },
        {
          date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          platform: profile.audience.platforms[1] || profile.audience.platforms[0],
          format: "Post",
          stage: "Consideration",
          goal: "Social proof",
          description: "Customer testimonials and reviews highlighting successful outcomes and satisfied clients",
          purpose: "Build credibility and trust through third-party validation",
          persona: "Cautious customers who need reassurance before making decisions",
          cta: "Read reviews",
          kpi: "5% visit reviews page, 2% leave their own review"
        },
        {
          date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          platform: profile.audience.platforms[0],
          format: "Post",
          stage: "Conversion",
          goal: "Special offer",
          description: "Limited-time promotional offer designed to incentivize immediate action",
          purpose: "Convert interested prospects into customers with compelling value proposition",
          persona: "Price-conscious customers ready to purchase with the right incentive",
          cta: "Book now",
          kpi: "4% click booking link, 2% complete booking"
        },
        {
          date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          platform: profile.audience.platforms[1] || profile.audience.platforms[0],
          format: "Post",
          stage: "Conversion",
          goal: "Urgency",
          description: "Time-sensitive messaging emphasizing limited availability or deadline",
          purpose: "Create urgency to accelerate decision-making process",
          persona: "Procrastinators who need deadline pressure to take action",
          cta: "Contact us",
          kpi: "6% direct contact rate, 3% phone calls"
        },
        {
          date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          platform: profile.audience.platforms[0],
          format: "Post",
          stage: "Conversion",
          goal: "Last reminder",
          description: "Final opportunity messaging for promotion or limited-time offer",
          purpose: "Capture remaining interested prospects before opportunity expires",
          persona: "Fence-sitters who need final push to make decision",
          cta: "Get started",
          kpi: "5% conversion rate, 7% inquiry rate"
        },
        {
          date: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          platform: profile.audience.platforms[1] || profile.audience.platforms[0],
          format: "Post",
          stage: "Nurture",
          goal: "Thank you",
          description: "Gratitude post acknowledging audience engagement and encouraging ongoing relationship",
          purpose: "Maintain positive relationship and encourage continued engagement",
          persona: "New followers and customers who need ongoing nurturing",
          cta: "Stay connected",
          kpi: "8% ongoing engagement rate, 4% share content"
        }
      ]
    },
    scripts: `# Sample Campaign Scripts

# Post 1 - Day 1

**Hook:** "Meet ${profile.business_name} 👋"

**Caption:**
We're ${profile.business_name}, your ${profile.business.location} ${profile.niche}.

What makes us different? 
${profile.business.unique_selling_points.map((p: string) => `✨ ${p}`).join("\n")}

Ready to work together? Link in bio!

---

# Post 2 - Day 3

**Hook:** "This is what we're all about"

**Caption:**
At ${profile.business_name}, we believe in:
${profile.brand_identity.personality.slice(0, 3).map((p: string) => `• ${p}`).join("\n")}

Our mission? To help ${profile.audience.primary[0]}s ${goal.toLowerCase()}.

Drop a ❤️ if this resonates!

---

*[Additional posts would follow similar structure with conversion-focused CTAs]*`,
    visuals: `# Visual Direction

## General Guidelines

**Color Palette:**
${profile.brand_identity.colors.map((c: string) => `• ${c}`).join("\n")}

**Visual Style:** ${profile.brand_identity.visual_style}

**Content Rules:**
${profile.content_rules.show_owner ? "✅ Can show owner" : "❌ No owner"}
${profile.content_rules.show_staff ? "✅ Can show staff" : "❌ No staff"}
${profile.content_rules.show_customers ? "✅ Can show customers" : "❌ No customers"}

## Post 1 Shot List

**Scene 1:** Exterior shot of business location
**Scene 2:** Interior/workspace overview  
**Scene 3:** Service/product close-up
**Scene 4:** Team or owner (if approved)

**Props:** Business signage, product displays, workspace
**Styling:** ${profile.brand_identity.visual_style}, on-brand colors
**Technical:** Natural lighting, professional composition

*[Additional shot lists for remaining posts would be included]*`
  };
};
