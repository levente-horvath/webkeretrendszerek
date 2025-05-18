import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ratingStars',
  standalone: true
})
export class RatingStarsPipe implements PipeTransform {
  transform(rating: number): string {
    if (!rating || rating < 0) {
      return '';
    }
    
    // Limit rating to 5
    const limitedRating = Math.min(rating, 5);
    
    // Calculate full, half and empty stars
    const fullStars = Math.floor(limitedRating);
    const hasHalfStar = limitedRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    // Create the star string using Unicode characters
    let result = '★'.repeat(fullStars);
    
    if (hasHalfStar) {
      result += '½';
    }
    
    result += '☆'.repeat(emptyStars);
    
    return result;
  }
} 