import { findAllCuisines } from './date-options.repository.js';

export function getDateOptionsService() {
  const cuisines = findAllCuisines();

  return {
    cuisines,
  };
}