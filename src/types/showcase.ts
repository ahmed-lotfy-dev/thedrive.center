export interface ShowcaseCar {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImageUrl: string;
  videoUrl: string | null;
  serviceType: string;
  featured: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface ShowcaseCarWithMedia extends ShowcaseCar {
  media: {
    id: string;
    url: string;
    type: string;
    order: number | null;
  }[];
}

export interface ShowcaseFormValues {
  id?: string;
  title: string;
  description: string;
  coverImageUrl: string;
  videoUrl?: string;
  serviceType: string;
  galleryUrls?: string;
}
