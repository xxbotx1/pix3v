# AI Video Transition Generator - Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern AI tools like Midjourney, RunwayML, and Luma AI, focusing on clean, professional interfaces that emphasize the creative process and generated content.

## Core Design Elements

### A. Color Palette
**Dark Mode Primary** (matching screenshot):
- Background: 220 15% 8% (deep dark blue-gray)
- Surface: 220 15% 12% (elevated dark surface)
- Primary: 260 100% 70% (vibrant purple for CTAs)
- Text Primary: 0 0% 95% (near white)
- Text Secondary: 220 15% 65% (muted gray)
- Border: 220 15% 20% (subtle borders)
- Success: 142 76% 36% (generation complete)
- Warning: 38 92% 50% (processing status)

### B. Typography
- **Primary Font**: Inter (Google Fonts)
- **Headings**: Font weights 600-700, sizes from text-lg to text-3xl
- **Body Text**: Font weight 400-500, text-sm to text-base
- **UI Labels**: Font weight 500, text-xs to text-sm

### C. Layout System
**Spacing Units**: Use Tailwind spacing of 2, 4, 6, 8, 12, 16, 24 units
- Component padding: p-6 to p-8
- Section gaps: gap-8 to gap-12
- Container max-width: max-w-4xl
- Grid gaps: gap-6 for upload areas

### D. Component Library

**Upload Areas**:
- Large dashed border cards (min-h-48)
- Drag-and-drop visual feedback
- Preview thumbnails with overlay controls
- File type indicators

**Form Controls**:
- Dark-themed input fields with subtle borders
- Range sliders for video count selection
- Radio buttons for quality selection
- Textarea with proper contrast for prompts

**Progress Tracking**:
- Multi-step progress bars with animated fills
- Status badges with color-coded states
- Percentage indicators with smooth transitions

**Video Display**:
- Grid layout for generated videos
- Video thumbnail previews
- Download buttons with icons
- Loading skeleton states

**Navigation & Actions**:
- Primary purple buttons for main actions
- Secondary outline buttons for downloads
- Icon buttons for utility actions
- Proper hover states maintaining accessibility

### E. Key Layout Sections

1. **Header**: Simple branding with minimal navigation
2. **Upload Section**: Two-column grid for first/last images
3. **Configuration Panel**: Prompt input and generation options
4. **Progress Area**: Real-time status tracking
5. **Results Gallery**: Generated video display with controls

### F. Visual Hierarchy
- **Primary Focus**: Upload areas and generation button
- **Secondary Focus**: Configuration options and progress
- **Supporting Elements**: Status indicators and download options

## Accessibility Notes
- Maintain consistent dark theme across all form inputs
- Ensure sufficient contrast ratios (4.5:1 minimum)
- Provide clear focus indicators
- Use aria-labels for upload areas and progress states

## Images
No large hero image required. Focus on:
- Upload placeholder graphics (simple upload icons)
- Video thumbnail placeholders during generation
- Status/progress icons (checkmarks, loading spinners)
- File type indicators for supported formats