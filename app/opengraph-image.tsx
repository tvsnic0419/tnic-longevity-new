import { OgImage } from '@/lib/og-image';

export const alt = 'The NICO Starter Questionnaire — TNiC';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return OgImage({
    title: 'The NICO Starter Questionnaire',
    subtitle: 'Nine questions → an evidence-graded longevity stack, safety-screened against your meds. Free, private, no account.',
  });
}
