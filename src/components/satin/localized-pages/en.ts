import type { JournalArticleId } from '../journal'

export const journalSummaries = {
  'tirnak-sekli': {
    category: 'Nails',
    title: 'How to choose your nail shape',
    excerpt: 'Start with the silhouette before choosing a colour. Here are a few ways to find a shape that suits your hands, daily life and favourite details.',
  },
  'kirpik-ifadesi': {
    category: 'Lashes',
    title: 'A lash look that feels like you',
    excerpt: 'Bolder, more subtle or simply polished. Here is how to describe the look you want at your appointment.',
  },
  'erkek-bakimi': {
    category: 'Men’s grooming',
    title: 'A simple look, considered details',
    excerpt: 'The small choices that shape a men’s manicure or pedicure: length, shape and finish.',
  },
} satisfies Record<JournalArticleId, { category: string; title: string; excerpt: string }>

export default {
  '/hizmetler/tirnak-sanati/': {
    path: '/en/services/nail-art/',
    title: 'Nail Art and Manicure | BeautyNails',
    description: 'Explore nail shapes, colours, French tips and designs at BeautyNails. Get in touch for more information or to request an appointment.',
    heading: 'Nail Art',
    intro: 'Colour, shape and a small detail. Let’s find a look that suits your hands and daily life.',
    category: 'Nails',
    imageAlt: 'Close-up of a fuchsia almond-shaped nail design',
    sections: [
      {
        heading: 'Where to start with a nail design',
        paragraphs: [
          'When you choose a nail design, consider the length and tip shape as well as the colour. Round, oval, almond and more angular shapes can each give the same polish a different look. At your consultation, describe how you like your nails to look, how you use your hands every day and what you would like to achieve. Those details make it easier to choose.',
        ],
      },
      {
        heading: 'A simple colour or a more striking design?',
        paragraphs: [
          'Nude tones, French tips, pearlescent finishes and bolder nail art details suit different tastes. Compare examples in the gallery. You might choose the colour from one photo and the shape from another. Explaining what you like about each example gives the design a clearer starting point.',
        ],
      },
      {
        heading: 'What can you share before your appointment?',
        paragraphs: [
          'Note your preferred length, the family of colours you like and any detail you would especially like to avoid. Mention daily activities such as typing, sport or work that makes frequent use of your hands. Your consultation is where you can discuss which options would work for your chosen design and what service you need.',
        ],
      },
      {
        heading: 'Information and appointments',
        paragraphs: [
          'When you request a nail art appointment, share any reference images you have chosen and any questions. You can ask about what the service includes, available times and current pricing. The appointment form prepares a WhatsApp draft for you to send. Confirm the details of your appointment directly with BeautyNails.',
        ],
      },
    ],
  },
  '/hizmetler/protez-tirnak/': {
    path: '/en/services/nail-extensions/',
    title: 'Nail Extensions | BeautyNails',
    description: 'Plan your nail extensions at BeautyNails. Choose a length and shape, ask about the current price, and confirm your appointment and the studio address via WhatsApp.',
    heading: 'Nail Extensions',
    intro: 'Add length and choose a shape that works for you. Share your preferences with BeautyNails when you request an appointment.',
    category: 'Nails',
    imageAlt: 'Close-up of glossy fuchsia nails',
    sections: [
      {
        heading: 'Choose a shape and length',
        paragraphs: [
          'Think about how you use your hands during the day. A shorter length might be more comfortable if you type often, play an instrument or work with your hands. If a reference photo catches your eye, point out the detail you like, such as the rounded tips or how far the nails extend beyond the fingertips.',
        ],
      },
      {
        heading: 'Mention any existing coating or extensions',
        paragraphs: [
          'Tell BeautyNails if you already have polish, a coating or extensions on your nails. Share a current photo if that helps explain what is on them. Ask whether removal is needed and whether it can be included in the same appointment. Follow the preparation instructions the studio gives you.',
        ],
      },
      {
        heading: 'Confirm what is included and the current price',
        paragraphs: [
          'Use the appointment form to prepare a WhatsApp message with your preferred time and any references. When you send the message, ask what the service includes, what it currently costs and how much time to set aside. Wait for BeautyNails to confirm your appointment before making plans around it.',
        ],
      },
      {
        heading: 'Travelling from Maltepe?',
        paragraphs: [
          'Ask for the appointment address or a map pin in the same WhatsApp chat. Use the location BeautyNails confirms to plan your journey from Maltepe. Check the address and time together before you set off, and ask about the entrance if you need directions once you arrive.',
        ],
      },
    ],
  },
  '/hizmetler/ipek-kirpik/': {
    path: '/en/services/eyelash-extensions/',
    title: 'Silk Lash Extensions | BeautyNails',
    description: 'Discuss length, fullness and the look you want from silk lash extensions at BeautyNails. Ask about the service and available appointments.',
    heading: 'Silk Lash Extensions',
    intro: 'Describe the look you want. We can discuss length, fullness and where you would like the emphasis to be.',
    category: 'Lashes',
    imageAlt: 'Close-up of a delicate lash curl on a closed eye',
    sections: [
      {
        heading: 'Find the look you want together',
        paragraphs: [
          'You do not need to know the name of a silk lash extension style. Saying whether you want a subtle look or a stronger accent is enough to start the conversation. Use your everyday makeup and examples you like to describe the look you are after.',
        ],
      },
      {
        heading: 'Choosing length and fullness',
        paragraphs: [
          'Lighting and makeup contribute to the effect you like in a photo. When you show a reference, describe the particular detail you like as well. It might be the emphasis at the outer corner, a softer outline or the overall fullness. Discuss the options available to you at the consultation.',
        ],
      },
      {
        heading: 'How to prepare for your consultation',
        paragraphs: [
          'Make a note of what you liked about previous lash looks and what you would change. You can also mention whether you wear glasses and how you usually do your makeup. Before the service, ask what it involves, which options may suit you and what to consider afterwards.',
        ],
      },
      {
        heading: 'Request a lash extension appointment',
        paragraphs: [
          'Select Silk Lash Extensions on the appointment form to share your questions and availability. The form prepares a WhatsApp draft for you to send. When BeautyNails replies, you can confirm the service details, available times and current pricing.',
        ],
      },
    ],
  },
  '/hizmetler/kalici-makyaj/': {
    path: '/en/services/permanent-makeup/',
    title: 'Permanent Makeup | BeautyNails',
    description: 'Discuss the colour, shape and look you want from permanent makeup at BeautyNails. Ask what the service includes and request an appointment.',
    heading: 'Permanent Makeup',
    intro: 'Describe the colours and look you like. We can discuss the options, your expectations and your questions before the service.',
    category: 'Makeup',
    imageAlt: 'Close-up of rose-pink lip colour',
    sections: [
      {
        heading: 'Describe the look you have in mind',
        paragraphs: [
          'Start your permanent makeup consultation by describing the colours and lines you like in your everyday makeup. Use examples to explain whether you want a more defined look or a softer accent. A photo you like can help explain your expectations, with the result to be discussed at the consultation.',
        ],
      },
      {
        heading: 'Consider colour and shape together',
        paragraphs: [
          'Lighting, the screen and the rest of the makeup can affect how a colour appears in a photo. At your consultation, discuss the colour family and how much definition you want. Mention any colour or line you would prefer to avoid as well as the looks you like.',
        ],
      },
      {
        heading: 'Questions to ask before the service',
        paragraphs: [
          'Ask directly which services are available, what the procedure includes and how suitable options are assessed. Ask BeautyNails for details about preparation, what happens afterwards and any follow-up. Share any personal circumstances and questions relevant to the procedure during the consultation. Take time to consider the information alongside any images you have chosen.',
        ],
      },
      {
        heading: 'Get in touch for more information',
        paragraphs: [
          'Select Permanent Makeup in the appointment request and use the notes field to describe the look you are interested in. Ask about what the service includes, available times and current pricing on WhatsApp. The form prepares a message draft for you to send.',
        ],
      },
    ],
  },
  '/hizmetler/erkek-manikur-pedikur/': {
    path: '/en/services/mens-manicure-pedicure/',
    title: 'Men’s Manicure and Pedicure | BeautyNails',
    description: 'Discuss length, shape and your preferred finish for a men’s manicure or pedicure at BeautyNails. Contact us for appointment information.',
    heading: 'Men’s Manicure & Pedicure',
    intro: 'Let’s discuss hand and foot care, including the length and finish that suit your daily life.',
    category: 'Men’s grooming',
    imageAlt: 'A naturally groomed man’s hand against dark fabric',
    sections: [
      {
        heading: 'Consider hand and foot care separately',
        paragraphs: [
          'Preferences vary for men’s manicures and pedicures. The nail length you prefer for your hands may differ from what you prefer for your feet. When you request an appointment, mention whether you are interested in a manicure, a pedicure or both. That gives the consultation a clear starting point.',
        ],
      },
      {
        heading: 'What does a natural look mean to you?',
        paragraphs: [
          'Some people prefer a more matte, understated finish, while others prefer more definition. An example can help you explain what natural, short or well groomed means to you. Mention the nail length you are used to and any look you especially want to avoid.',
        ],
      },
      {
        heading: 'Choose what suits your daily life',
        paragraphs: [
          'Your job, playing an instrument, sport and how you use your hands may affect your preferred length or shape. Bring up those details at the consultation. If this is your first appointment, you can ask about your options and what the service includes while you decide.',
        ],
      },
      {
        heading: 'Request a men’s grooming appointment',
        paragraphs: [
          'The Book an Appointment button on this page selects men’s manicure and pedicure for you. Use the notes field to say whether you want hand care, foot care or both, and add any questions. You send the WhatsApp draft yourself. Confirm the available time, current price and service details directly with BeautyNails.',
        ],
      },
    ],
  },
  '/yazilar/tirnak-sekli/': {
    path: '/en/journal/nail-shape/',
    title: journalSummaries['tirnak-sekli'].title + ' | BeautyNails',
    description: journalSummaries['tirnak-sekli'].excerpt,
    heading: journalSummaries['tirnak-sekli'].title,
    intro: journalSummaries['tirnak-sekli'].excerpt,
    category: journalSummaries['tirnak-sekli'].category,
    imageAlt: 'Almond-shaped nails in pearlescent tones',
    sections: [
      {
        heading: 'Start with your daily routine',
        paragraphs: [
          'Think about how you use your phone and keyboard, the sports you play, your work and the jewellery you like to wear. All of these can inform your nail choice. A long style you like in a photo may feel different in your own daily routine. At your appointment, explain how you use your hands as well as the look you want. A short, defined silhouette can be just as striking as a longer design.',
        ],
      },
      {
        heading: 'Look at the silhouette before the colour',
        paragraphs: [
          'Round, oval, almond and angular tips each make the same colour look different. Compare simple examples in similar shades first. This lets you focus on the shape without being distracted by shine or pattern. Notice whether you prefer sharper lines or softer curves. Looking at the whole hand also makes for a better comparison than zooming in on a single finger.',
        ],
      },
      {
        heading: 'Choose a few references with clear details',
        paragraphs: [
          'Pick two or three examples from the many images you like. Identify the detail that appeals to you in each one, such as the length in one, the colour in another or a fine French tip in a third. Discussing those details gives a clearer brief than asking for a photograph to be copied exactly. Consider how the design will look on your own hand and discuss the available options before deciding. You can also show a detail you would like to avoid. A French tip you find too wide or a nail that looks too long is as helpful a clue as the features you do like. Even one small detail from a design can give you a starting point.',
        ],
      },
      {
        heading: 'Make the final choice with the whole look in mind',
        paragraphs: [
          'Colour, length, shape and pattern can take different roles in the design. Pair a vivid fuchsia with a plain finish, or balance a pronounced silhouette with a quieter shade. Before your appointment, note a colour family, your preferred length and one detail you want to keep. Include anything you are still unsure about. That gives you a concrete place to begin discussing a look that feels like yours.',
        ],
      },
    ],
  },
  '/yazilar/kirpik-ifadesi/': {
    path: '/en/journal/lash-style/',
    title: journalSummaries['kirpik-ifadesi'].title + ' | BeautyNails',
    description: journalSummaries['kirpik-ifadesi'].excerpt,
    heading: journalSummaries['kirpik-ifadesi'].title,
    intro: journalSummaries['kirpik-ifadesi'].excerpt,
    category: journalSummaries['kirpik-ifadesi'].category,
    imageAlt: 'Close-up of a delicate lash curl on a closed eye',
    sections: [
      {
        heading: 'Start with how you want the lashes to look',
        paragraphs: [
          'The name of a lash style is optional. Describe how defined your everyday makeup is, what you enjoy seeing in the mirror and which looks you would avoid. Saying “I want my eyes to stand out without overpowering the rest of my makeup” can be as helpful as bringing a photo. Start the consultation with that personal preference.',
        ],
      },
      {
        heading: 'Look at the reference photo together',
        paragraphs: [
          'Lighting, camera angle and eye makeup all contribute to the effect of the lashes in a photo. When you show an example, explain which detail you like. Is it the emphasis at the outer corner, softer-looking tips or the overall simplicity? Use that detail to start the conversation about what may work for you.',
        ],
      },
      {
        heading: 'Think about your everyday look',
        paragraphs: [
          'If you usually go without makeup, say so. Mention whether you wear strong eyeliner or glasses, or whether you are getting ready for a special event. The look you enjoy during the day may differ from what you like in a photo. Compare your preference with simple examples photographed in daylight. If you have tried a look before, note what you liked and what you would change. Your own photos can help here. Showing one photo you feel good in and another that looks too bold to you makes it easier to discuss the difference using personal examples. The images you choose reflect your taste too.',
        ],
      },
      {
        heading: 'Leave the consultation with a clear brief',
        paragraphs: [
          'Before the service, discuss suitable options with the specialist. Make sure you share the same understanding of fullness, length and where to place emphasis. Similar words can describe different expectations, so use an example to show what “natural” means to you. Ask about anything you are unsure of. The consultation gives you a way to describe the result you want without having to learn the names of every style.',
        ],
      },
    ],
  },
  '/yazilar/erkek-bakimi/': {
    path: '/en/journal/mens-grooming/',
    title: journalSummaries['erkek-bakimi'].title + ' | BeautyNails',
    description: journalSummaries['erkek-bakimi'].excerpt,
    heading: journalSummaries['erkek-bakimi'].title,
    intro: journalSummaries['erkek-bakimi'].excerpt,
    category: journalSummaries['erkek-bakimi'].category,
    imageAlt: 'A naturally groomed man’s hand against dark fabric',
    sections: [
      {
        heading: 'A well-groomed look can take different forms',
        paragraphs: [
          'You can choose a well-groomed look with a subtle sheen. At your appointment, say whether you prefer a natural, understated or more defined finish. “I want it to look untouched” and “I want it to look tidy and defined” may describe different expectations. Start by describing how you would like your hands to look. This is a useful conversation even if you have never had a manicure.',
        ],
      },
      {
        heading: 'Discuss length in terms of your daily routine',
        paragraphs: [
          'Working at a desk, playing an instrument, doing sport or working with your hands may all affect your preference. Mention the nail length you are used to and shapes you find uncomfortable. Discuss whether you like a very short look at the consultation. If you prefer different looks for your hands and feet, consider each separately.',
        ],
      },
      {
        heading: 'Show the finish you have in mind',
        paragraphs: [
          'Matte, natural and glossy can mean different things to different people. If possible, look at examples of finishes and point out the one that appeals to you. If you bring a photo, choose a simple one that shows the whole hand. Explain the specific detail you like so the reflection from the lighting is not mistaken for the finish you want. Discuss whether you prefer a coloured or clear finish before the service starts. Think about the look you want at work, in everyday life or at an event. The clothes and accessories you like can also help you describe your preference.',
        ],
      },
      {
        heading: 'Make a short note for your first appointment',
        paragraphs: [
          'In your appointment request, mention whether you want hand care, foot care or both. Note your preferred length and finish, and add any particular questions. You can discuss anything you are still deciding at the consultation. The aim is to understand the options and choose a look that feels right for your style. These small choices matter even if you want a very understated result.',
        ],
      },
    ],
  },
  '/hizmetler/': {
    path: '/en/services/',
    title: 'Nails, Lashes, Permanent Makeup and Men’s Grooming | BeautyNails',
    description: 'Explore BeautyNails nail art, silk lash extensions, permanent makeup and men’s manicure and pedicure. Find service and appointment details.',
    heading: 'Care tailored to you.',
    intro: 'Let’s talk through your preferences for nails, lashes, makeup and men’s grooming. Explore the details of the service that interests you.',
    category: 'Services',
    sections: [],
  },
  '/yazilar/': {
    path: '/en/journal/',
    title: 'Care Journal: Nails, Lashes and Men’s Grooming | BeautyNails',
    description: 'Read the BeautyNails care journal for notes on choosing a nail shape, describing your lash style and planning a men’s manicure or pedicure.',
    heading: 'Care journal.',
    intro: 'Notes to help you choose the look you want for nails, lashes and men’s grooming.',
    category: 'Beauty & care',
    sections: [],
  },
}
