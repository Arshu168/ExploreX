/**
 * Password validation utilities for ExploreX
 * Enforces strong password criteria:
 * - Minimum 8 characters
 * - At least one uppercase letter (A-Z)
 * - At least one lowercase letter (a-z)
 * - At least one digit (0-9)
 * - At least one special symbol (!@#$%^&*...)
 */

export interface PasswordRequirement {
  id: string;
  label: string;
  met: boolean;
}

export interface PasswordStrengthResult {
  score: number; // 0 to 4
  strengthLabel: 'Too Weak' | 'Weak' | 'Medium' | 'Strong' | 'Very Strong';
  color: string;
  isStrong: boolean;
  requirements: PasswordRequirement[];
  missingRequirements: string[];
}

export const checkPasswordStrength = (password: string): PasswordStrengthResult => {
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password);

  const requirements: PasswordRequirement[] = [
    { id: 'length', label: '8+ characters', met: hasLength },
    { id: 'upper', label: '1 uppercase letter (A-Z)', met: hasUpper },
    { id: 'lower', label: '1 lowercase letter (a-z)', met: hasLower },
    { id: 'number', label: '1 number (0-9)', met: hasNumber },
    { id: 'special', label: '1 special character (!@#$...)', met: hasSpecial },
  ];

  const metCount = requirements.filter(r => r.met).length;
  const isStrong = metCount === 5;

  const missingRequirements = requirements.filter(r => !r.met).map(r => r.label);

  let score = 0;
  let strengthLabel: PasswordStrengthResult['strengthLabel'] = 'Too Weak';
  let color = 'bg-rose-500';

  if (!password) {
    score = 0;
    strengthLabel = 'Too Weak';
    color = 'bg-slate-300 dark:bg-slate-700';
  } else if (metCount <= 2) {
    score = 1;
    strengthLabel = 'Weak';
    color = 'bg-rose-500';
  } else if (metCount <= 3) {
    score = 2;
    strengthLabel = 'Medium';
    color = 'bg-amber-500';
  } else if (metCount === 4) {
    score = 3;
    strengthLabel = 'Strong';
    color = 'bg-sky-500';
  } else {
    score = 4;
    strengthLabel = 'Very Strong';
    color = 'bg-emerald-500';
  }

  return {
    score,
    strengthLabel,
    color,
    isStrong,
    requirements,
    missingRequirements
  };
};
