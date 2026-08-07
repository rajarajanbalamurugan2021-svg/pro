import { FAQItem } from '../types';

export interface FAQMatchResult {
  topMatch: FAQItem | null;
  confidence: number; // 0.0 to 1.0
  relatedQuestions: string[];
  suggestedFAQs: FAQItem[];
  allMatches: { faq: FAQItem; score: number }[];
  category?: string;
  query: string;
}

// Common English & domain stop words to filter out
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'can', 'could', 'should', 'would',
  'will', 'shall', 'may', 'might', 'must', 'to', 'of', 'in', 'for', 'on',
  'with', 'at', 'by', 'from', 'up', 'about', 'into', 'over', 'after', 'how',
  'what', 'why', 'where', 'when', 'who', 'which', 'i', 'me', 'my', 'myself',
  'you', 'your', 'we', 'our', 'us', 'they', 'them', 'their', 'it', 'its', 'please',
  'tell', 'know', 'give', 'show', 'check', 'get', 'want', 'need'
]);

/**
 * Calculates Levenshtein Distance for typo tolerance / fuzzy matching
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  const lenA = a.length;
  const lenB = b.length;

  for (let i = 0; i <= lenA; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= lenB; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= lenA; i++) {
    for (let j = 1; j <= lenB; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[lenA][lenB];
}

/**
 * Fuzzy word match: checks if word A matches word B within an allowed typo distance
 */
export function fuzzyWordMatch(wordA: string, wordB: string): boolean {
  if (wordA === wordB) return true;
  if (wordA.includes(wordB) || wordB.includes(wordA)) return true;
  
  const minLen = Math.min(wordA.length, wordB.length);
  if (minLen < 3) return wordA === wordB;

  const maxAllowedDistance = minLen > 6 ? 2 : 1;
  const dist = levenshteinDistance(wordA, wordB);
  return dist <= maxAllowedDistance;
}

/**
 * Tokenize text into normalized lowercase words, stripping punctuation
 */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

/**
 * Score a single FAQ item against user query tokens
 */
export function scoreFAQ(faq: FAQItem, query: string, queryTokens: string[]): number {
  if (faq.status === 'inactive') return 0;

  const normalizedQuery = query.toLowerCase().trim();
  const normalizedQuestion = faq.question.toLowerCase().trim();

  // 1. Exact string match bonus
  if (normalizedQuestion === normalizedQuery) return 1.0;
  if (normalizedQuestion.includes(normalizedQuery) || normalizedQuery.includes(normalizedQuestion)) return 0.95;

  const questionTokens = tokenize(faq.question);
  const keywordsTokens = (faq.keywords || []).flatMap((k) => tokenize(k));
  const answerTokens = tokenize(faq.answer);

  let totalScore = 0;
  let matchesCount = 0;

  for (const qToken of queryTokens) {
    let tokenScore = 0;

    // Check exact or fuzzy match in question
    for (const questToken of questionTokens) {
      if (qToken === questToken) {
        tokenScore = Math.max(tokenScore, 0.45);
      } else if (fuzzyWordMatch(qToken, questToken)) {
        tokenScore = Math.max(tokenScore, 0.35);
      }
    }

    // Check exact or fuzzy match in keywords
    for (const kwToken of keywordsTokens) {
      if (qToken === kwToken) {
        tokenScore = Math.max(tokenScore, 0.50);
      } else if (fuzzyWordMatch(qToken, kwToken)) {
        tokenScore = Math.max(tokenScore, 0.40);
      }
    }

    // Check exact match in answer
    for (const ansToken of answerTokens) {
      if (qToken === ansToken) {
        tokenScore = Math.max(tokenScore, 0.15);
      }
    }

    if (tokenScore > 0) {
      totalScore += tokenScore;
      matchesCount++;
    }
  }

  if (queryTokens.length === 0) return 0;

  // Jaccard token overlap ratio
  const queryCoverage = matchesCount / queryTokens.length;
  const rawConfidence = (totalScore / queryTokens.length) * queryCoverage;

  // Cap at 0.98 unless exact
  return Math.min(0.98, rawConfidence);
}

/**
 * Main offline search engine function
 */
export function findBestFAQMatch(
  userQuery: string,
  faqList: FAQItem[],
  selectedCategory?: string,
  confidenceThreshold = 0.30
): FAQMatchResult {
  const queryTokens = tokenize(userQuery);

  let activeFAQs = faqList.filter((f) => f.status !== 'inactive');
  if (selectedCategory && selectedCategory !== 'All') {
    activeFAQs = activeFAQs.filter((f) => f.category === selectedCategory);
  }

  if (!userQuery.trim() || activeFAQs.length === 0) {
    return {
      topMatch: null,
      confidence: 0,
      relatedQuestions: [],
      suggestedFAQs: activeFAQs.slice(0, 5),
      allMatches: [],
      category: selectedCategory,
      query: userQuery
    };
  }

  const scoredMatches = activeFAQs
    .map((faq) => ({
      faq,
      score: scoreFAQ(faq, userQuery, queryTokens)
    }))
    .filter((item) => item.score > 0.1)
    .sort((a, b) => b.score - a.score);

  const top = scoredMatches[0];
  const topMatch = top && top.score >= confidenceThreshold ? top.faq : null;
  const confidence = top ? top.score : 0;

  // Extract related questions
  let relatedQuestions: string[] = [];
  if (topMatch && topMatch.relatedQuestions && topMatch.relatedQuestions.length > 0) {
    relatedQuestions = topMatch.relatedQuestions;
  } else if (scoredMatches.length > 1) {
    relatedQuestions = scoredMatches
      .slice(1, 4)
      .map((m) => m.faq.question);
  }

  // Fallback suggested FAQs if confidence is low or no exact match
  const suggestedFAQs = scoredMatches
    .slice(0, 4)
    .map((m) => m.faq);

  return {
    topMatch,
    confidence: Number(confidence.toFixed(2)),
    relatedQuestions,
    suggestedFAQs: suggestedFAQs.length > 0 ? suggestedFAQs : activeFAQs.slice(0, 4),
    allMatches: scoredMatches,
    category: selectedCategory,
    query: userQuery
  };
}

/**
 * Generates live search suggestions while the user types
 */
export function getFAQSearchSuggestions(
  input: string,
  faqList: FAQItem[],
  limit = 5
): FAQItem[] {
  const query = input.trim().toLowerCase();
  if (!query) return [];

  const tokens = tokenize(query);

  return faqList
    .filter((f) => f.status !== 'inactive')
    .map((faq) => {
      let score = 0;
      const q = faq.question.toLowerCase();
      if (q.startsWith(query)) score += 10;
      else if (q.includes(query)) score += 5;

      const keywords = (faq.keywords || []).map((k) => k.toLowerCase());
      if (keywords.some((k) => k.includes(query))) score += 4;

      for (const t of tokens) {
        if (q.includes(t)) score += 2;
      }

      return { faq, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.faq);
}
