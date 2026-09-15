// src/utils/interactionTracker.js - Operator interaction & preference vector tracking

const DEFAULT_SEED_BOOK = {
  id: "rec-seed-default",
  title: "Brave New World",
  authors: ["Aldous Huxley"],
  thumbnail: "https://books.google.com/books/content?id=a_1fDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
  categories: ["Fiction", "Classics"],
  averageRating: 4.8
};

export const getActiveProfileId = () => {
  return localStorage.getItem('selectedProfile') || 'user-default';
};

export const getLastClickedBook = () => {
  const profileId = getActiveProfileId();
  try {
    const raw = localStorage.getItem(`pm_last_clicked_${profileId}`);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return DEFAULT_SEED_BOOK;
};

export const getInteractionHistory = () => {
  const profileId = getActiveProfileId();
  try {
    const raw = localStorage.getItem(`pm_history_${profileId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return [DEFAULT_SEED_BOOK];
};

export const getLikedBooks = () => {
  const profileId = getActiveProfileId();
  try {
    const raw = localStorage.getItem(`pm_liked_${profileId}`);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return [];
};

export const isBookLiked = (bookTitle) => {
  if (!bookTitle) return false;
  const liked = getLikedBooks();
  return liked.some(b => b.title?.toLowerCase() === bookTitle.toLowerCase());
};

export const toggleLikeBook = (book) => {
  if (!book || !book.title) return false;
  const profileId = getActiveProfileId();
  const liked = getLikedBooks();
  const exists = liked.some(b => b.title?.toLowerCase() === book.title.toLowerCase());
  let updated;
  if (exists) {
    updated = liked.filter(b => b.title?.toLowerCase() !== book.title.toLowerCase());
  } else {
    updated = [book, ...liked].slice(0, 20);
  }
  localStorage.setItem(`pm_liked_${profileId}`, JSON.stringify(updated));

  // If newly liked, update active recommendation vector
  if (!exists) {
    recordBookClick(book, 'like');
  } else {
    window.dispatchEvent(new CustomEvent('pagematch:interaction-changed', {
      detail: { book, action: 'unlike' }
    }));
  }
  return !exists;
};

export const recordBookClick = (book, triggerType = 'click') => {
  if (!book || !book.title) return;
  const profileId = getActiveProfileId();

  const cleanBook = {
    id: book.id || book.book_id || `book-${Date.now()}`,
    title: book.title,
    authors: book.authors || (book.author ? [book.author] : ['Unknown Author']),
    thumbnail: book.thumbnail || book.image_url || '',
    categories: book.categories || (book.type ? [book.type] : ['Literature']),
    averageRating: book.averageRating || book.rating || '4.8',
    timestamp: Date.now(),
    triggerType
  };

  // 1. Save as latest clicked book for this profile
  localStorage.setItem(`pm_last_clicked_${profileId}`, JSON.stringify(cleanBook));

  // 2. Prepend to history (unique by title, max 8)
  const history = getInteractionHistory().filter(
    b => b.title?.toLowerCase() !== cleanBook.title.toLowerCase()
  );
  const updatedHistory = [cleanBook, ...history].slice(0, 8);
  localStorage.setItem(`pm_history_${profileId}`, JSON.stringify(updatedHistory));

  // 3. Dispatch global custom event for instant reactivity
  window.dispatchEvent(new CustomEvent('pagematch:interaction-changed', {
    detail: { book: cleanBook, history: updatedHistory, triggerType }
  }));
};
