import {
  ref,
  get,
  set,
  update,
  remove,
  runTransaction,
  push,
} from 'firebase/database';
import { database } from '@/lib/firebase';
import { Article } from '@/types/article';
import { UserProfile } from '@/types/user';
import { ContributorApplication } from '@/types/application';

const getDateParts = (dateString: string) => {
  // Handle both ISO format (2025-12-01T...) and formatted string (1 December 2025)
  let date: Date;

  // Try parsing as ISO date first
  date = new Date(dateString);

  // If that didn't work or resulted in invalid date, try parsing formatted string
  if (isNaN(date.getTime())) {
    // Try parsing "1 December 2025" format
    date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error('Invalid date string:', dateString);
      throw new Error(`Invalid date format: ${dateString}`);
    }
  }

  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  console.log(`Parsed date: "${dateString}" -> ${year}/${month}/${day}`);
  return { year, month, day };
};

export async function incrementArticleViews(
  slug: string,
  date: string,
): Promise<void> {
  const { year, month, day } = getDateParts(date);
  const articleRef = ref(database, `articles/${year}/${month}/${day}/${slug}`);

  try {
    await runTransaction(articleRef, (currentData) => {
      if (currentData) {
        currentData.views = (currentData.views || 0) + 1;
      } else {
        currentData = { views: 1 };
      }
      return currentData;
    });
  } catch (error) {
    console.error('Error incrementing views:', error);
    throw error;
  }
}

