import os
import pickle
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

def make_svg_cover(title, author="Unknown Author"):
    import urllib.parse
    safe_title = title.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")[:40]
    safe_author = author.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")[:30]
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450" width="300" height="450">
  <rect width="300" height="450" fill="#131413" stroke="#222522" stroke-width="2"/>
  <line x1="24" y1="24" x2="276" y2="24" stroke="#9be28b" stroke-width="2" opacity="0.6"/>
  <text x="30" y="60" fill="#9be28b" font-family="monospace" font-size="11" letter-spacing="2">// CS22 MODEL RECORD</text>
  <text x="30" y="180" fill="#e8e6df" font-family="sans-serif" font-weight="700" font-size="20">{safe_title}</text>
  <text x="30" y="215" fill="#a5a39c" font-family="monospace" font-size="12">BY {safe_author.upper()}</text>
  <line x1="24" y1="410" x2="276" y2="410" stroke="#222522" stroke-width="1"/>
  <text x="30" y="430" fill="#72706a" font-family="monospace" font-size="10">PAGEMATCH DISCOVERY ENGINE</text>
</svg>'''
    return "data:image/svg+xml;utf8," + urllib.parse.quote(svg)

class BookModelEngine:
    _instance = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = BookModelEngine()
        return cls._instance

    def __init__(self):
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        model_path = os.path.join(base_dir, 'datasets', 'book_engine.pkl')
        
        print(f"📦 Loading book recommendation model from: {model_path}")
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at {model_path}")

        with open(model_path, 'rb') as f:
            engine = pickle.load(f)

        self.df = engine['data'].reset_index(drop=True)
        self.tfidf = engine['tfidf']
        self.cosine_sim = engine['cosine_sim']
        self.metadata = engine.get('metadata', {})
        
        # Precompute TF-IDF matrix for query vector transformations
        print("⚡ Pre-computing TF-IDF feature matrix...")
        features = self.df['combined_features'].fillna('')
        self.tfidf_matrix = self.tfidf.transform(features)
        
        # Pre-clean string series for fast querying
        self.lower_titles = self.df['title'].astype(str).str.lower().str.strip()
        self.lower_authors = self.df['authors'].astype(str).str.lower().str.strip()
        self.lower_categories = self.df['categories'].astype(str).str.lower().str.strip()
        self.lower_features = features.astype(str).str.lower()
        
        print(f"✅ Model loaded successfully: {len(self.df)} books indexed. Metadata: {self.metadata}")

    def _format_row(self, row, score=None, match_type='model_semantic'):
        title_str = str(row.get('title', 'Untitled')).title()

        authors = row.get('authors')
        if isinstance(authors, str):
            author_list = [a.strip() for a in authors.replace(';', ',').split(',') if a.strip()]
        elif isinstance(authors, list):
            author_list = authors
        else:
            author_list = ['Unknown Author']
        author_display = author_list[0] if author_list else 'Unknown Author'

        thumbnail = row.get('thumbnail')
        if thumbnail and isinstance(thumbnail, str) and thumbnail.strip().startswith('http'):
            thumbnail = thumbnail.replace('http://', 'https://')
        else:
            thumbnail = make_svg_cover(title_str, author_display)

        categories = row.get('categories')
        if isinstance(categories, str):
            category_list = [c.strip() for c in categories.replace(';', ',').split(',') if c.strip()]
        else:
            category_list = []

        rating = row.get('average_rating')
        try:
            rating_val = round(float(rating), 1) if pd.notnull(rating) else 4.8
        except (ValueError, TypeError):
            rating_val = 4.8

        title_str = str(row.get('title', 'Untitled')).title()
        
        return {
            "id": str(row.get('isbn13') or row.get('isbn10') or id(row)),
            "title": title_str,
            "subtitle": str(row.get('subtitle', '')) if pd.notnull(row.get('subtitle')) else '',
            "authors": author_list,
            "averageRating": rating_val,
            "description": str(row.get('description', 'Notable literature record matched through semantic embedding analysis.')) if pd.notnull(row.get('description')) else 'Notable literature record matched through semantic embedding analysis.',
            "thumbnail": thumbnail,
            "categories": category_list,
            "publishedYear": str(int(row.get('published_year'))) if pd.notnull(row.get('published_year')) and str(row.get('published_year')).replace('.0','').isdigit() else '',
            "numPages": int(row.get('num_pages')) if pd.notnull(row.get('num_pages')) and str(row.get('num_pages')).isdigit() else None,
            "similarityScore": round(float(score), 4) if score is not None else None,
            "matchType": match_type
        }

    def search(self, query: str, top_n: int = 20, category_filter: str = None):
        """Unified Search: Combines exact keyword matching, full-text combined features, and TF-IDF semantic vector scoring."""
        if not query or not query.strip():
            return []

        q_clean = query.lower().strip()
        q_words = [w for w in q_clean.split() if len(w) > 2]
        scored_indices = {}

        # 1. Direct title matches (highest priority)
        title_mask = self.lower_titles.str.contains(q_clean, regex=False, na=False)
        for idx in self.df[title_mask].index.tolist()[:top_n]:
            scored_indices[idx] = (0.98, 'exact_title')

        # 2. Direct author matches
        author_mask = self.lower_authors.str.contains(q_clean, regex=False, na=False)
        for idx in self.df[author_mask].index.tolist()[:top_n]:
            if idx not in scored_indices:
                scored_indices[idx] = (0.92, 'author_match')

        # 3. Direct category matches
        cat_mask = self.lower_categories.str.contains(q_clean, regex=False, na=False)
        for idx in self.df[cat_mask].index.tolist()[:top_n]:
            if idx not in scored_indices:
                scored_indices[idx] = (0.88, 'category_match')

        # 4. Semantic TF-IDF Cosine Similarity
        try:
            query_vec = self.tfidf.transform([q_clean])
            if query_vec.nnz > 0:
                semantic_scores = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
                top_semantic_indices = semantic_scores.argsort()[::-1][:top_n * 2]

                for idx in top_semantic_indices:
                    score = float(semantic_scores[idx])
                    if score > 0.01:
                        if idx not in scored_indices:
                            scored_indices[idx] = (score, 'semantic_similarity')
                        else:
                            orig_score, match_type = scored_indices[idx]
                            scored_indices[idx] = (orig_score + score * 0.2, match_type)
        except Exception as tfidf_err:
            print("TF-IDF transform notice:", tfidf_err)

        # 5. Combined features substring search (handles keywords anywhere in description/notes)
        if len(scored_indices) < top_n:
            feat_mask = self.lower_features.str.contains(q_clean, regex=False, na=False)
            for idx in self.df[feat_mask].index.tolist()[:top_n]:
                if idx not in scored_indices:
                    scored_indices[idx] = (0.75, 'content_match')

        # 6. Word-level matching for multi-word queries
        if len(scored_indices) < 5 and q_words:
            for word in q_words:
                w_mask = self.lower_titles.str.contains(word, regex=False, na=False) | self.lower_authors.str.contains(word, regex=False, na=False) | self.lower_categories.str.contains(word, regex=False, na=False)
                for idx in self.df[w_mask].index.tolist()[:10]:
                    if idx not in scored_indices:
                        scored_indices[idx] = (0.60, 'keyword_overlap')

        # 7. Precomputed pairwise cosine similarity expansion
        if title_mask.any():
            primary_idx = self.df[title_mask].index.tolist()[0]
            sim_row = self.cosine_sim[primary_idx]
            top_rec_indices = sim_row.argsort()[::-1][1:6]
            for rec_idx in top_rec_indices:
                rec_score = float(sim_row[rec_idx])
                if rec_idx not in scored_indices:
                    scored_indices[rec_idx] = (rec_score * 0.85, 'hybrid_collaborative')

        # Fallback: if absolutely 0 results found (e.g. unknown word), return top-rated books
        if not scored_indices:
            top_popular = self.df.sort_values(by=['average_rating', 'ratings_count'], ascending=[False, False]).index.tolist()[:top_n]
            for idx in top_popular:
                scored_indices[idx] = (0.50, 'curated_discovery')

        # Sort candidates descending by computed score
        sorted_candidates = sorted(scored_indices.items(), key=lambda x: x[1][0], reverse=True)

        results = []
        for idx, (score, match_type) in sorted_candidates:
            row = self.df.iloc[idx]
            if category_filter and category_filter != 'all':
                cat_str = str(row.get('categories', '')).lower()
                if category_filter.lower() not in cat_str:
                    continue

            results.append(self._format_row(row, score=score, match_type=match_type))
            if len(results) >= top_n:
                break

        return results

    def get_recommendations_for_book(self, book_identifier: str, top_n: int = 10):
        """Uses precomputed (6511, 6511) cosine_sim matrix to fetch the most similar books."""
        b_clean = book_identifier.lower().strip()
        matches = self.df[self.lower_titles == b_clean]
        if matches.empty:
            matches = self.df[self.lower_titles.str.contains(b_clean, regex=False, na=False)]

        if matches.empty:
            return self.search(book_identifier, top_n=top_n)

        idx = matches.index[0]
        sim_scores = list(enumerate(self.cosine_sim[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:top_n + 1]
        
        results = []
        for rec_idx, score in sim_scores:
            results.append(self._format_row(self.df.iloc[rec_idx], score=score, match_type='cosine_sim_matrix'))
        return results

    def get_featured_book(self):
        """Returns a canonical featured masterpiece from the real dataset."""
        # Look for iconic masterpieces like Dune, 1984, or The Hobbit
        masterpieces = self.df[self.lower_titles.isin(['dune', '1984', 'the hobbit, or, there and back again', 'brave new world', 'fahrenheit 451'])]
        if not masterpieces.empty:
            row = masterpieces.iloc[0]
        else:
            row = self.df.sort_values(by=['ratings_count', 'average_rating'], ascending=[False, False]).iloc[0]

        return self._format_row(row, match_type='featured_masterpiece')

    def get_catalog_books(self):
        """Returns categorized collections of real literature from the model catalog."""
        collections = []

        # 1. Fiction & Literature
        fic = self.df[self.lower_categories.str.contains('fiction', na=False) & ~self.lower_categories.str.contains('science|comic', na=False)].sort_values(by='average_rating', ascending=False).head(12)
        collections.append({
            "indexStr": "01",
            "title": "Fiction & Literary Masterpieces",
            "books": [self._format_row(row, match_type='literature') for _, row in fic.iterrows()]
        })

        # 2. Cognitive Science, Philosophy & Systems
        think = self.df[self.lower_categories.str.contains('psychology|philosophy|science|business|economics', na=False)].sort_values(by=['average_rating', 'ratings_count'], ascending=[False, False]).head(12)
        collections.append({
            "indexStr": "02",
            "title": "Systems, Cognitive Science & Philosophy",
            "books": [self._format_row(row, match_type='cognition') for _, row in think.iterrows()]
        })

        # 3. World History & Biographies
        hist = self.df[self.lower_categories.str.contains('history|biography', na=False)].sort_values(by='average_rating', ascending=False).head(12)
        collections.append({
            "indexStr": "03",
            "title": "Historical Records & Biographies",
            "books": [self._format_row(row, match_type='history') for _, row in hist.iterrows()]
        })

        return collections

    def get_catalog_manga(self):
        """Returns real graphic novels, fantasy, and illustrated works from the dataset."""
        sections = []

        # 1. Comics & Graphic Novels
        comics = self.df[self.lower_categories.str.contains('comic|graphic', na=False)].sort_values(by=['average_rating', 'ratings_count'], ascending=[False, False]).head(12)
        if len(comics) < 6:
            comics = self.df[self.lower_categories.str.contains('comic|graphic|fantasy', na=False)].sort_values(by='average_rating', ascending=False).head(12)

        sections.append({
            "indexStr": "01",
            "title": "Comics & Illustrated Graphic Novels",
            "items": [self._format_row(row, match_type='graphic_novel') for _, row in comics.iterrows()]
        })

        # 2. Epic Fantasy Fiction
        fantasy = self.df[self.lower_categories.str.contains('fantasy', na=False)].sort_values(by=['average_rating', 'ratings_count'], ascending=[False, False]).head(12)
        sections.append({
            "indexStr": "02",
            "title": "Epic Fantasy & Dark Mythos",
            "items": [self._format_row(row, match_type='fantasy') for _, row in fantasy.iterrows()]
        })

        # 3. Mystery & Detective Serials
        mystery = self.df[self.lower_categories.str.contains('detective|mystery|crime', na=False)].sort_values(by='average_rating', ascending=False).head(12)
        sections.append({
            "indexStr": "03",
            "title": "Detective Narratives & Mystery Serials",
            "items": [self._format_row(row, match_type='mystery') for _, row in mystery.iterrows()]
        })

        return sections

    def get_curated_clusters(self):
        """Generates dynamic, rich curated clusters directly from the model database."""
        clusters = []

        # Cluster 1: High-rated Masterpieces
        top_rated = self.df.sort_values(by=['average_rating', 'ratings_count'], ascending=[False, False]).head(12)
        clusters.append({
            "category": "High-Impact Masterpieces",
            "eyebrow": "01 // TOP-RATED INDEX",
            "books": [self._format_row(row, match_type='curated_cluster') for _, row in top_rated.iterrows()]
        })

        # Cluster 2: Speculative Fiction & Sci-Fi
        scifi = self.df[self.lower_categories.str.contains('fiction|science|fantasy', regex=True, na=False)].sort_values(by='average_rating', ascending=False).head(12)
        clusters.append({
            "category": "Speculative & Science Fiction",
            "eyebrow": "02 // HYBRID VECTOR CLUSTER",
            "books": [self._format_row(row, match_type='curated_cluster') for _, row in scifi.iterrows()]
        })

        # Cluster 3: Psychology & Cognitive Behavior
        psych = self.df[self.lower_categories.str.contains('psychology|philosophy|self-help', regex=True, na=False)].sort_values(by='average_rating', ascending=False).head(12)
        clusters.append({
            "category": "Cognitive Behavior & Philosophy",
            "eyebrow": "03 // BEHAVIORAL MATRIX",
            "books": [self._format_row(row, match_type='curated_cluster') for _, row in psych.iterrows()]
        })

        # Cluster 4: History & Geopolitics
        history = self.df[self.lower_categories.str.contains('history|biography|political', regex=True, na=False)].sort_values(by='average_rating', ascending=False).head(12)
        clusters.append({
            "category": "World History & Biographies",
            "eyebrow": "04 // HISTORICAL TAXONOMY",
            "books": [self._format_row(row, match_type='curated_cluster') for _, row in history.iterrows()]
        })

        return clusters
