export interface Feedback {
  id?: string;
  authorInitials: string;
  rating: number;
  productName: string;
  comment: string;
  date: Date;
  verified: boolean;
}

export interface FeedbackStats {
  averageRating: number;
  totalCount: number;
  ratingDistribution: { [key: number]: number };
}
