// src/screens/onboarding/slides.ts

export type OnboardingSlide = {
  id: string;
  title: string;
  highlight: string;
  image: any;
  cta: string;
};

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: 'grace',
    title: 'GRACE',
    highlight: 'Our Mindset',
    image: require('../../assets/images/onboarding/onboard1.png'),
    cta: 'NEXT',
  },
  {
    id: 'profit',
    title: 'PROFITING',
    highlight: 'Our Lifestyle',
    image: require('../../assets/images/onboarding/onboard2.jpeg'),
    cta: 'NEXT',
  },
  {
    id: 'started',
    title: 'Experience Jesus in His',
    highlight: 'LOVE and POWER',
    image: require('../../assets/images/onboarding/onboard3.png'),
    cta: 'GET STARTED',
  },
];
