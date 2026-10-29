import { z } from 'astro/zod';

export const siteSchema = z.object({
  name: z.string().min(1),
  legalName: z.string().min(1),
  ico: z.string().min(1),
  dic: z.string().min(1),
  icDph: z.string().min(1),
  registryInfo: z.string().min(1),
  street: z.string().min(1),
  city: z.string().min(1),
  zip: z.string().min(1),
  country: z.string().min(1),
  phone: z.string().min(1),
  phoneDisplay: z.string().min(1),
  email: z.email(),
  openingHours: z.string().min(1),
  deliveryArea: z.string().min(1),
  svpsRegNo: z.string().optional(),
});

export type SiteConfig = z.infer<typeof siteSchema>;

const rawSiteData: SiteConfig = {
  name: 'Passit',
  legalName: 'Passit s. r. o.',
  ico: '47358840',
  dic: 'PLACEHOLDER_DIC',
  icDph: 'PLACEHOLDER_ICDPH',
  registryInfo:
    'PLACEHOLDER_OR (napr. Zapísaná v Obchodnom registri Okresného súdu Žilina)',
  street: 'Stránske 452',
  city: 'Stránske',
  zip: '013 13',
  country: 'Slovenská republika',
  phone: '+421900000000',
  phoneDisplay: '+421 900 000 000',
  email: 'harmata@passit.sk',
  openingHours: 'Po – Pia: 8:00 – 16:30',
  deliveryArea: 'Závozy Bratislava, Trnava, Trenčín, Banská Bystrica a Košice',
  svpsRegNo: 'PLACEHOLDER_SVPS',
};

export const siteConfig: SiteConfig = siteSchema.parse(rawSiteData);
