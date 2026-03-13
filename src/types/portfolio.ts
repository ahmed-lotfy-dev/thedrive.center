export interface PortfolioCar {
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

export interface PortfolioCarWithMedia extends PortfolioCar {
  media: {
    id: string;
    url: string;
    type: string;
    order: number | null;
  }[];
}

export interface PortfolioFormValues {
  id?: string;
  title: string;
  description: string;
  coverImageUrl: string;
  videoUrl?: string;
  serviceType: string;
  galleryUrls?: string;
}
