// Same grade gradients as the original app's grade-badge CSS, kept for
// visual continuity between the old templates and this redesign.
export const GRADE_GRADIENTS = {
  1: 'linear-gradient(155deg, #48e0a0 0%, #0f6b47 100%)',
  2: 'linear-gradient(155deg, #46cdea 0%, #0d5c72 100%)',
  3: 'linear-gradient(155deg, #f0d15a 0%, #8a6a12 100%)',
  4: 'linear-gradient(155deg, #f7a05a 0%, #973f0f 100%)',
  5: 'linear-gradient(155deg, #f66385 0%, #7c1236 100%)',
}

export function gradeBackground(grade) {
  return GRADE_GRADIENTS[grade] || 'rgba(255,255,255,0.15)'
}