export async function getArticles(): Promise<Article[]> {
  const articlesRef = ref(database, 'articles');
  try {
    const snapshot = await get(articlesRef);
    if (!snapshot.exists()) return [];

    const articles: Article[] = [];
    const data = snapshot.val();

    Object.keys(data).forEach((year) => {
      Object.keys(data[year]).forEach((month) => {
        Object.keys(data[year][month]).forEach((day) => {
          Object.keys(data[year][month][day]).forEach((slug) => {
            const article = data[year][month][day][slug];
            articles.push({
              slug,
              ...article,
              views: article.views || 0,
            });
          });
        });
      });
    });

    return articles;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export async function getArticlesByMonth(
  year: string,
  month: string,
): Promise<Article[]> {
  const monthRef = ref(database, `articles/${year}/${month}`);
  try {
    const snapshot = await get(monthRef);
    if (!snapshot.exists()) return [];

    const articles: Article[] = [];
    const data = snapshot.val();

    Object.keys(data).forEach((day) => {
      Object.keys(data[day]).forEach((slug) => {
        const article = data[day][slug];
        articles.push({
          slug,
          ...article,
        });
      });
    });

    return articles;
  } catch (error) {
    console.error('Error fetching articles by month:', error);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await getArticles();
  return (
    articles.find((article) => article.slug === decodeURIComponent(slug)) ||
    null
  );
}

export async function addArticle(article: Article): Promise<void> {
  const { year, month, day } = getDateParts(article.date);
  const articleRef = ref(
    database,
    `articles/${year}/${month}/${day}/${article.slug}`,
  );

  // Normalize date to ISO format for consistency
  const normalizedArticle = {
    ...article,
    slug: article.slug,
    views: 0,
    date: new Date(article.date).toISOString(), // Store as ISO format
    authorId: article.authorId,
    status: article.status || 'pending',
  };

  try {
    await set(articleRef, normalizedArticle);
    console.log('Article added:', article.slug);
  } catch (error) {
    console.error('Error adding article:', error);
    throw error;
  }
}

export async function updateArticle(
  slug: string,
  articleData: Partial<Article>,
): Promise<void> {
  const { year, month, day } = getDateParts(
    articleData.date || new Date().toISOString(),
  );
  const articleRef = ref(database, `articles/${year}/${month}/${day}/${slug}`);

  try {
    await update(articleRef, articleData);
    console.log('Article updated:', slug);
  } catch (error) {
    console.error('Error updating article:', error);
    throw error;
  }
}

export async function deleteArticle(date: string, slug: string): Promise<void> {
  // First, try to find the article by searching through all articles
  const articlesRef = ref(database, 'articles');

  try {
    console.log(`Searching for article to delete: ${slug}`);

    const snapshot = await get(articlesRef);
    if (!snapshot.exists()) {
      throw new Error('No articles found in database');
    }

    const data = snapshot.val();
    let foundPath: string | null = null;

    // Search through all years/months/days to find the article
    for (const year in data) {
      for (const month in data[year]) {
        for (const day in data[year][month]) {
          for (const articleSlug in data[year][month][day]) {
            if (articleSlug === slug) {
              foundPath = `articles/${year}/${month}/${day}/${slug}`;
              console.log(`Found article at path: ${foundPath}`);
              break;
            }
          }
          if (foundPath) break;
        }
        if (foundPath) break;
      }
      if (foundPath) break;
    }

    if (!foundPath) {
      console.warn(`Article not found: ${slug}`);
      throw new Error(`Article not found: ${slug}`);
    }

    // Delete from the found path
    const articleRef = ref(database, foundPath);
    await remove(articleRef);
    console.log('Article deleted successfully:', slug);
  } catch (error) {
    console.error('Error deleting article:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    throw error;
  }
}

export async function saveDraftArticle(article: Article): Promise<void> {
  const draftRef = ref(database, `drafts/${article.slug}`);
  try {
    await set(draftRef, article);
    console.log('Draft article saved:', article.slug);
  } catch (error) {
    console.error('Error saving draft article:', error);
    throw error;
  }
}

export async function loadDraftArticle(slug: string): Promise<Article | null> {
  const draftRef = ref(database, `drafts/${slug}`);
  try {
    const snapshot = await get(draftRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error('Error loading draft article:', error);
    throw error;
  }
}

export async function deleteDraftArticle(slug: string): Promise<void> {
  const draftRef = ref(database, `drafts/${slug}`);
  try {
    await remove(draftRef);
    console.log('Draft article deleted:', slug);
  } catch (error) {
    console.error('Error deleting draft article:', error);
    throw error;
  }
}

export async function getUsers(): Promise<UserProfile[]> {
  const usersRef = ref(database, 'users');
  try {
    const snapshot = await get(usersRef);
    if (!snapshot.exists()) return [];
    const users: UserProfile[] = [];
    snapshot.forEach((childSnapshot) => {
      users.push(childSnapshot.val());
    });
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export async function updateUserRole(
  uid: string,
  role: 'admin' | 'contributor' | 'user',
): Promise<void> {
  const userRef = ref(database, `users/${uid}`);
  try {
    await update(userRef, { role });
    console.log(`User ${uid} role updated to ${role}`);
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
}

export async function toggleUserSuspension(
  uid: string,
  suspended: boolean,
): Promise<void> {
  const userRef = ref(database, `users/${uid}`);
  try {
    await update(userRef, { suspended });
    console.log(`User ${uid} suspension status updated to ${suspended}`);
  } catch (error) {
    console.error('Error updating user suspension:', error);
    throw error;
  }
}

export async function updateUserProfile(
  uid: string,
  data: Partial<UserProfile>,
): Promise<void> {
  const userRef = ref(database, `users/${uid}`);
  try {
    await update(userRef, data);
    console.log(`User ${uid} profile updated`, data);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

export async function deleteUser(uid: string): Promise<void> {
  const userRef = ref(database, `users/${uid}`);
  try {
    await remove(userRef);
    console.log(`User ${uid} deleted`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

// Application Functions
export async function submitApplication(
  data: Omit<ContributorApplication, 'id' | 'status' | 'date'>,
): Promise<void> {
  const applicationsRef = ref(database, 'applications');
  const newApplicationRef = push(applicationsRef);

  const application: ContributorApplication = {
    ...data,
    id: newApplicationRef.key!,
    status: 'pending',
    date: new Date().toISOString(),
  };

  try {
    await set(newApplicationRef, application);
    console.log('Application submitted:', application.id);
  } catch (error) {
    console.error('Error submitting application:', error);
    throw error;
  }
}

export async function getApplications(): Promise<ContributorApplication[]> {
  const applicationsRef = ref(database, 'applications');
  try {
    const snapshot = await get(applicationsRef);
    if (!snapshot.exists()) return [];
    const applications: ContributorApplication[] = [];
    snapshot.forEach((childSnapshot) => {
      applications.push(childSnapshot.val());
    });
    return applications.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  } catch (error) {
    console.error('Error fetching applications:', error);
    return [];
  }
}

export async function deleteApplication(id: string): Promise<void> {
  const applicationRef = ref(database, `applications/${id}`);
  try {
    await remove(applicationRef);
    console.log(`Application ${id} deleted`);
  } catch (error) {
    console.error('Error deleting application:', error);
    throw error;
  }
}

export async function createUserProfile(user: UserProfile): Promise<void> {
  const userRef = ref(database, `users/${user.uid}`);
  try {
    const snapshot = await get(userRef);
    if (!snapshot.exists()) {
      await set(userRef, user);
      console.log('User profile created:', user.uid);
    }
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
}
