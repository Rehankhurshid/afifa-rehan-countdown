# Wedding Card Preview Feature

## Overview
Added a beautiful modal preview feature that allows users to preview wedding cards from both Afifa's and Rehan's sides.

## Files Created
- **`/components/card-preview-modal.tsx`** - A new modal component that displays the wedding cards with tabs to switch between both sides

## Files Modified
- **`/components/wedding-countdown.tsx`**:
  - Added import for `CardPreviewModal` component
  - Added state: `isCardPreviewOpen` to manage modal visibility
  - Added "View Wedding Card" button between the names and countdown
  - Integrated the modal component at the bottom of the page

## Features

### Modal Component Features:
1. **Dual Card View**: Toggle between "Afifa's Card" and "Rehan's Card" using tabs
   - Tab 1: Afifa & Rehan Card (from `/Afifa & Rehan Card.pdf`)
   - Tab 2: Rehan & Afifa Card (from `/Rehan & Afifa Card.pdf`)

2. **PDF Preview**: Embedded PDF viewer with toolbar hidden for clean display

3. **Download Option**: Each card can be downloaded with a single click using the "Download Card" button

4. **Responsive Design**: 
   - Modal is fully responsive and works on mobile, tablet, and desktop
   - Maximum width of 2xl for desktop, scales down on smaller screens
   - Uses Tailwind CSS for styling

5. **Styling Consistency**:
   - Uses the wedding theme color (#c91b21 - maroon red)
   - Matches Vercel-inspired aesthetics from the main countdown
   - Smooth transitions and hover effects

### User Interaction Flow:
1. User sees "View Wedding Card" button on the main countdown page
2. Clicking the button opens the modal
3. User can switch between two card sides using the tabs
4. User can preview the PDF and download if needed
5. Close button (X) or clicking outside the modal closes it

## File References
- **PDF Files**: Located in `/public/`
  - `Afifa & Rehan Card.pdf` - Afifa's side card
  - `Rehan & Afifa Card.pdf` - Rehan's side card

## Styling Details
- Modal background: Semi-transparent black overlay (bg-black/50)
- Card styling: White background with rounded corners and shadow
- Color scheme: Maroon (#c91b21) for headers and buttons
- Button hover effect: Darker maroon (#a01820)
- Tabs: Active tab shows border-bottom in maroon color

## Future Enhancements (Optional)
- Add print functionality for the cards
- Social media sharing for card previews
- Animation when opening the modal
- Carousel view for both cards side-by-side
